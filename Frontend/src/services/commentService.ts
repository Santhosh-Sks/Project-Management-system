import axios from "axios";

const API_URL = "http://localhost:8080/api"; 

// Get authentication token from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all comments for a task
export const fetchTaskComments = async (projectId: string, taskId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, 
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error.response || error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (projectId: string, taskId: string, text: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, 
      { text }, 
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error.response || error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (projectId: string, taskId: string, commentId: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, 
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error.response || error);
    throw error;
  }
};
