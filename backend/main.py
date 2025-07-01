from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from ai_service import GeminiAIService
from website_storage import WebsiteStorage
from models import WebsiteRequest, EditRequest

app = FastAPI(title="AI Website Generator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_service = GeminiAIService()
storage = WebsiteStorage()


@app.post("/api/generate-website")
async def generate_website(request: WebsiteRequest):
    try:
        # Generate website using AI
        website_data = await ai_service.generate_website(request.description)

        # Store the website
        website_id = storage.store_website(website_data)

        return {
            "website_id": website_id,
            "pages": website_data["pages"],
            "homepage": website_data["pages"][0] if website_data["pages"] else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/website/{website_id}")
async def get_website(website_id: str):
    website = storage.get_website(website_id)
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")
    return website


@app.get("/api/website/{website_id}/page/{page_name}")
async def get_page(website_id: str, page_name: str):
    page = storage.get_page(website_id, page_name)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@app.post("/api/website/{website_id}/edit")
async def edit_website(website_id: str, request: EditRequest):
    try:
        # Get current website
        website = storage.get_website(website_id)
        if not website:
            raise HTTPException(status_code=404, detail="Website not found")

        # Apply AI edit
        updated_page = await ai_service.edit_page(
            website["pages"], request.page_name, request.edit_instruction
        )

        # Update storage
        storage.update_page(website_id, request.page_name, updated_page)

        return {"success": True, "updated_page": updated_page}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
