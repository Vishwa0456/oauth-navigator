
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getIntegrations = async () => {
    const response = await API.get("/api/integrations/");
    return response.data;
};

export const getIntegrationBySlug = async (slug) => {
    const response = await API.get(`/api/integrations/${slug}`);
    return response.data;
};

export const generateOAuthGuide = async (applicationName) => {
    const response = await API.post("/api/integrations/research", {
        application_name: applicationName,
    });
    return response.data;
};

export const getOAuthGuide = async (slug) => {
    const response = await API.get(`/api/integrations/guides/${slug}`);
    return response.data;
};

export default API;
