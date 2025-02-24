import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { AuthResponse, SignInRequest, SignUpRequest, ForgotPasswordRequest } from "../types/auth";

export class AuthController {
  public async signUp(req: Request<{}, {}, SignUpRequest>, res: Response<AuthResponse>): Promise<void> {
    try {
      const { email, password, fullName } = req.body;

      const { data: existingUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !authData.user) {
        res.status(400).json({
          success: false,
          message: "Failed to create user",
          error: signUpError?.message,
        });
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
        },
      ]);

      if (profileError) {
        res.status(400).json({
          success: false,
          message: "Failed to create user profile",
          error: profileError.message,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email || "",
            fullName,
          },
          session: {
            access_token: authData.session?.access_token || "",
            refresh_token: authData.session?.refresh_token || "",
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async signIn(req: Request<{}, {}, SignInRequest>, res: Response<AuthResponse>): Promise<void> {
    try {
      const { email, password } = req.body;

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !authData.user) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
          error: signInError?.message,
        });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      res.status(200).json({
        success: true,
        message: "Sign in successful",
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email || "",
            fullName: profile?.full_name || "",
          },
          session: {
            access_token: authData.session?.access_token || "",
            refresh_token: authData.session?.refresh_token || "",
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async forgotPassword(
    req: Request<{}, {}, ForgotPasswordRequest>,
    res: Response<AuthResponse>
  ): Promise<void> {
    try {
      const { email } = req.body;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

      if (error) {
        res.status(400).json({
          success: false,
          message: "Failed to send reset password email",
          error: error.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
} 