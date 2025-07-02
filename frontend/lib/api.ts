const API_BASE_URL = "http://localhost:8000"; // Replace with your actual base URL

export async function generateWebsite(description: string) {
  const response = await fetch(`${API_BASE_URL}/api/generate-website`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate website");
  }

  const data = await response.json();
  return data;
}

export async function getPage(websiteId: string, pageName: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/website/${websiteId}/page/${pageName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch page");
  }

  const data = await response.json();
  return data;
}

export async function updatePage(
  websiteId: string,
  pageName: string,
  content: any
) {
  const response = await fetch(
    `${API_BASE_URL}/api/website/${websiteId}/page/${pageName}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update page");
  }

  const data = await response.json();
  return data;
}

export async function editWebsite(
  websiteId: string,
  pageName: string,
  editInstruction: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/website/${websiteId}/edit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_name: pageName,
        edit_instruction: editInstruction,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to edit website");
  }

  const data = await response.json();
  return data;
}
