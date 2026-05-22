from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from config import settings

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Supabase uses the project key as the secret for JWT verification for anon users
        # For authenticated users, it's typically verified by Supabase itself if using their SDKs
        # or by using the JWT secret found in the dashboard.
        # Here we assume we verify the token against Supabase JWT secret (placeholder settings.SUPABASE_JWT_SECRET)
        # For simplicity in this initial setup, we might just verify it's a valid JWT.
        payload = jwt.decode(token, settings.SUPABASE_KEY, algorithms=["HS256"], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
