from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_user
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    ProjectUploadStatusResponse,
)
from app.services.project_service import ProjectService
from app.services.zip_service import ZipService

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List projects for the authenticated user + public sample projects.
    Unauthenticated users can explore public sample projects.
    """
    items, total = await ProjectService.list_user_projects(
        db, user=current_user, skip=skip, limit=limit, search=search
    )
    return ProjectListResponse(items=items, total=total)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new project workspace under current user account."""
    return await ProjectService.create_project(db, user=current_user, project_in=project_in)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve details of a project by its unique ID."""
    return await ProjectService.get_project_by_id(db, project_id=project_id, user=current_user)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    update_in: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update project metadata (owner only)."""
    return await ProjectService.update_project(
        db, project_id=project_id, user=current_user, update_in=update_in
    )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a project and its indexed files (owner only)."""
    await ProjectService.delete_project(db, project_id=project_id, user=current_user)
    return None


@router.post("/{project_id}/upload-zip", response_model=ProjectUploadStatusResponse)
async def upload_project_zip(
    project_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a repository ZIP archive for the project.
    Secured against:
    - Zip Slip / path traversal
    - Decompression bombs
    - Malformed and non-ZIP files
    - Code execution (Static analysis only)
    """
    project = await ProjectService.get_project_by_id(db, project_id, current_user)

    if project.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to upload files to this project.",
        )

    # Set status to extracting
    project.status = "extracting"
    await db.commit()

    try:
        extracted_path, stats = await ZipService.validate_and_extract_zip(
            file=file, project_id=project.id
        )

        # Update project record
        project.storage_path = extracted_path
        project.stats = stats
        project.status = "ready"
        project.commit_hash = "zip-upload-v1"
        project.error_message = None
        await db.commit()
        await db.refresh(project)

        return ProjectUploadStatusResponse(
            project_id=project.id,
            status="ready",
            progress=100,
            message="Repository uploaded, validated, and indexed successfully.",
            stats=stats,
        )

    except Exception as exc:
        project.status = "failed"
        project.error_message = str(getattr(exc, "detail", str(exc)))
        await db.commit()
        raise


@router.get("/{project_id}/status", response_model=ProjectUploadStatusResponse)
async def get_project_status(
    project_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Check processing and analysis status of a project."""
    project = await ProjectService.get_project_by_id(db, project_id, current_user)

    progress_map = {
        "pending": 10,
        "uploading": 35,
        "extracting": 65,
        "indexing": 85,
        "ready": 100,
        "failed": 0,
    }

    message_map = {
        "pending": "Workspace created, waiting for repository upload.",
        "uploading": "Receiving repository archive...",
        "extracting": "Validating security boundaries and extracting archive...",
        "indexing": "Constructing Abstract Syntax Tree index and caller topology...",
        "ready": "Project is fully indexed and ready for exploration.",
        "failed": f"Processing failed: {project.error_message or 'Unknown error'}",
    }

    return ProjectUploadStatusResponse(
        project_id=project.id,
        status=project.status,
        progress=progress_map.get(project.status, 0),
        message=message_map.get(project.status, "Processing"),
        stats=project.stats,
        error=project.error_message,
    )
