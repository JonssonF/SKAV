export interface ApiError {
  errorCode: string;
  message: string;
  errors?: Record<string, string[]>;
}