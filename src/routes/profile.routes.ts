import { Router } from "express";
import { z } from "zod";
import { ProfileService } from "../services/profile.service";
import { validateRequest } from "../middleware/validateRequest";
import { requireAuth } from "../middleware/auth";
import { Request, Response, NextFunction } from "express";
import { LearningStyle } from "../types/models";

const router = Router();
const profileService = new ProfileService();

// Apply auth middleware to all routes
router.use(requireAuth);

const getProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid profile ID"),
  }),
});

const updateProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid profile ID"),
  }),
  body: z.object({
    fullName: z.string().min(1).optional(),
    avatarUrl: z.string().url("Invalid avatar URL").optional(),
    bio: z.string().optional(),
    learningStyle: z.nativeEnum(LearningStyle).optional(),
    academicInterests: z.array(z.string()).optional(),
    availabilitySchedule: z.record(z.array(z.string())).optional(),
  }),
});

router.get(
  "/:id",
  validateRequest(getProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.getProfile(req.params.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  validateRequest(updateProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only allow users to update their own profile
      if (req.params.id !== req.user!.id) {
        res.status(403).json({ message: "Not authorized to update this profile" });
        return;
      }

      const profile = await profileService.updateProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 