from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class WebsiteRequest(BaseModel):
    description: str


class EditRequest(BaseModel):
    page_name: str
    edit_instruction: str


class Page(BaseModel):
    name: str
    slug: str
    html: str
    description: str


class Website(BaseModel):
    pages: List[Page]
    created_at: str
