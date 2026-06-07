import subprocess

from fastapi import FastAPI, HTTPException
from pathlib import Path

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = BASE_DIR

@app.post("/run/{name}")
def run_script(name: str):
    script = SCRIPTS_DIR / f"{name}.sh"

    if not script.exists():
        raise HTTPException(status_code=404, detail="script not found")

    if not script.is_file():
        raise HTTPException(status_code=400, detail="invalid script")

    result = subprocess.run(
        ["bash", str(script)],
        capture_output=True,
        text=True
    )

    return {
        "exit_code": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }