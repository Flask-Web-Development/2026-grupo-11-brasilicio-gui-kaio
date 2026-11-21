import os, dotenv, secrets


values = dotenv.dotenv_values(".env.example")
env_exists = False

# load value from current env if it exists
if os.path.exists(".env"):
    values = dotenv.dotenv_values(".env")
    env_exists = True

for k in values.keys():
    if "SECRET" in k:
        values[k] = secrets.token_urlsafe(64)

with open(".env", "w") as file:
    for k, v in values.items():
        file.write(f"{k}={v}\n")