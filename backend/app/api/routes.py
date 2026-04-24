from fastapi import APIRouter
from app.schemas.workflow import WorkflowPayload
import time

router = APIRouter()

@router.get("/automations")
def get_automations():
    """Returns mock automated actions for the frontend to display."""
    return [
        {"id": "send_email", "name": "Send Email", "icon": "Mail"},
        {"id": "slack_msg", "name": "Slack Message", "icon": "MessageSquare"},
        {"id": "update_db", "name": "Update Database", "icon": "Database"},
        {"id": "api_call", "name": "External API Call", "icon": "Globe"}
    ]

@router.post("/simulate")
def simulate_workflow(payload: WorkflowPayload):
    """Mocks a workflow simulation and returns an execution log."""
    logs = []
    
    if not payload.nodes:
        return {"status": "error", "logs": ["Error: Workflow is empty."]}

    # Check for Start Node
    start_nodes = [n for n in payload.nodes if n.data.get("nodeType") == "start"]
    if not start_nodes:
        return {"status": "error", "logs": ["Error: No Start Node found."]}
    
    logs.append("Simulation Started...")
    
    # Simulate step-by-step execution
    for node in payload.nodes:
        node_type = node.data.get("nodeType", "Unknown").upper()
        label = node.data.get("label", node.data.get("title", "Unnamed Step"))
        logs.append(f"Executing [{node_type}]: {label}")
        
    logs.append("Workflow Execution Completed Successfully.")

    return {
        "status": "success",
        "logs": logs
    }