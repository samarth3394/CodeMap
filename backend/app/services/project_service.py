from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from fastapi import HTTPException, status
from app.models.user import User
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    @staticmethod
    async def create_project(
        db: AsyncSession, user: User, project_in: ProjectCreate
    ) -> Project:
        project = Project(
            user_id=user.id,
            name=project_in.name.strip(),
            description=project_in.description.strip(),
            default_branch=project_in.default_branch.strip() or "main",
            visibility=project_in.visibility,
            repository_source=project_in.repository_source,
            github_repo_url=project_in.github_repo_url,
            status="pending",
            stats={
                "filesCount": 0,
                "modulesCount": 0,
                "symbolsCount": 0,
                "linesOfCode": 0,
                "testCoverage": 0.0,
                "securityScore": 100,
                "dependencyCount": 0,
            },
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def list_user_projects(
        db: AsyncSession,
        user: Optional[User],
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> Tuple[List[Project], int]:
        if user:
            # User sees their own projects + public projects
            filter_clause = or_(
                Project.user_id == user.id,
                Project.visibility == "public",
            )
        else:
            # Unauthenticated sees only public projects
            filter_clause = Project.visibility == "public"

        base_stmt = select(Project).where(filter_clause)

        if search:
            search_term = f"%{search.strip().lower()}%"
            base_stmt = base_stmt.where(
                or_(
                    func.lower(Project.name).like(search_term),
                    func.lower(Project.description).like(search_term),
                )
            )

        # Count total
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_res = await db.execute(count_stmt)
        total = total_res.scalar_one()

        # Query items
        items_stmt = (
            base_stmt.order_by(desc(Project.created_at)).offset(skip).limit(limit)
        )
        res = await db.execute(items_stmt)
        projects = list(res.scalars().all())

        return projects, total

    @staticmethod
    async def get_project_by_id(
        db: AsyncSession, project_id: str, user: Optional[User] = None
    ) -> Project:
        stmt = select(Project).where(Project.id == project_id)
        res = await db.execute(stmt)
        project = res.scalar_one_or_none()

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        # Permission check: project must be public or owned by current user
        if project.visibility != "public":
            if not user or (project.user_id != user.id and not user.is_superuser):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to view this project.",
                )

        return project

    @staticmethod
    async def update_project(
        db: AsyncSession,
        project_id: str,
        user: User,
        update_in: ProjectUpdate,
    ) -> Project:
        project = await ProjectService.get_project_by_id(db, project_id, user)

        # Only owner or superuser can update
        if project.user_id != user.id and not user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this project.",
            )

        if update_in.name is not None:
            project.name = update_in.name.strip()
        if update_in.description is not None:
            project.description = update_in.description.strip()
        if update_in.default_branch is not None:
            project.default_branch = update_in.default_branch.strip()
        if update_in.visibility is not None:
            project.visibility = update_in.visibility

        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def delete_project(
        db: AsyncSession, project_id: str, user: User
    ) -> bool:
        project = await ProjectService.get_project_by_id(db, project_id, user)

        # Only owner or superuser can delete
        if project.user_id != user.id and not user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this project.",
            )

        await db.delete(project)
        await db.commit()
        return True
