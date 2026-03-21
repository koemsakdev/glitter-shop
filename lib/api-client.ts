import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * API Error Response Type
 */
interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

/**
 * API Client Class
 * Provides type-safe HTTP methods with Axios
 */
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const errorResponse: ApiErrorResponse = {
          message: error.message,
          status: error.response?.status,
          code: error.code,
        };

        if (
          error.response?.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          errorResponse.message = String((error.response.data as Record<string, unknown>).message) || error.message;
        }

        console.error('API Error:', errorResponse);
        return Promise.reject(errorResponse);
      }
    );
  }

  /**
   * Generic GET request
   * @param endpoint - API endpoint (relative to baseURL)
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async get<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
        endpoint,
        {
          ...config,
          // Prevent caching for SSR
          params: {
            ...config?.params,
            _t: Date.now(), // Cache buster
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request
   * @param endpoint - API endpoint (relative to baseURL)
   * @param data - Request body data (any type accepted)
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post<T>(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   * @param endpoint - API endpoint (relative to baseURL)
   * @param data - Request body data (any type accepted)
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put<T>(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   * @param endpoint - API endpoint (relative to baseURL)
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
        endpoint,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   * @param endpoint - API endpoint (relative to baseURL)
   * @param data - Request body data (any type accepted)
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.patch<T>(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handling utility
   * @param error - Error object from axios or unknown
   * @returns ApiErrorResponse with proper error details
   */
  private handleError(error: unknown): ApiErrorResponse {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data as Record<string, unknown> | undefined;
        return {
          message:
            (errorData && typeof errorData === 'object' && 'message' in errorData
              ? String(errorData.message)
              : undefined) || 'An error occurred from server',
          status: error.response.status,
          code: error.code,
        };
      } else if (error.request) {
        // Request was made but no response
        return {
          message: 'No response from server. Please check your connection.',
          code: 'NO_RESPONSE',
        };
      } else {
        // Error in request setup
        return {
          message: error.message || 'An unexpected error occurred',
          code: error.code,
        };
      }
    }

    // Non-axios error
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
      };
    }

    // Unknown error type
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;