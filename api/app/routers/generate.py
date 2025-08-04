import uuid
from fastapi import APIRouter, HTTPException
from ..models import ChatRequest, ChatResponse, SheetSpec, PreviewPayload
from typing import Dict
from datetime import date

router = APIRouter(prefix="", tags=["chat"])

# Stateless approach - no server-side state needed

SYSTEM_PROMPT = """
You produce ONLY JSON matching this schema:
{ ...schema omitted for brevity ... }
"""

def _demo_spec() -> SheetSpec:
    return SheetSpec(
        title="Preview (Boilerplate Only)",
        columns=[
            {"name": "Month", "type": "date"},
            {"name": "Plan MRR", "type": "currency"},
            {"name": "Actual MRR", "type": "currency"},
            {"name": "Delta", "type": "computed", "formula_template": "=C{row}-B{row}"},
        ],
        rows=[
            {"Month": "2025-01-01", "Plan MRR": 10000, "Actual MRR": 9500},
            {"Month": "2025-02-01", "Plan MRR": 11000, "Actual MRR": 11200},
        ],
        summary=[{"label": "Total Plan", "op": "SUM", "column": "Plan MRR"}],
        chart={"kind": "line", "title": "Plan vs Actual", "x_axis": "Month", "series": ["Plan MRR","Actual MRR"]},
    )

@router.post("/generate", response_model=ChatResponse)
async def generate(req: ChatRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Missing prompt")
    
    # Validate turn number for generate endpoint
    if req.turn != 1:
        raise HTTPException(status_code=400, detail="Generate endpoint must be called with turn=1")

    # TODO(LIVE): call Gemini with SYSTEM_PROMPT + req.prompt, validate to SheetSpec
    spec = _demo_spec()

    # TODO(LIVE): bytes, preview = build_workbook_bytes(spec)
    preview = PreviewPayload(
        id=str(uuid.uuid4())[:8],
        title=spec.title,
        columns=[c.name for c in spec.columns],
        rows=spec.rows[:20],
    )

    return ChatResponse(
        justification="Created an initial spreadsheet spec from your description. (Demo stub)",
        spec=spec,
        preview=preview,
        file=None,
        turn=1,  # Always return turn=1 for generate
    )

@router.get("/download/{file_id}.xlsx")
async def download(file_id: str):
    """
    Optional: implement in-memory or temp-file serving.
    TODO(LIVE): store bytes after build_workbook_bytes and return as attachment.
    """
    raise HTTPException(status_code=501, detail="Download not implemented yet") 