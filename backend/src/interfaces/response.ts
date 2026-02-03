export interface ApiResponse<T = unknown> {
  message: string;
  data?: T | null;
}

export default ApiResponse;
