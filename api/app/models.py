from typing import List, Literal, Optional, Dict, Union
from pydantic import BaseModel, Field

ColType = Literal["string", "number", "date", "currency", "percent", "computed"]

class Column(BaseModel):
    name: str
    type: ColType
    formula_template: Optional[str] = None

class SummaryItem(BaseModel):
    label: str
    op: Literal["SUM", "AVG"]
    column: str

class ChartSpec(BaseModel):
    kind: Literal["bar", "line"]
    title: str
    x_axis: str
    series: List[str]

class SheetSpec(BaseModel):
    title: str = "Sheet1"
    columns: List[Column]
    rows: List[Dict[str, Union[str, float, int]]] = Field(default_factory=list)
    summary: List[SummaryItem] = Field(default_factory=list)
    chart: Optional[ChartSpec] = None

class PreviewPayload(BaseModel):
    id: str
    title: str
    columns: List[str]
    rows: List[Dict[str, Union[str, float, int]]]

# Chat contracts
class ChatRequest(BaseModel):
    thread_id: str
    prompt: str
    turn: int  # Client tracks turn number

class ChatResponse(BaseModel):
    justification: str
    spec: SheetSpec
    preview: PreviewPayload
    file: Optional[str] = None
    turn: int  # Server validates and returns turn 