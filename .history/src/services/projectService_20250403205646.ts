import axios from "axios";
import { Project } from "@/lib/types";

const API_URL = "http://localhost:8080/api";

const fetchUserProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return []; // Return an empty array or fallback value
    }
  };

// Fetch project by ID
export const fetchProjectById = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/projects/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching project with ID ${id}:`, error);
        throw error;
    }
};

// Create a new project
export const createProject = async (projectData: Partial<Project>) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/projects`, projectData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

// Update a project
export const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/projects/${id}`, projectData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating project with ID ${id}:`, error);
        throw error;
    }
};

// Delete a project
export const deleteProject = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/projects/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting project with ID ${id}:`, error);
        throw error;
    }
};

// Invite a team member to a project
export const inviteTeamMember = async (projectId: string, emails: string[], role: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${API_URL}/projects/${projectId}/invites`,
            { emails, role },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error inviting team member:", error);
        throw error;
    }
};
