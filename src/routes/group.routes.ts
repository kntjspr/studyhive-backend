import { Router } from "express";
import { z } from "zod";
import { GroupService } from "../services/group.service";
import { validateRequest } from "../middleware/validateRequest";
import { requireAuth } from "../middleware/auth";
import { Request, Response, NextFunction } from "express";

const router = Router();
const groupService = new GroupService();

// Apply auth middleware to all routes
router.use(requireAuth);

const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().min(1, "Description is required"),
    subjectId: z.string().uuid("Invalid subject ID"),
    maxMembers: z.number().int().min(2, "Maximum members must be at least 2"),
    meetingSchedule: z.record(z.array(z.string())).optional(),
  }),
});

const groupIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid group ID"),
  }),
});

router.post(
  "/",
  validateRequest(createGroupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await groupService.createGroup(req.user!.id, req.body);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  validateRequest(groupIdSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await groupService.getGroup(req.params.id);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id/join",
  validateRequest(groupIdSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const member = await groupService.joinGroup(req.params.id, req.user!.id);
      res.json(member);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id/leave",
  validateRequest(groupIdSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await groupService.leaveGroup(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router; 