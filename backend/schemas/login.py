from pydantic import BaseModel, ConfigDict, Field, SecretStr

class LoginRequest(BaseModel):
    '''Matrícula e senha usadas pelo endpoint de autenticação via SUAP.'''

    model_config = ConfigDict(str_strip_whitespace=True)

    username: str = Field(min_length=1, max_length=20, pattern=r"^[A-Za-z0-9]+$")
    password: SecretStr = Field(min_length=1)

class LoginSuap(LoginRequest):
    '''Nome explícito do payload de login dos usuários SUAP.'''

class LoginMaster(BaseModel):
    '''Credenciais independentes do Admin Master.'''

    username: str = Field(min_length=1)
    password: SecretStr = Field(min_length=1)

class SuapOAuthLogin(BaseModel):
    '''Identidade SUAP já sincronizada pelo callback OAuth interno.'''

    user_id: str = Field(min_length=1, max_length=20, pattern=r"^[A-Za-z0-9]+$")
