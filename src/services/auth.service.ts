import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { Profile } from '../types/models';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  learningStyle?: string;
  academicInterests?: string[];
}

export class AuthService {
  async signUp(data: SignUpData) {
    const { email, password, fullName, learningStyle, academicInterests } = data;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to create account',
        authError.message
      );
    }

    if (!authData.user) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create user account'
      );
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        learning_style: learningStyle,
        academic_interests: academicInterests,
      })
      .select()
      .single();

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create user profile',
        profileError.message
      );
    }

    return {
      user: profile,
      session: authData.session,
    };
  }

  async signIn(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Invalid credentials',
        authError.message
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to fetch user profile',
        profileError.message
      );
    }

    return {
      user: profile,
      session: authData.session,
    };
  }

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to send password reset email',
        error.message
      );
    }

    return {
      message: 'Password reset instructions sent to email',
    };
  }
} 