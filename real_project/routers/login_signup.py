from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from fastapi.templating import Jinja2Templates
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Depends
from database import get_database
from models import Consumer, Worker, Address
from pydantic import ValidationError
import bcrypt
from pymongo.errors import DuplicateKeyError


router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def signup(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/signup", response_class=HTMLResponse)
async def signup_post(request: Request, db: AsyncIOMotorDatabase = Depends(get_database)):
    form_data = await request.form()
    
    try:
        # Extract user type
        user_type = form_data.get("userType")
        
        # Create address object
        address_data = {
            "house_number": form_data.get("homeNumber"),
            "address_line_1": form_data.get("addressLine1"),
            "address_line_2": form_data.get("addressLine2"),
            "city": form_data.get("city"),
            "state": form_data.get("state"),
            "pin_code": form_data.get("pinCode")
        }
        address = Address(**address_data)
        
        # Hash the password
        password = form_data.get("password")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create username from email
        email = form_data.get("email")
        username = email.split("@")[0]
        
        # Common user data
        user_data = {
            "email": email,
            "password": hashed_password,
            "first_name": form_data.get("firstName"),
            "middle_name": form_data.get("middleName") or None,
            "last_name": form_data.get("lastName"),
            "contact_number": form_data.get("contactNumber"),
            "username": username,
            "address": address.dict()
        }
        
        if user_type == "consumer":
            # Create consumer
            consumer = Consumer(**user_data)
            collection = db.consumers
            await collection.insert_one(consumer.dict(by_alias=True))
            
        elif user_type == "worker":
            # Add worker-specific fields
            user_data.update({
                "role": "worker",
                "worker_type": form_data.get("expertise")
            })
            worker = Worker(**user_data)
            collection = db.workers
            await collection.insert_one(worker.dict(by_alias=True))
            
        elif user_type == "admin":
            # Add admin-specific fields
            user_data.update({
                "role": "admin"
            })
            collection = db.admins
            await collection.insert_one(user_data)
        
        return templates.TemplateResponse("index.html", {
            "request": request, 
            "message": f"Account created successfully! Welcome {user_data['first_name']}!",
            "success": True
        })
        
    except ValidationError as e:
        error_message = "Invalid form data: " + str(e.errors()[0]['msg'])
        return templates.TemplateResponse("index.html", {
            "request": request, 
            "error": error_message
        })
        
    except DuplicateKeyError:
        return templates.TemplateResponse("index.html", {
            "request": request, 
            "error": "Email already exists. Please use a different email address."
        })
        
    except Exception as e:
        return templates.TemplateResponse("index.html", {
            "request": request, 
            "error": f"Registration failed: {str(e)}"
        })