
# HR Workflow Designer - Tredence Case Study

## Overview
This project is a functional prototype of a mini-HR Workflow Designer module. It allows HR admins to visually create and test internal workflows using a drag-and-drop canvas.

## Architecture
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui.
- **Workflow Canvas**: React Flow is used to manage the node-based UI and graph state.
- **Backend (Mocked)**: API interactions are currently mocked for automation fetching and workflow simulation.

## Design Decisions
- Used standard modular component design, separating `Canvas`, `Nodes`, `Forms`, and `API` logic.
- Managed form state dynamically based on the selected node type using controlled components.

## Assumptions
- No authentication or database persistence is currently implemented, as per the requirements.
- The simulation runs sequentially based on graph edges.

## How to Run the Frontend
1. cd frontend
2. npm install
3. npm run dev