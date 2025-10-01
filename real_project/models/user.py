from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    contact_number: str
    user_type: str
    home_number: str
    address_line1: str
    address_line2: Optional[str] = None
    pin_code: str
    city: str
    state: str
    expertise: Optional[str] = None
    experience: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
