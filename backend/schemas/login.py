from pydantic import BaseModel, Field, SecretStr

class LoginRequest(BaseModel):
    '''Credenciais usadas pelo endpoint de autenticação via SUAP.'''

    username: str = Field(min_length=1)
    password: SecretStr = Field(min_length=1)

class LoginSuap(LoginRequest):
    '''Nome explícito do payload de login dos usuários SUAP.'''

class LoginMaster(BaseModel):
    '''Credenciais independentes do Admin Master.'''

    username: str = Field(min_length=1)
    password: SecretStr = Field(min_length=1)
