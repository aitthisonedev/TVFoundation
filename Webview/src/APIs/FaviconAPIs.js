// src/APIs/LogoAPIs.js
const apiUrl = import.meta.env.VITE_API_URL;

const fetchFavicon = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/imageUpload/favicon`);
    if (response.ok) {
      const data = await response.json();
      // Update the favicon
      if (data.imageUrl) {
        const faviconElement = document.getElementById("favicon");
        if (faviconElement) {
          faviconElement.setAttribute("href", data.imageUrl);
        } else {
          const newFaviconElement = document.createElement("link");
          newFaviconElement.rel = "icon";
          newFaviconElement.id = "favicon";
          newFaviconElement.href = data.imageUrl;
          document.head.appendChild(newFaviconElement);
        }
      } else {
        console.error("imageUrl not found in the response data");
      }
    } else {
      console.error("Failed to fetch favicon URL.");
    }
  } catch (error) {
    console.error("Error fetching favicon URL:", error);
  }
};

// Fetch and update favicon on page load
window.onload = () => {
  fetchFavicon();
};

export { fetchFavicon };
