const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const authController = {
    // Step 1: Initial registration with email and password
    async registerInit(req, res) {
        try {
            const { email, password } = req.body;
            
            // Check if user already exists
            const { data: existingUser, error: userError } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();
                
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User with this email already exists"
                });
            }
            
            // Store credentials temporarily and send OTP
            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${process.env.APP_URL}/auth/callback`
                }
            });

            if (error) throw error;
            
            // Store password temporarily (in a secure way in production)
            // For demo purposes using supabase table
            await supabase.from('pending_registrations').upsert({
                email,
                password, // In production, hash this before storing
                created_at: new Date().toISOString()
            });

            return res.status(200).json({
                success: true,
                message: "Verification code sent to your email",
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Step 2: Complete registration with OTP verification
    async registerComplete(req, res) {
        try {
            const { email, token } = req.body;

            // First verify OTP
            const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email'
            });

            if (otpError) throw otpError;

            // Retrieve stored password
            const { data: pendingReg, error: pendingError } = await supabase
                .from('pending_registrations')
                .select('password')
                .eq('email', email)
                .single();
                
            if (pendingError || !pendingReg) {
                return res.status(400).json({
                    success: false,
                    message: "Registration session expired or not found"
                });
            }
            
            // Now create the actual user with verified email
            const { data, error } = await supabase.auth.signUp({
                email,
                password: pendingReg.password,
                options: {
                    emailRedirectTo: `${process.env.APP_URL}/auth/callback`
                }
            });
            
            if (error) throw error;
            
            // Clean up the temporary registration
            await supabase
                .from('pending_registrations')
                .delete()
                .eq('email', email);

            // Generate JWT token
            const accessToken = jwt.sign(
                { userId: data.user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(201).json({
                success: true,
                message: "Registration successful",
                data: {
                    user: data.user,
                    session: data.session,
                    accessToken
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Step 1: Login with email and password
    async loginInit(req, res) {
        try {
            const { email, password } = req.body;

            // First verify credentials
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            
            // If credentials are correct, send OTP for 2FA
            const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${process.env.APP_URL}/auth/callback`
                }
            });
            
            if (otpError) throw otpError;

            return res.status(200).json({
                success: true,
                message: "Credentials verified. OTP sent to email for verification.",
                data: {
                    email
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Step 2: Verify OTP to complete login
    async loginComplete(req, res) {
        try {
            const { email, token } = req.body;

            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email'
            });

            if (error) throw error;

            // Generate JWT token
            const accessToken = jwt.sign(
                { userId: data.user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: data.user,
                    session: data.session,
                    accessToken
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Logout
    async logout(req, res) {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Refresh token
    async refreshToken(req, res) {
        try {
            const { refresh_token } = req.body;
            
            const { data, error } = await supabase.auth.refreshSession({ refresh_token });
            
            if (error) throw error;

            return res.status(200).json({
                success: true,
                data: {
                    session: data.session,
                    user: data.user
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = authController; 