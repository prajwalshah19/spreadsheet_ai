from typing import Tuple, Dict, Any
from io import BytesIO
from .models import SheetSpec

# NOTE: Boilerplate only. No real workbook logic here.

# TODO(LIVE): implement build_workbook_bytes(spec) using openpyxl:
# - create workbook and worksheet
# - write headers and rows
# - apply number formats (date, currency, percent)
# - computed columns: replace {row} in formula_template per row
# - add optional summary row
# - add optional chart (bar/line)
# - return (bytes, preview_json)

def build_workbook_bytes(_spec: SheetSpec) -> Tuple[bytes, Dict[str, Any]]:
    """
    TODO(LIVE): Implement with openpyxl and return (xlsx_bytes, preview_json)
    preview_json shape:
    {
        "id": "<short-id>",
        "title": str,
        "columns": [str, ...],
        "rows": [ {colName: value}, ... ]   # limited to first ~20 rows
    }
    """
    raise NotImplementedError("TODO(LIVE): implement build_workbook_bytes") 