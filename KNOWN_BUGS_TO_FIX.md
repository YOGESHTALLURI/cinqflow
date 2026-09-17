# CINQFLOW Known Issues & Technical Debt Backlog

## Issue 1: POST /api/pipelines/run 404 Route on Render Backend
- **Symptom**: Triggering pipeline execution on deployed frontend logs `POST https://cinqflow-backend.onrender.com/api/pipelines/run 404 (Not Found)`.
- **Behavior**: Frontend gracefully catches backend error and falls back to local simulation trace log so the UI does not crash.
- **Root Cause**: Backend endpoint path mismatch or parameter formatting on Render deployment (`/api/pipelines/run` endpoint expects specific feedId / body payload).
- **Action Required**: Verify Express route definition in `server/src/index.ts` and ensure route is registered properly on production build.
