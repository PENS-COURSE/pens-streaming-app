export interface APIResponse<T> {
  message?: string;
  statusCode?: number;
  data?: T;
}
