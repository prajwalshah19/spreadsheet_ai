import uuid
from fastapi import APIRouter, HTTPException
from ..models import ChatRequest, ChatResponse, SheetSpec, PreviewPayload
from typing import Dict

router = APIRouter(prefix="", tags=["chat"])

# Stateless approach - no server-side state needed

def _demo_modified_spec() -> SheetSpec:
    return SheetSpec(
        title="Preview (Boilerplate Only) · Iteration",
        columns=[
            {"name": "Month", "type": "date"},
            {"name": "Plan MRR", "type": "currency"},
            {"name": "Actual MRR", "type": "currency"},
            {"name": "Delta", "type": "computed", "formula_template": "=C{row}-B{row}"},
            {"name": "Growth %", "type": "computed", "formula_template": "=(C{row}-B{row})/B{row}"},
        ],
        rows=[
            {"Month": "2025-01-01", "Plan MRR": 10000, "Actual MRR": 9500},
            {"Month": "2025-02-01", "Plan MRR": 11000, "Actual MRR": 11200},
        ],
        summary=[
            {"label": "Total Plan", "op": "SUM", "column": "Plan MRR"},
            {"label": "Total Actual", "op": "SUM", "column": "Actual MRR"},
        ],
        chart={"kind": "line", "title": "Plan vs Actual", "x_axis": "Month", "series": ["Plan MRR","Actual MRR"]},
    )

@router.post("/reiterate", response_model=ChatResponse)
async def reiterate(req: ChatRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Missing prompt")
    
    # Validate turn number for reiterate endpoint
    if req.turn < 2:
        raise HTTPException(status_code=400, detail="Reiterate endpoint must be called with turn>=2")

    # TODO(LIVE): call Gemini with prior context + req.prompt; validate to SheetSpec
    spec = _demo_modified_spec()

    # TODO(LIVE): bytes, preview = build_workbook_bytes(spec)
    preview = PreviewPayload(
        id=str(uuid.uuid4())[:8],
        title=spec.title,
        columns=[c.name for c in spec.columns],
        rows=spec.rows[:20],
    )

    return ChatResponse(
        justification="Applied your refinement to the existing sheet. (Demo stub)",
        spec=spec,
        preview=preview,
        file=None,
        turn=req.turn,  # Return the turn number that was sent
    ) 