from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_integration():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_unauthorized_access():
    # Attempt to access protected endpoint without token
    response = client.get("/api/v1/profile/memory")
    assert response.status_code == 401  # HTTPBearer returns 403 or 401 depending on config
