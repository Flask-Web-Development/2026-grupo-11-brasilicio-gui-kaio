from pydantic import BaseModel, SecretStr, ConfigDict

class LoginRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    password: SecretStr