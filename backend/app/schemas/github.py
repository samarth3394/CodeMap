from typing import Optional, List
from pydantic import BaseModel, HttpUrl


class GitHubConfigStatus(BaseModel):
    is_configured: bool
    setup_message: str
    client_id: Optional[str] = None
    redirect_uri: Optional[str] = None


class GitHubImportRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    repo_url: str
    branch: Optional[str] = "main"


class GitHubRepoMeta(BaseModel):
    name: str
    full_name: str
    description: Optional[str] = None
    default_branch: str
    stars: int = 0
    forks: int = 0
    is_private: bool = False
