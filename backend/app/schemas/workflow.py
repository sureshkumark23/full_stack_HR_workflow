from pydantic import BaseModel
from typing import List, Dict, Any

class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]
    
class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class WorkflowPayload(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]