from pydantic import BaseModel, Field, EmailStr, SecretStr
from typing import Optional, Annotated, Literal


class Address(BaseModel):
    house_number: str
    address_line_1: str
    address_line_2: Optional[str]
    city: str
    state: str
    pin_code: Annotated[str, Field(pattern=r'^\d{6}$')]


class BasicDetails(BaseModel):
    id: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    email: EmailStr = Field(..., alias="_id")
    contact_number: Annotated[str, Field(pattern=r'^\d{10}$')]
    password: SecretStr


class Consumer(BaseModel):
    details: BasicDetails
    address: Address


class Worker(BaseModel):
    details: BasicDetails
    role: Literal['Line Worker', 'Field Worker', 'Meter Reader', 'Billing Staff', 'Customer Support']
    years_of_experience: Optional[int] = Field(0, ge=0, le=30)


class Admin(BaseModel):
    details: BasicDetails
    access_level: Literal['Super Admin', 'Admin', 'Moderator']
    years_of_experience: Optional[int] = Field(0, ge=0, le=30)

class Location(BaseModel):
    latitude: float
    longitude: float

class Complaint(BaseModel):
    id: str
    consumer_id: str
    location: Location
    description: str = Field(..., max_length=2000)
    complaint_type: Literal['Power Outage', 'Billing Issue', 'Meter Problem', 'Service Request', 'Other']
    status: Literal['Registered', 'Pending', 'Scheduled', 'Assigned', 'WIP', 'Done'] = 'Registered'
    time_stamp: str
    assigned_worker_id: Optional[str]
    scheduled_at: Optional[str]