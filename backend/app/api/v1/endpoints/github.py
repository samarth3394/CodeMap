from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.github import GitHubConfigStatus, GitHubImportRequest
from app.schemas.project import ProjectResponse
from app.services.github_service import GitHubService
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate

router = APIRouter(prefix="/github", tags=["GitHub Integration"])


@router.get("/status", response_model=GitHubConfigStatus)
async def get_github_status():
    """
    Check if GitHub OAuth / App credentials are configured.
    Provides clear setup guide for the UI without crashing.
    """
    return GitHubService.get_config_status()


@router.post("/import", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def import_github_repo(
    payload: GitHubImportRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Import repository from GitHub.
    If GitHub OAuth is not yet configured on this instance, raises a clean 400
    with setup instructions instead of failing or faking.
    """
    config_status = GitHubService.get_config_status()

    if not config_status.is_configured:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "GitHub Integration is not yet configured. Please set GITHUB_CLIENT_ID "
                "and GITHUB_CLIENT_SECRET in backend/.env, or use ZIP archive upload."
            ),
        )

    owner, repo_name = GitHubService.validate_repo_url(payload.repo_url)

    # Create project record
    project_in = ProjectCreate(
        name=payload.name or repo_name,
        description=payload.description or f"Imported from {owner}/{repo_name}",
        default_branch=payload.branch or "main",
        visibility="private",
        repository_source="github",
        github_repo_url=payload.repo_url,
    )

    project = await ProjectService.create_project(
        db, user=current_user, project_in=project_in
    )
    return project
