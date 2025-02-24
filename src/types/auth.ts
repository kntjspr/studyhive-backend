export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      fullName: string;
    };
    session?: {
      access_token: string;
      refresh_token: string;
    };
  };
  error?: string;
} 