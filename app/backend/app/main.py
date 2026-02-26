from fastapi import FastAPI

app = FastAPI(
    title="MetaBuilder API",
    description="Plataforma low-code basada en metadatos",
    version="0.1.0",
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/v1/version")
async def version():
    return {"version": "0.1.0", "name": "MetaBuilder"}
