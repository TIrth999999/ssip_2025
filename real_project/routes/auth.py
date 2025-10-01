from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from models.user import UserCreate, User
from config.database import async_db
from auth.auth_handler import get_password_hash, verify_password, create_access_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup", response_model=User)
async def signup(user: UserCreate):
    # Check if user already exists
    if await async_db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Prepare user data
    user_data = user.dict()
    user_data["password"] = hashed_password
    
    # Insert user into database
    result = await async_db.users.insert_one(user_data)
    
    # Return created user
    created_user = await async_db.users.find_one({"_id": result.inserted_id})
    # Map to API model and hide internals
    return User(
        id=str(created_user["_id"]),
        email=created_user["email"],
        first_name=created_user["first_name"],
        middle_name=created_user.get("middle_name"),
        last_name=created_user["last_name"],
        contact_number=created_user["contact_number"],
        user_type=created_user["user_type"],
        home_number=created_user["home_number"],
        address_line1=created_user["address_line1"],
        address_line2=created_user.get("address_line2"),
        pin_code=created_user["pin_code"],
        city=created_user["city"],
        state=created_user["state"],
        expertise=created_user.get("expertise"),
        experience=created_user.get("experience"),
    )

@router.post("/login")
async def login(payload: LoginRequest):
    user = await async_db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}
