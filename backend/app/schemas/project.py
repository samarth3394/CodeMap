from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str = Field(default="", max_length=1000)
    default_branch: str = Field(default="main", max_length=50)
    visibility: str = Field(default="private", pattern="^(private|public)$")
    repository_source: str = Field(default="zip", pattern="^(zip|github|sample)$")
    github_repo_url: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    default_branch: Optional[str] = Field(None, max_length=50)
    visibility: Optional[str] = Field(None, pattern="^(private|public)$")


class ProjectStats(BaseModel):
    filesCount: int = 0
    modulesCount: int = 0
    symbolsCount: int = 0
    linesOfCode: int = 0
    testCoverage: float = 0.0
    securityScore: int = 100
    dependencyCount: int = 0


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    default_branch: str
    visibility: str
    repository_source: str
    github_repo_url: Optional[str] = None
    commit_hash: str
    status: str
    error_message: Optional[str] = None
    stats: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int


class ProjectUploadStatusResponse(BaseModel):
    project_id: str
    status: str
    progress: int  # 0 to 100
    message: str
    stats: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
