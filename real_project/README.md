# FastAPI Auth + MongoDB CRUD

This project adds JWT-based authentication and protected CRUD endpoints backed by MongoDB (Atlas).

## Setup

- Python: 3.10+
- Create and activate a virtual environment.
- Install dependencies:

```bash
pip install -r requirements.txt
```

- Configure environment variables by creating a `.env` file (see `.env.example`):

Required keys:
- `SECRET_KEY`: a long random secret used to sign JWTs.

MongoDB connection is configured in `config/database.py` and points to your cluster URL and database name (`powcrm`).

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:8000/docs for Swagger UI.

## Endpoints

- Auth (see `routes/auth.py`):
  - POST `/auth/signup` -> body: `UserCreate` model. Creates a user. Enforces unique `email`.
  - POST `/auth/login` -> body: `{ email, password }`. Returns `{ access_token, token_type }`.

- Items (protected, see `routes/items.py`):
  - Auth header: `Authorization: Bearer <token>` from login.
  - POST `/items/` -> create item for current user.
  - GET `/items/` -> list items for current user.
  - GET `/items/{item_id}` -> get one item owned by current user.
  - PUT `/items/{item_id}` -> update owned item.
  - DELETE `/items/{item_id}` -> delete owned item.

## Notes

- On startup, a unique index is created on `users.email` and the `items` collection is initialized.
- Passwords are hashed with `passlib[bcrypt]`.
- JWT tokens are signed with HS256 using `SECRET_KEY`.

## File refs

- `main.py`: app setup, CORS, router includes, and startup index creation
- `config/database.py`: Mongo connection (sync+async). Async used by API.
- `auth/auth_handler.py`: hashing, token issue/verify, `get_current_user` dependency.
- `routes/auth.py`: signup/login.
- `routes/items.py`: protected CRUD.
- `models/user.py`: Pydantic models for user payloads.
