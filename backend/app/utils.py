import hashlib
import json
import sqlite3
import traceback
from typing import Optional
import uuid
from functools import lru_cache

from fastapi import HTTPException
from strands import Agent
from strands.multiagent import GraphBuilder

from .models import bedrock_model


DB_FILE = "workflows.db"


def json_to_strands_graph(workflow_json, available_tools):
    builder = GraphBuilder()
    builder.set_execution_timeout(600)  # 10 minute timeout

    # 1. Create agents for each node
    nodes = {}
    try:
        for node in workflow_json["nodes"]:
            print(node)
            agent = Agent(
                model=bedrock_model,
                name=node["agent_name"],
                system_prompt=node["agent_system_prompt"],
                tools=available_tools,  # Assuming tools are pre-defined
            )
            nodes[node["node_id"]] = agent
            builder.add_node(agent, node["node_id"])

        # 2. Add standard edges
        for edge in workflow_json["edges"]:
            builder.add_edge(edge["from"], edge["to"])

        # 3. Add conditional edges (if any)
        for cond_edge in workflow_json.get("conditional_edges", []):
            # Assuming cond_edge has 'from', 'to', and 'condition' (a function or logic)
            # For Strands, you need to define the condition function separately
            # Here, we just add the edge; you'll need to define the condition logic elsewhere
            builder.add_conditional_edge(
                cond_edge["from"],
                cond_edge["to"],
                condition=cond_edge["condition"],  # This should be a callable
            )

        builder.set_entry_point(workflow_json["entry_point"])


        return builder.build()
    except Exception:
        traceback.print_exc()


@lru_cache(maxsize=128)
def get_workflow_from_db(workflow_id: str) -> dict:
    """Fetch workflow architecture from database"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT architecture FROM workflows WHERE id = ?", (workflow_id,)
        )
        result = cursor.fetchone()
        conn.close()

        if not result:
            raise HTTPException(status_code=404, detail="Workflow not found")

        architecture = result[0]
        try:
            data = json.loads(architecture)
            data = json.loads(data)
            return data
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400, detail="Invalid workflow architecture JSON"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


def save_workflow(
    user_id: int, description: str, architecture: str
) -> str:
    workflow_id = str(uuid.uuid4())
    architecture_json = json.dumps(architecture)
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO workflows (id, user_id, description, architecture) VALUES (?, ?, ?, ?)",
            (workflow_id, user_id, description, architecture_json),
        )
        conn.commit()
        conn.close()
        return workflow_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving workflow: {str(e)}")
        return None


def list_workflows_for_user(user_id: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, description, architecture, created_at
        FROM workflows
        WHERE user_id = ?
        ORDER BY created_at DESC
    """,
        (user_id,),
    )

    workflows = cursor.fetchall()

    conn.close()

    # Convert the tuples to readable dicts
    workflow_list = [
        {
            "id": row[0],
            "description": row[1],
            "architecture": row[2],
            "created_at": row[3],
        }
        for row in workflows
    ]

    return workflow_list


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



# ------------------------------
# Password Hashing
# ------------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ------------------------------
# User Authentication Functions
# ------------------------------
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
    except Exception as _:
        return False, None