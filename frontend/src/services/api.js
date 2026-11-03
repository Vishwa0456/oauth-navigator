import axios from "axios";

// Base URL of our FastAPI backend
const API = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Retrieve all OAuth integrations
export const getIntegrations = async () => {
    const response = await API.get("/api/integrations/");
    return response.data;
};

// Retrieve a specific integration using its slug
export const getIntegrationBySlug = async (slug) => {
    const response = await API.get(`/api/integrations/${slug}`);
    return response.data;
};

// Generate an OAuth guide using AI
export const generateOAuthGuide = async (applicationName) => {
    const response = await API.post("/api/integrations/research", {
        application_name: applicationName,
    });
    return response.data;
};

// Retrieve a previously generated OAuth guide
export const getOAuthGuide = async (slug) => {
    const response = await API.get(
        `/api/integrations/guides/${slug}`
    );
    return response.data;
};

export default API;
