from pydantic import BaseModel
from typing import List


class Page(BaseModel):
    name: str
    slug: str
    html: str
    description: str = ""


class Website(BaseModel):
    id: str
    name: str
    description: str
    pages: List[Page]


class WebsiteRequest(BaseModel):
    description: str


class EditRequest(BaseModel):
    page_name: str
    edit_instruction: str
