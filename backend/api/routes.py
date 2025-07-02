from fastapi import APIRouter, HTTPException
from models.schemas import WebsiteRequest, EditRequest
from services.ai_service import GeminiAIService
from storage.website_storage import WebsiteStorage

router = APIRouter()
ai_service = GeminiAIService()
storage = WebsiteStorage()


@router.post("/generate-website")
async def generate_website(request: WebsiteRequest):
    try:
        website_data = await ai_service.generate_website(request.description)
        website_id = storage.store_website(website_data)
        return {
            "website_id": website_id,
            "pages": website_data["pages"],
            "homepage": website_data["pages"][0] if website_data["pages"] else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/website/{website_id}")
async def get_website(website_id: str):
    website = storage.get_website(website_id)
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")
    return website


@router.get("/website/{website_id}/page/{page_name}")
async def get_page(website_id: str, page_name: str):
    page = storage.get_page(website_id, page_name)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.post("/website/{website_id}/edit")
@router.post("/website/{website_id}/edit")
async def edit_website(website_id: str, request: EditRequest):
    try:
        website = storage.get_website(website_id)
        if not website:
            raise HTTPException(status_code=404, detail="Website not found")

        edit_result = await ai_service.edit_page(
            website["pages"], request.page_name, request.edit_instruction
        )

        # If AI failed, return error
        if not edit_result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"AI failed to edit page: {edit_result.get('error', 'Unknown error')}",
            )

        updated_page = next(
            (
                p
                for p in edit_result["pages"]
                if p["name"].lower() == request.page_name.lower()
            ),
            None,
        )

        if updated_page is None:
            raise HTTPException(
                status_code=500, detail="AI did not return an updated page"
            )

        storage.update_page(website_id, request.page_name, updated_page)
        return {"success": True, "updated_page": updated_page}
    except Exception as e:
        print(f"AI Edit Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/websites")
async def list_websites():
    try:
        websites = storage.list_websites()
        return {"websites": websites}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
