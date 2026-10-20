import re
from typing import Optional, Tuple
from fastapi import HTTPException, status
from app.core.config import settings
from app.schemas.github import GitHubConfigStatus


class GitHubService:
    @staticmethod
    def get_config_status() -> GitHubConfigStatus:
        """Returns clear status of GitHub OAuth/App configuration."""
        if settings.is_github_configured:
            return GitHubConfigStatus(
                is_configured=True,
                setup_message="GitHub OAuth is configured and ready for repository importing.",
                client_id=settings.GITHUB_CLIENT_ID,
                redirect_uri=settings.GITHUB_REDIRECT_URI,
            )

        return GitHubConfigStatus(
            is_configured=False,
            setup_message=(
                "GitHub Integration is not yet configured on this server. "
                "To enable automatic GitHub repository imports, create a GitHub OAuth App "
                "and set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env. "
                "ZIP archive upload is fully available and recommended."
            ),
            client_id=None,
            redirect_uri=None,
        )

    @staticmethod
    def validate_repo_url(repo_url: str) -> Tuple[str, str]:
        """
        Validates GitHub repository URL pattern.
        e.g. https://github.com/owner/repo or github.com/owner/repo
        """
        pattern = r"^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)$"
        match = re.match(pattern, repo_url.strip())
        if not match:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid GitHub repository URL format. Example: https://github.com/owner/repository",
            )
        owner = match.group(3)
        repo = match.group(4).removesuffix(".git")
        return owner, repo
