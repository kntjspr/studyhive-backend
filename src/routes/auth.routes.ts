import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { validateRequest } from "../middleware/validateRequest";
import { Request, Response, NextFunction } from "express";
import { LearningStyle } from "../types/models";

const router = Router();
const authService = new AuthService();

const signUpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName: z.string().min(1, "Full name is required"),
    learningStyle: z.nativeEnum(LearningStyle).optional(),
    academicInterests: z.array(z.string()).optional(),
  }),
});

const signInSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

router.post(
  "/signup",
  validateRequest(signUpSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.signUp(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/signin",
  validateRequest(signInSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.signIn(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 