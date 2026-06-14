import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { prisma } from "../../prisma";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
	console.log("body logged", req.body);
	console.log("test", req.user);

	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const { name: exerciseName } = req.body;
	const { userId } = req.user;

	const exercise = await prisma.exercise.create({
		data: {
			name: exerciseName,
			isGlobal: false,
			userId: userId,
		},
	});

	return res.json(exercise);
});

router.get("/", authMiddleware, async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const { userId } = req.user;

	const exercise = await prisma.exercise.findMany({
		where: {
			OR: [{ isGlobal: false }, { userId }],
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return res.json(exercise);
});

export default router;
