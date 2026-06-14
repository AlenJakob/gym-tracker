import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get("/me", authMiddleware, (req, res) => {
	return res.json({
		user: (req as any).user,
	});
});

export default userRouter;