from strands import Agent

from .models import bedrock_model
from .prompts import architect_prompt, planner_prompt

# Planner Agent
# ===========================
planner_agent = Agent(
    name="WorkflowPlanner",
    system_prompt=planner_prompt(),
    model=bedrock_model,
    # callback_handler=None,
)


# Planner Agent
# ===========================
architect_agent = Agent(
    name="WorkflowArchitect",
    system_prompt=architect_prompt(),
    model=bedrock_model,
    # callback_handler=None,
)


