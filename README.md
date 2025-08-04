# AI → Spreadsheet MVP (Boilerplate)

This is a **boilerplate-only** monorepo for an MVP that turns a natural-language prompt into a downloadable **.xlsx** file with a quick HTML preview.

**Stack**
- Frontend: Next.js (App Router, TypeScript) - **Client-Side Rendered**
- Backend: FastAPI (Python)
- (Planned) AI: Gemini via server (not implemented here)

## How it works (intended)
1. User types a prompt → Next.js posts to FastAPI `/generate`.
2. FastAPI calls Gemini (server-side) to get a **strict JSON sheet spec** (NOT implemented).
3. FastAPI transforms spec → `.xlsx` (NOT implemented) and returns a download + preview JSON.
4. Next.js renders a preview table and shows a download link.

## Dev setup

### Backend (api/)
```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env
# Edit .env with GEMINI_API_KEY if needed later
uvicorn app.main:app --reload --port 8000
```

### Frontend (web/)
```bash
cd web
npm install
cp env.local.example .env.local
npm run dev
```

* Web runs on `http://localhost:3000` (CSR - no SSR overhead)
* API runs on `http://localhost:8000`

## Deployment

### Static Export (Frontend)
```bash
cd web
npm run build
# The static files will be in the `out/` directory
# Serve with any static file server (nginx, Apache, etc.)

# Or serve locally for testing:
npm run serve-static  # Serves on http://localhost:3001
```

### API Deployment
```bash
cd api
# Deploy to your preferred Python hosting (Railway, Heroku, etc.)
```

## Live-coding TODOs

* Implement Gemini call in `api/app/routers/generate.py` (**TODO(LIVE)**).
* Implement JSON→XLSX in `api/app/xlsx.py` (**TODO(LIVE)**).
* Implement CSV export util in `web/lib/toCsv.ts` (**TODO(LIVE)**).
* Optional refine flow in `api/app/routers/generate.py` (**TODO(LIVE)**).

## Acceptance criteria (for the MVP)

1. From a prompt, API returns **preview JSON** and a downloadable `.xlsx` (after you implement TODOs).
2. The preview table renders the same columns as the sheet.
3. Errors are handled gracefully with a user-facing message.

---

## Notes

* CORS is enabled for local dev.
* Frontend is **Client-Side Rendered** for simplicity and faster development.
* No AI logic or workbook-building logic is included—only stubs.
* Tests include a skipped test to guide workbook builder implementation.
