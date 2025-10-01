from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = "mongodb+srv://amithaker122_db_user:kjzmHeNfTxDTViY0@powcrm.28rt55m.mongodb.net/"
DATABASE_NAME = "powcrm"

# Sync client for traditional operations
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Async client for FastAPI
async_client = AsyncIOMotorClient(MONGODB_URL)
async_db = async_client[DATABASE_NAME]
