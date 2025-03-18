const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const authController = {
    // Register new user
    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            // Create user in Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${process.env.APP_URL}/auth/callback`
                }
            });

            if (error) throw error;

            return res.status(201).json({
                success: true,
                message: "Registration successful. Please check your email for verification.",
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Login with OTP
    async loginWithOTP(req, res) {
        try {
            const { email } = req.body;

            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${process.env.APP_URL}/auth/callback`
                }
            });

            if (error) throw error;

            return res.status(200).json({
                success: true,
                message: "OTP sent to email",
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Verify OTP
    async verifyOTP(req, res) {
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