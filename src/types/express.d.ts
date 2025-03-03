import { Profile } from "./models";

declare global {
  namespace Express {
    interface Request {
      user?: Profile;
    }
  }
} 