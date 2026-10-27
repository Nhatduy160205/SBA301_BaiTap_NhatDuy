import axios from "axios";

// Step 3 - Create centralized frontend HTTP client
// API Base URL is resolved from Vite environment variables (.env.development / .env.production)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach timestamp & inspect outbound calls
http.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date().getTime() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize API error model and measure latency
http.interceptors.response.use(
  (response) => {
    const elapsed = new Date().getTime() - (response.config.metadata?.startTime || 0);
    response.latencyMs = elapsed;
    return response;
  },
  (error) => {
    let friendlyMessage = "Đã xảy ra lỗi không xác định.";
    let errorType = "UNKNOWN_ERROR";
    let status = null;

    if (error.response) {
      // Server returned HTTP error (4xx, 5xx)
      status = error.response.status;
      errorType = "HTTP_ERROR";
      const backendMessage = error.response.data?.message;
      friendlyMessage = backendMessage || `Lỗi máy chủ HTTP ${status}: ${error.response.statusText}`;
    } else if (error.request) {
      // No response was received (Network error, CORS blocked, port down)
      errorType = "NETWORK_OR_CORS_ERROR";
      friendlyMessage = "Lỗi kết nối (Network Error / CORS): Không thể kết nối tới Backend Spring Boot tại " + API_BASE_URL + ". Vui lòng kiểm tra server port 8080 và cấu hình CORS.";
    } else {
      errorType = "CLIENT_SETUP_ERROR";
      friendlyMessage = error.message;
    }

    const enhancedError = {
      ...error,
      status,
      errorType,
      friendlyMessage,
      rawError: error,
    };
    return Promise.reject(enhancedError);
  }
);
