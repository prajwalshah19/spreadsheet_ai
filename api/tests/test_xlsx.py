import pytest
from app.models import SheetSpec, Column

@pytest.mark.skip(reason="TODO(LIVE): implement build_workbook_bytes and unskip")
def test_build_workbook_bytes_returns_preview_and_bytes():
    spec = SheetSpec(
        title="Test",
        columns=[
            Column(name="A", type="number"),
            Column(name="B", type="number"),
            Column(name="C", type="computed", formula_template="=B{row}-A{row}"),
        ],
        rows=[{"A": 1, "B": 2}, {"A": 3, "B": 5}],
        summary=[]
    )
    
    from app.xlsx import build_workbook_bytes
    xlsx_bytes, preview = build_workbook_bytes(spec)
    
    assert isinstance(xlsx_bytes, (bytes, bytearray))
    assert preview["columns"] == ["A", "B", "C"]
    assert len(preview["rows"]) == 2 