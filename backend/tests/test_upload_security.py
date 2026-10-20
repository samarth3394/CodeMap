import io
import zipfile
import pytest
from httpx import AsyncClient


def create_valid_zip() -> io.BytesIO:
    """Generate in-memory valid Python repository archive."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "app/main.py",
            "class AppServer:\n    def start(self):\n        return True\n",
        )
        zf.writestr(
            "app/services/auth.py",
            "def verify_token(token: str) -> bool:\n    return len(token) > 0\n",
        )
    buf.seek(0)
    return buf


def create_zip_slip_malicious_archive() -> io.BytesIO:
    """Generate in-memory ZIP archive with Zip Slip directory traversal filename."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        # Dangerous path traversal entry
        zf.writestr(
            "../../etc/cron.d/malicious_job.py",
            "# Malicious payload attempting escape\n",
        )
    buf.seek(0)
    return buf


def create_symlink_malicious_archive() -> io.BytesIO:
    """Generate in-memory ZIP archive with unsafe symlink."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zinfo = zipfile.ZipInfo("symlink_to_root")
        # UNIX symlink flag (0o120000)
        zinfo.external_attr = 0o120777 << 16
        zf.writestr(zinfo, "/etc/passwd")
    buf.seek(0)
    return buf


@pytest.mark.asyncio
async def test_upload_valid_python_zip(client: AsyncClient, auth_headers_a):
    # 1. Create project
    create_res = await client.post(
        "/api/v1/projects",
        json={"name": "Safe Python Repository"},
        headers=auth_headers_a,
    )
    assert create_res.status_code == 201
    project_id = create_res.json()["id"]

    # 2. Upload valid archive
    zip_bytes = create_valid_zip()
    files = {"file": ("repo.zip", zip_bytes.getvalue(), "application/zip")}

    upload_res = await client.post(
        f"/api/v1/projects/{project_id}/upload-zip",
        files=files,
        headers=auth_headers_a,
    )
    assert upload_res.status_code == 200
    data = upload_res.json()
    assert data["status"] == "ready"
    assert data["progress"] == 100
    assert data["stats"]["filesCount"] == 2
    assert data["stats"]["symbolsCount"] >= 2


@pytest.mark.asyncio
async def test_upload_rejects_non_zip_file(client: AsyncClient, auth_headers_a):
    create_res = await client.post(
        "/api/v1/projects",
        json={"name": "Non-zip Test"},
        headers=auth_headers_a,
    )
    project_id = create_res.json()["id"]

    # Attempt to upload plain text
    files = {"file": ("exploit.txt", b"plain text script", "text/plain")}
    upload_res = await client.post(
        f"/api/v1/projects/{project_id}/upload-zip",
        files=files,
        headers=auth_headers_a,
    )
    assert upload_res.status_code == 400
    assert "only standard .zip" in upload_res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_upload_blocks_path_traversal_zip_slip(client: AsyncClient, auth_headers_a):
    create_res = await client.post(
        "/api/v1/projects",
        json={"name": "Zip Slip Attack Vector Test"},
        headers=auth_headers_a,
    )
    project_id = create_res.json()["id"]

    # Upload malicious zip slip archive
    malicious_zip = create_zip_slip_malicious_archive()
    files = {"file": ("malicious.zip", malicious_zip.getvalue(), "application/zip")}

    upload_res = await client.post(
        f"/api/v1/projects/{project_id}/upload-zip",
        files=files,
        headers=auth_headers_a,
    )
    # MUST be blocked with 400
    assert upload_res.status_code == 400
    assert "path traversal" in upload_res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_upload_blocks_unsafe_symlinks(client: AsyncClient, auth_headers_a):
    create_res = await client.post(
        "/api/v1/projects",
        json={"name": "Symlink Attack Vector Test"},
        headers=auth_headers_a,
    )
    project_id = create_res.json()["id"]

    symlink_zip = create_symlink_malicious_archive()
    files = {"file": ("symlink.zip", symlink_zip.getvalue(), "application/zip")}

    upload_res = await client.post(
        f"/api/v1/projects/{project_id}/upload-zip",
        files=files,
        headers=auth_headers_a,
    )
    assert upload_res.status_code == 400
    assert "symlink" in upload_res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_upload_permission_enforcement(
    client: AsyncClient, auth_headers_a, auth_headers_b
):
    # User A creates project
    create_res = await client.post(
        "/api/v1/projects",
        json={"name": "Alice Private Project"},
        headers=auth_headers_a,
    )
    project_id = create_res.json()["id"]

    # User B tries to upload files into User A's project
    zip_bytes = create_valid_zip()
    files = {"file": ("repo.zip", zip_bytes.getvalue(), "application/zip")}

    upload_res = await client.post(
        f"/api/v1/projects/{project_id}/upload-zip",
        files=files,
        headers=auth_headers_b,
    )
    # User B is forbidden
    assert upload_res.status_code == 403
