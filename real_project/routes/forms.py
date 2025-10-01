from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import ValidationError
from auth.auth_handler import get_password_hash, verify_password, create_access_token
from config.database import async_db

router = APIRouter(tags=["forms"])  # no prefix, matches exact paths used by templates
templates = Jinja2Templates(directory="templates")

@router.post("/signup")
async def signup_form(request: Request):
    form = await request.form()
    try:
        # Only handle client (consumer)
        user_type = (form.get("userType") or "consumer").lower()
        if user_type != "consumer":
            raise HTTPException(status_code=400, detail="Only client registration is enabled")

        email = (form.get("email") or "").strip().lower()
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        # Enforce unique email
        if await async_db.users.find_one({"email": email}):
            return HTMLResponse("Email already exists.", status_code=400)

        password = form.get("password") or ""
        hashed = get_password_hash(password)

        doc = {
            "email": email,
            "password": hashed,
            "first_name": form.get("firstName"),
            "middle_name": form.get("middleName") or None,
            "last_name": form.get("lastName"),
            "contact_number": form.get("contactNumber"),
            "user_type": "consumer",
            "home_number": form.get("homeNumber"),
            "address_line1": form.get("addressLine1"),
            "address_line2": form.get("addressLine2") or None,
            "pin_code": form.get("pinCode"),
            "city": form.get("city"),
            "state": form.get("state"),
        }
        await async_db.users.insert_one(doc)
        # Redirect/render to error.html as requested
        return templates.TemplateResponse("error.html", {"request": request})
    except HTTPException as he:
        return templates.TemplateResponse("error.html", {"request": request}, status_code=he.status_code)
    except Exception as e:
        return templates.TemplateResponse("error.html", {"request": request}, status_code=500)

@router.post("/login")
async def login_form(request: Request):
    form = await request.form()
    email = (form.get("email") or "").strip().lower()
    password = form.get("password") or ""

    user = await async_db.users.find_one({"email": email, "user_type": "consumer"})
    if not user:
        return templates.TemplateResponse("error.html", {"request": request}, status_code=400)
    if not verify_password(password, user["password"]):
        return templates.TemplateResponse("error.html", {"request": request}, status_code=400)

    # On successful login, render error.html as per request
    return templates.TemplateResponse("error.html", {"request": request})
