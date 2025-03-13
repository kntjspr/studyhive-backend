import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { updateProfileValidation } from "../utils/validators";
import multer from "multer";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route GET /users/profile
 * @desc Get user profile
 * @access Private
 */
router.get("/profile", UserController.getProfile);

/**
 * @route PUT /users/profile
 * @desc Update user profile
 * @access Private
 */
router.put(
  "/profile",
  validate(updateProfileValidation),
  UserController.updateProfile
);

/**
 * @route POST /users/avatar
 * @desc Upload user avatar
 * @access Private
 */
router.post(
  "/avatar",
  upload.single("avatar"),
  UserController.uploadAvatar
);

export default router; 