
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
    const response = await API.get("/api/integrations");
    return response.data;
};

// Retrieve a specific integration using its slug
export const getIntegrationBySlug = async (slug) => {
    const response = await API.get(`/api/integrations/${slug}`);
    return response.data;
};

export default API;
