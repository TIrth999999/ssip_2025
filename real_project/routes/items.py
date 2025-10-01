from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo import ReturnDocument
from config.database import async_db
from auth.auth_handler import get_current_user

class ItemCreate(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None

class ItemOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    owner_id: str

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemOut)
async def create_item(payload: ItemCreate, user=Depends(get_current_user)):
    doc = {
        "name": payload.name,
        "description": payload.description,
        "owner_id": user["_id"],
    }
    result = await async_db.items.insert_one(doc)
    created = await async_db.items.find_one({"_id": result.inserted_id})
    return ItemOut(
        id=str(created["_id"]),
        name=created["name"],
        description=created.get("description"),
        owner_id=str(created["owner_id"]),
    )

@router.get("/", response_model=List[ItemOut])
async def list_items(user=Depends(get_current_user)):
    items = []
    cursor = async_db.items.find({"owner_id": user["_id"]})
    async for doc in cursor:
        items.append(
            ItemOut(
                id=str(doc["_id"]),
                name=doc["name"],
                description=doc.get("description"),
                owner_id=str(doc["owner_id"]),
            )
        )
    return items

@router.get("/{item_id}", response_model=ItemOut)
async def get_item(item_id: str, user=Depends(get_current_user)):
    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item id")
    doc = await async_db.items.find_one({"_id": oid, "owner_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemOut(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc.get("description"),
        owner_id=str(doc["owner_id"]),
    )

@router.put("/{item_id}", response_model=ItemOut)
async def update_item(item_id: str, payload: ItemUpdate, user=Depends(get_current_user)):
    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item id")
    updates = {k: v for k, v in payload.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await async_db.items.find_one_and_update(
        {"_id": oid, "owner_id": user["_id"]}, {"$set": updates}, return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemOut(
        id=str(result["_id"]),
        name=result["name"],
        description=result.get("description"),
        owner_id=str(result["owner_id"]),
    )

@router.delete("/{item_id}")
async def delete_item(item_id: str, user=Depends(get_current_user)):
    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item id")
    res = await async_db.items.delete_one({"_id": oid, "owner_id": user["_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"deleted": True}
