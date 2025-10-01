from fastapi import APIRouter
from .login_signup import router as login_signup

router = APIRouter()
router.include_router(login_signup)