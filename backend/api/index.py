import sys
import types
from pathlib import Path

backend_directory = Path(__file__).resolve().parents[1]
repository_directory = backend_directory.parent

if str(repository_directory) not in sys.path:
    sys.path.insert(0, str(repository_directory))

if "backend" not in sys.modules:
    backend_package = types.ModuleType("backend")
    backend_package.__path__ = [str(backend_directory)]
    sys.modules["backend"] = backend_package

from backend.app import app

__all__ = ["app"]
