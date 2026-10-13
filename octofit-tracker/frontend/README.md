# OctoFit Tracker frontend

The React 19 and Vite presentation tier uses the Express API on port `8000`.

## Run locally

```bash
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```

When `VITE_CODESPACE_NAME` is unset, the frontend calls `http://localhost:8000`.
For Codespaces, create `octofit-tracker/frontend/.env.local` with the Codespace
name (not the full URL):

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads environment variables when it starts, so restart the dev server after
changing `.env.local`.
