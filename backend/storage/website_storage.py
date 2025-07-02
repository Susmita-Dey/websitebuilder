from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
from models.schemas import Website


class WebsiteStorage:
    def __init__(self):
        self.websites: Dict[str, Dict[str, Any]] = {}

    def store_website(self, website_data: Dict[str, Any]) -> str:
        """Store a website and return its ID"""
        website_id = str(uuid.uuid4())
        website_data["created_at"] = datetime.now().isoformat()
        website_data["id"] = website_id
        self.websites[website_id] = website_data
        return website_id

    def get_website(self, website_id: str) -> Optional[Dict[str, Any]]:
        """Get a website by ID"""
        return self.websites.get(website_id)

    def get_page(self, website_id: str, page_name: str) -> Optional[Dict[str, Any]]:
        """Get a specific page from a website"""
        website = self.get_website(website_id)
        if not website:
            return None

        for page in website.get("pages", []):
            if page["name"].lower() == page_name.lower():
                return page
        return None

    def update_page(
        self, website_id: str, page_name: str, updated_page: Dict[str, Any]
    ):
        """Update a specific page in a website"""
        website = self.get_website(website_id)
        if not website:
            return False

        for i, page in enumerate(website["pages"]):
            if page["name"].lower() == page_name.lower():
                website["pages"][i] = updated_page
                return True
        return False

    def list_websites(self) -> List[Dict[str, Any]]:
        """List all websites"""
        return list(self.websites.values())

    # Assume in-memory store (can be replaced with a DB later)
    websites_store: dict[str, Website] = {}

    def get_all_websites() -> List[Website]:
        return list(self.websites_store.values())
