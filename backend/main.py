from contextlib import asynccontextmanager
from typing import Any, Dict, List

import uvicorn
from app.agents import architect_agent, planner_agent
from app.tools import available_tools
from app.utils import (
    get_workflow_from_db,
    init_db,
    json_to_strands_graph,
    list_workflows_for_user,
    login_user,
    register_user,
    save_workflow,
)
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


# =========================
# 🌱 App Lifespan
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on app startup."""
    init_db()
    yield


app = FastAPI(
    title="Workflow Orchestrator",
    description="Generate, list, and execute Strands-based workflows",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# 🚀 Endpoints
# =========================


@app.post("/workflow/generate")
async def workflow_generator(
    user_id: str = Query(..., description="User ID for which to generate workflow"),
    description: str = Query(..., description="Description of the workflow"),
) -> Dict[str, Any]:
    """
    Generate a workflow by planning and architecting its structure.
    Saves the workflow to the database and returns its ID.
    """
    try:
        plan = planner_agent(description).message["content"][0]["text"]
        architecture = architect_agent(plan).message["content"][0]["text"]
        workflow_id = save_workflow(user_id, description, architecture)
        return {"workflow_id": workflow_id, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate workflow: {e}")


@app.get("/workflow/list")
async def list_workflows(
    user_id: str = Query(..., description="User ID"),
) -> List[Dict[str, Any]]:
    """
    List all workflows belonging to a user.
    """
    try:
        workflows = list_workflows_for_user(user_id)
        return workflows
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list workflows: {e}")


@app.get("/workflow/execute")
async def execute_workflow(
    workflow_id: str = Query(..., description="Workflow ID to execute"),
    input: str = Query(..., description="Input to run the workflow"),
) -> Dict[str, Any]:
    """
    Execute a workflow using the given input and return the final result.
    """
    try:
        workflow_json = get_workflow_from_db(workflow_id)
        graph = json_to_strands_graph(workflow_json, available_tools)
        response = graph(input)
        last_key = list(response.results.keys())[-1]
        final_result = response.results[last_key].result.message["content"][0]["text"]
        return {"workflow_id": workflow_id, "result": final_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {e}")


@app.post("/user/register")
async def register(
    username: str = Query(..., description="Unique username for the user"),
    password: str = Query(..., description="Password for the user account"),
) -> Dict[str, Any]:
    """
    Register a new user with a username and password.

    Returns a success message if registration is successful,
    or an error message if the username already exists or another error occurs.
    """
    success, message = register_user(username, password)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}


@app.post("/user/login")
async def login(
    username: str = Query(..., description="Username of the user"),
    password: str = Query(..., description="Password of the user"),
) -> Dict[str, Any]:
    """
    Login a user using their username and password.

    Returns a success message and the user ID if authentication is successful,
    or an error message if credentials are invalid.
    """
    success, user_id = login_user(username, password)
    if not success:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful", "user_id": user_id}


# =========================
# 🧠 Run the Server
# =========================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
