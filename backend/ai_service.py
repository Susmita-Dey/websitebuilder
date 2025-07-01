import google.generativeai as genai
import os
import json
from typing import Dict, List, Any
from dotenv import load_dotenv
import asyncio
import re

load_dotenv()


class GeminiAIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-pro")

    async def generate_website(self, description: str) -> Dict[str, Any]:
        """Generate a complete website based on description"""

        system_prompt = """You are an expert web developer. Generate a complete website based on the user's description.

IMPORTANT: Return ONLY a valid JSON object with this exact structure (no additional text before or after):

{
  "pages": [
    {
      "name": "Home",
      "slug": "home",
      "html": "complete HTML with inline CSS",
      "description": "Brief description of the page"
    }
  ]
}

Guidelines for HTML generation:
- Create modern, responsive HTML with inline CSS
- Use semantic HTML5 elements (header, nav, main, section, footer)
- Include proper meta tags and viewport
- Make it visually appealing with good typography and spacing
- Use CSS Grid/Flexbox for layouts
- Include hover effects and smooth transitions
- Make text content relevant to the description
- Ensure mobile-responsive design
- Use modern color schemes and gradients
- Include proper spacing and typography
- Create multiple pages based on the description (typically 3-5 pages)

Example page types to include based on description:
- Home/Landing page
- About/Services page  
- Contact page
- Portfolio/Gallery (if relevant)
- Products/Menu (if relevant)
- Blog/News (if relevant)

Make the content realistic and relevant to the described business/purpose."""

        user_prompt = f"Create a website: {description}"

        try:
            # Run the sync method in a thread pool to make it async
            response = await asyncio.to_thread(
                self.model.generate_content,
                f"{system_prompt}\n\nUser Request: {user_prompt}",
            )

            content = response.text.strip()

            # Extract JSON from response (in case there's extra text)
            json_match = re.search(r"\{.*\}", content, re.DOTALL)
            if json_match:
                content = json_match.group()

            # Parse JSON response
            website_data = json.loads(content)

            # Validate the structure
            if not isinstance(website_data.get("pages"), list):
                raise ValueError("Invalid response structure")

            return website_data

        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {content}")
            # Fallback: generate a simple website
            return self._generate_fallback_website(description)
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Fallback: generate a simple website
            return self._generate_fallback_website(description)

    async def edit_page(
        self, pages: List[Dict], page_name: str, edit_instruction: str
    ) -> Dict[str, Any]:
        """Edit a specific page based on instruction"""

        # Find the page to edit
        target_page = None
        for page in pages:
            if page["name"].lower() == page_name.lower():
                target_page = page
                break

        if not target_page:
            raise ValueError(f"Page '{page_name}' not found")

        system_prompt = """You are an expert web developer. Edit the provided HTML/CSS based on the user's instruction.

IMPORTANT: Return ONLY the updated HTML with inline CSS (no additional text before or after).

Guidelines:
- Maintain responsive design
- Keep existing content unless specifically asked to change it
- Apply modern web design principles
- Ensure the changes are visually appealing
- Preserve the overall structure and functionality
- Make sure all CSS is inline within the HTML
- Keep semantic HTML5 structure"""

        user_prompt = f"""Current HTML:
{target_page['html']}

Edit instruction: {edit_instruction}

Return the complete updated HTML:"""

        try:
            # Run the sync method in a thread pool to make it async
            response = await asyncio.to_thread(
                self.model.generate_content, f"{system_prompt}\n\n{user_prompt}"
            )

            updated_html = response.text.strip()

            # Clean up the response (remove any markdown formatting)
            updated_html = re.sub(r"^```html\s*", "", updated_html)
            updated_html = re.sub(r"\s*```$", "", updated_html)
            updated_html = re.sub(r"^```\s*", "", updated_html)

            # Update the page
            target_page["html"] = updated_html

            return {"pages": pages, "edited_page": page_name, "success": True}

        except Exception as e:
            print(f"Error editing page: {e}")
            return {
                "pages": pages,
                "edited_page": page_name,
                "success": False,
                "error": str(e),
            }

    def _generate_fallback_website(self, description: str) -> Dict[str, Any]:
        """Generate a simple fallback website when AI fails"""

        fallback_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{description}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }}
        
        header {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            margin-bottom: 40px;
            border-radius: 15px;
        }}
        
        h1 {{
            color: white;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }}
        
        .subtitle {{
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
            font-size: 1.2rem;
        }}
        
        main {{
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }}
        
        .content {{
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
        }}
        
        .content h2 {{
            color: #333;
            margin-bottom: 20px;
            font-size: 2rem;
        }}
        
        .content p {{
            font-size: 1.1rem;
            margin-bottom: 20px;
            color: #666;
        }}
        
        .cta-button {{
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: transform 0.3s ease;
        }}
        
        .cta-button:hover {{
            transform: translateY(-2px);
        }}
        
        @media (max-width: 768px) {{
            h1 {{
                font-size: 2rem;
            }}
            
            main {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{description}</h1>
            <p class="subtitle">Welcome to our website</p>
        </header>
        
        <main>
            <div class="content">
                <h2>Coming Soon</h2>
                <p>We're working hard to bring you an amazing experience. This website is about {description.lower()} and we're excited to share more with you soon.</p>
                <p>Stay tuned for updates and new features!</p>
                <a href="#" class="cta-button">Get Started</a>
            </div>
        </main>
    </div>
</body>
</html>"""

        return {
            "pages": [
                {
                    "name": "Home",
                    "slug": "home",
                    "html": fallback_html,
                    "description": f"Home page for {description}",
                }
            ]
        }

    async def generate_page(
        self, page_name: str, page_description: str, website_context: str = ""
    ) -> str:
        """Generate a single page HTML"""

        system_prompt = """You are an expert web developer. Generate a single HTML page based on the description.

IMPORTANT: Return ONLY the complete HTML with inline CSS (no additional text before or after).

Guidelines:
- Create modern, responsive HTML with inline CSS
- Use semantic HTML5 elements
- Include proper meta tags and viewport
- Make it visually appealing with good typography and spacing
- Use CSS Grid/Flexbox for layouts
- Include hover effects and transitions
- Ensure mobile-responsive design
- Use modern color schemes
- Make content relevant to the page purpose"""

        user_prompt = f"""Page Name: {page_name}
Page Description: {page_description}
Website Context: {website_context}

Generate a complete HTML page:"""

        try:
            response = await asyncio.to_thread(
                self.model.generate_content, f"{system_prompt}\n\n{user_prompt}"
            )

            html_content = response.text.strip()

            # Clean up markdown formatting
            html_content = re.sub(r"^```html\s*", "", html_content)
            html_content = re.sub(r"\s*```$", "", html_content)
            html_content = re.sub(r"^```\s*", "", html_content)

            return html_content

        except Exception as e:
            print(f"Error generating page: {e}")
            return self._generate_fallback_page(page_name, page_description)

    def _generate_fallback_page(self, page_name: str, page_description: str) -> str:
        """Generate a simple fallback page"""

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_name}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #6c5ce7, #a29bfe);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }}
        
        h1 {{
            color: #2d3436;
            margin-bottom: 20px;
            font-size: 2.5rem;
            text-align: center;
        }}
        
        p {{
            font-size: 1.1rem;
            color: #636e72;
            text-align: center;
            margin-bottom: 30px;
        }}
        
        .content {{
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{page_name}</h1>
        <p>{page_description}</p>
        <div class="content">
            <p>This page is currently under development. More content will be added soon!</p>
        </div>
    </div>
</body>
</html>"""

    async def optimize_seo(
        self, html_content: str, page_name: str, description: str
    ) -> str:
        """Optimize HTML for SEO"""

        system_prompt = """You are an SEO expert. Optimize the provided HTML for search engines.

IMPORTANT: Return ONLY the optimized HTML (no additional text before or after).

SEO optimizations to apply:
- Add/improve meta description
- Add proper title tag
- Add meta keywords (if missing)
- Ensure proper heading hierarchy (h1, h2, h3)
- Add alt attributes to images
- Optimize for page speed
- Add structured data if relevant
- Ensure semantic HTML structure
- Add Open Graph tags for social sharing"""

        user_prompt = f"""Page Name: {page_name}
Description: {description}

HTML to optimize:
{html_content}

Return the SEO-optimized HTML:"""

        try:
            response = await asyncio.to_thread(
                self.model.generate_content, f"{system_prompt}\n\n{user_prompt}"
            )

            optimized_html = response.text.strip()

            # Clean up formatting
            optimized_html = re.sub(r"^```html\s*", "", optimized_html)
            optimized_html = re.sub(r"\s*```$", "", optimized_html)

            return optimized_html

        except Exception as e:
            print(f"Error optimizing SEO: {e}")
            return html_content  # Return original if optimization fails


# Convenience function to create service instance
def create_ai_service():
    """Create and return a GeminiAIService instance"""
    return GeminiAIService()


# Example usage
if __name__ == "__main__":

    async def test_service():
        service = create_ai_service()

        # Test website generation
        result = await service.generate_website("A modern coffee shop website")
        print("Generated website:", json.dumps(result, indent=2))

        # Test page editing
        if result.get("pages"):
            edit_result = await service.edit_page(
                result["pages"],
                "Home",
                "Add a hero section with a call-to-action button",
            )
            print("Edit result:", edit_result.get("success"))

    # Run the test
    # asyncio.run(test_service())
