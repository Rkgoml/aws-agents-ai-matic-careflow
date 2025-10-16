import hashlib
import json
import sqlite3
import uuid
from typing import Optional

import requests
import streamlit as st

# Configuration
API_BASE_URL = "http://localhost:8000"
DB_FILE = "workflows.db"


# Initialize Database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Workflows table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workflows (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            description TEXT NOT NULL,
            architecture TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Execution history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS execution_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workflow_id TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            input TEXT NOT NULL,
            output TEXT NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (workflow_id) REFERENCES workflows(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()


# User Authentication
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def register_user(username: str, password: str) -> tuple[bool, str]:
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        hashed_pw = hash_password(password)
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, hashed_pw),
        )
        conn.commit()
        conn.close()
        return True, "Registration successful!"
    except sqlite3.IntegrityError:
        return False, "Username already exists"
    except Exception as e:
        return False, f"Error: {str(e)}"


def login_user(username: str, password: str) -> tuple[bool, Optional[int]]:
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        hashed_pw = hash_password(password)
        cursor.execute(
            "SELECT id FROM users WHERE username = ? AND password = ?",
            (username, hashed_pw),
        )
        result = cursor.fetchone()
        conn.close()

        if result:
            return True, result[0]
        return False, None
    except Exception as e:
        st.error(f"Error: {str(e)}")
        return False, None


# Workflow Management
def save_workflow(user_id: int, description: str, architecture: str) -> str:
    workflow_id = str(uuid.uuid4())
    try:
        workflow_dict = json.loads(architecture)
        print("$" * 20)
        print(workflow_dict)
        print("$" * 20)
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO workflows (id, user_id, description, architecture) VALUES (?, ?, ?, ?)",
            (workflow_id, user_id, description, architecture),
        )
        conn.commit()
        conn.close()
        return workflow_id
    except Exception as e:
        st.error(f"Error saving workflow: {str(e)}")
        return None


def get_user_workflows(user_id: int):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, description, created_at FROM workflows WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        )
        workflows = cursor.fetchall()
        conn.close()
        return workflows
    except Exception as e:
        st.error(f"Error fetching workflows: {str(e)}")
        return []


def get_workflow(workflow_id: str):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, description, architecture, created_at FROM workflows WHERE id = ?",
            (workflow_id,),
        )
        workflow = cursor.fetchone()
        conn.close()
        return workflow
    except Exception as e:
        st.error(f"Error fetching workflow: {str(e)}")
        return None


def save_execution(workflow_id: str, user_id: int, input_text: str, output: str):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO execution_history (workflow_id, user_id, input, output) VALUES (?, ?, ?, ?)",
            (workflow_id, user_id, input_text, output),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        st.error(f"Error saving execution: {str(e)}")


def get_execution_history(workflow_id: str, limit: int = 50):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT input, output, executed_at FROM execution_history WHERE workflow_id = ? ORDER BY executed_at DESC LIMIT ?",
            (workflow_id, limit),
        )
        history = cursor.fetchall()
        conn.close()
        return history
    except Exception as e:
        st.error(f"Error fetching history: {str(e)}")
        return []


# API Calls
def generate_workflow(description: str) -> Optional[str]:
    try:
        response = requests.post(
            f"{API_BASE_URL}/workflow/generate",
            params={"description": description},
            timeout=60,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error generating workflow: {str(e)}")
        return None


def execute_workflow(workflow_id: str, input_text: str) -> Optional[str]:
    try:
        response = requests.get(
            f"{API_BASE_URL}/workflow/execute",
            params={"workflow_id": workflow_id, "input": input_text},
            timeout=420,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error executing workflow: {str(e)}")
        return None


# UI Components
def show_login_page():
    st.title("🔐 Workflow Manager")

    tab1, tab2 = st.tabs(["Login", "Register"])

    with tab1:
        st.subheader("Login")
        username = st.text_input("Username", key="login_username")
        password = st.text_input("Password", type="password", key="login_password")

        if st.button("Login", key="login_btn"):
            if username and password:
                success, user_id = login_user(username, password)
                if success:
                    st.session_state.user_id = user_id
                    st.session_state.username = username
                    st.session_state.logged_in = True
                    st.success("Login successful!")
                    st.rerun()
                else:
                    st.error("Invalid username or password")
            else:
                st.warning("Please enter username and password")

    with tab2:
        st.subheader("Register")
        new_username = st.text_input("Username", key="register_username")
        new_password = st.text_input(
            "Password", type="password", key="register_password"
        )
        confirm_password = st.text_input(
            "Confirm Password", type="password", key="confirm_password"
        )

        if st.button("Register", key="register_btn"):
            if new_username and new_password:
                if new_password != confirm_password:
                    st.error("Passwords don't match")
                elif len(new_password) < 6:
                    st.warning("Password must be at least 6 characters")
                else:
                    success, message = register_user(new_username, new_password)
                    if success:
                        st.success(message)
                    else:
                        st.error(message)
            else:
                st.warning("Please fill all fields")


def show_workflow_generator():
    st.subheader("✨ Generate New Workflow")

    description = st.text_area(
        "Describe your workflow",
        placeholder="e.g., Create a workflow that processes user data and generates reports",
        height=100,
    )

    col1, col2 = st.columns([3, 1])

    with col1:
        if st.button("Generate Workflow", type="primary", use_container_width=True):
            if description:
                with st.spinner("Generating workflow..."):
                    architecture = generate_workflow(description)
                    if architecture:
                        workflow_id = save_workflow(
                            st.session_state.user_id,
                            description,
                            json.dumps(architecture),
                        )
                        st.session_state.generated_workflow_id = workflow_id
                        st.success("✅ Workflow generated and saved!")
                        st.info(f"Workflow ID: {workflow_id}")
                        st.rerun()
            else:
                st.warning("Please enter a workflow description")


def show_workflow_selector():
    st.subheader("📋 Your Workflows")

    workflows = get_user_workflows(st.session_state.user_id)

    if not workflows:
        st.info("No workflows yet. Create one using the generator above!")
        return None

    workflow_options = {
        f"{desc} ({wf_id[:8]}...)": wf_id for wf_id, desc, _ in workflows
    }
    selected = st.selectbox("Select a workflow", list(workflow_options.keys()))

    if selected:
        return workflow_options[selected]
    return None


def show_chat_interface(workflow_id: str):
    workflow = get_workflow(workflow_id)
    if not workflow:
        st.error("Workflow not found")
        return

    wf_id, description, architecture, created_at = workflow

    st.subheader(f"💬 Chat - {description[:50]}...")
    st.caption(f"Workflow ID: {wf_id} | Created: {created_at}")

    with st.expander("📝 View Architecture"):
        st.json(json.loads(architecture))

    # Chat input
    col1, col2 = st.columns([4, 1])
    with col1:
        # st.text(type(json.loads(architecture)))
        user_input = st.text_input("Enter your input:")
    with col2:
        execute_btn = st.button("Execute", type="primary")

    if execute_btn and user_input:
        with st.spinner("Executing workflow..."):
            result = execute_workflow(workflow_id, user_input)
            if result:
                save_execution(
                    workflow_id,
                    st.session_state.user_id,
                    user_input,
                    json.dumps(result),
                )
                st.success("✅ Execution completed!")
                with st.expander("📝 View Result"):
                    st.json(result)
                st.write(result["content"][0]["text"])

    # Execution history
    st.divider()
    st.subheader("📜 Execution History")

    history = get_execution_history(workflow_id)
    if history:
        for i, (inp, out, exec_time) in enumerate(history, 1):
            with st.expander(f"Execution {i} - {exec_time}"):
                st.write("**Input:**")
                st.write(inp)
                st.write("**Output:**")
                st.json(json.loads(out) if isinstance(out, str) else out)
    else:
        st.info("No execution history yet")


# Main App
def main():
    st.set_page_config(page_title="Workflow Manager", page_icon="🚀", layout="wide")

    # Initialize database
    init_db()

    # Session state
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False

    if not st.session_state.logged_in:
        show_login_page()
    else:
        # Sidebar
        with st.sidebar:
            st.write(f"👤 **Logged in as:** {st.session_state.username}")
            if st.button("🚪 Logout", use_container_width=True):
                st.session_state.logged_in = False
                st.session_state.user_id = None
                st.session_state.username = None
                st.rerun()

        # Main content
        st.title("🚀 Workflow Manager")

        tab1, tab2 = st.tabs(["Generate", "Execute"])

        with tab1:
            show_workflow_generator()

        with tab2:
            selected_workflow = show_workflow_selector()

            if selected_workflow:
                st.divider()
                show_chat_interface(selected_workflow)


if __name__ == "__main__":
    main()
