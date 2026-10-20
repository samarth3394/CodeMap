# CodeMap Backend API (Stage 2)

A production-grade Python backend built with **FastAPI**, **SQLAlchemy** (async), **Alembic**, **Pydantic V2**, and **PostgreSQL / SQLite**.

## Overview & Capabilities

1. **Authentication & Identity**:
   - Secure account registration, JWT token authentication, and profile fetching.
   - Passwords hashed using standard `bcrypt` (12 rounds) with salt.
   - Protected route dependencies (`get_current_user`, `get_optional_user`).
   - Password reset workflow with time-limited tokens.
2. **Project CRUD & Authorization**:
   - Create, list, inspect, update, and delete projects.
   - Strict server-side ownership isolation: users cannot access, modify, or delete repositories belonging to others.
3. **Safe ZIP Archive Uploads**:
   - Accepts `.zip` archives of Python repositories.
   - Magic byte verification (`PK\x03\x04`).
   - Anti-traversal protection (Zip Slip) using `os.path.commonpath`.
   - Symlink rejection to prevent reading host system files.
   - Zip bomb / decompression bomb protection limiting uncompressed size (250MB limit) and max files (2,500).
   - Safe static AST parsing (`ast.parse`) with **ZERO code execution**.
4. **GitHub Integration (Safe Detection)**:
   - Status endpoint `/api/v1/github/status`.
   - If OAuth / GitHub App keys are missing, displays a setup guide instead of faking authentication or failing silently.
5. **Real-time Upload & Progress**:
   - XHR progress streaming with cancellation support and retry states on the frontend.
6. **Automated Test Suite**:
   - 16 comprehensive async test cases covering authentication, project authorization, and upload security defenses.

---

## Prerequisites

- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** & **npm**

---

## Local Setup Instructions

### 1. Create and Activate Virtual Environment

```bash
cd backend
python -m venv .venv

# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Or Windows (Command Prompt):
.venv\Scripts\activate.bat
# Linux / macOS:
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Key environment variables:
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `SECRET_KEY` | *(Set a secure string)* | Used to sign JWT session tokens |
| `DATABASE_URL` | `sqlite+aiosqlite:///./codemap.db` | Async database connection string (SQLite or PostgreSQL) |
| `STORAGE_DIR` | `storage_repos` | Extracted repository directory |
| `MAX_ZIP_UPLOAD_SIZE_BYTES` | `52428800` (50MB) | Max upload size limit |
| `CORS_ORIGINS` | `http://localhost:5173,...` | Allowed web frontend origins |
| `GITHUB_CLIENT_ID` | `""` | Optional GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | `""` | Optional GitHub OAuth Client Secret |

### 4. Run Database Migrations

```bash
# Run migrations using Alembic
alembic upgrade head
```

### 5. Launch the Backend Server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The interactive API documentation is accessible at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check**: [http://127.0.0.1:8000/healthz](http://127.0.0.1:8000/healthz)

---

## Running the Automated Tests

From the project root:

```bash
backend\.venv\Scripts\pytest -v
```

All 16 test cases test:
- `test_auth.py`: Signup, duplicate rejection, short password validation, login, profile fetch, unauthorized rejection, password reset flow.
- `test_projects.py`: Authenticated project creation, unauthenticated rejection, cross-user project permission isolation.
- `test_upload_security.py`: Python ZIP parsing, non-zip file rejection, Zip Slip directory traversal blocking, unsafe symlink rejection, cross-user upload permission enforcement.

---

## Security Safeguards

1. **Passwords**: Direct `bcrypt` hashing with salt (12 work factor). Plaintext passwords are never stored or logged.
2. **Path Traversal Protection**: Every extracted entry is resolved and verified against the repository's base directory with `os.path.commonpath`.
3. **Zip Bomb Mitigation**: Cumulative extracted bytes are tracked; extracting stops immediately if total size exceeds 250MB or file count exceeds 2,500.
4. **Zero Code Execution**: Code is analyzed purely statically using Python's standard `ast.parse`. No uploaded code is ever imported, eval'd, or executed.
5. **Token Security**: Tokens are stored client-side in localStorage and transmitted via `Authorization: Bearer <token>` headers.
