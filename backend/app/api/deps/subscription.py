from fastapi import Depends, HTTPException, status
from app.models.models import User
from app.api.deps.auth import get_current_active_user


def require_pro_plan(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.subscription_plan != "pro":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Funcionalidade exclusiva para assinantes Pro.",
        )
    return current_user


def check_free_tier_limit(current_user: User = Depends(get_current_active_user)) -> User:
    # Placeholder para futuras regras de limite de uso
    return current_user
