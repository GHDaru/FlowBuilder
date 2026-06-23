from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DEBUG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/flows")
def debug_list_flows():
    return [{"id": "debug-1", "name": "Conexão OK"}]

@app.get("/")
def read_root():
    return {"status": "debug server running"}

if __name__ == "__main__":
    import uvicorn
    print("Iniciando servidor de DEBUG na porta 8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
