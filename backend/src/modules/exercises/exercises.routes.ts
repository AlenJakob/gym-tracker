import { Request, Response, Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { prisma } from "../../prisma";

const router = Router();

// Create custom exercises for user
router.post("/", authMiddleware, async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const { name: exerciseName } = req.body;
	const { userId } = req.user;

	const checkExercise = await prisma.exercise.findFirst({
		where: {
			name: exerciseName,
			userId,
		},
	});

	if (checkExercise) {
		return res
			.status(409)
			.json({
				message: `Exercise with this name: ${exerciseName} already exist`,
			});
	}

	const exercise = await prisma.exercise.create({
		data: {
			name: exerciseName,
			isGlobal: false,
			userId: userId,
		},
	});

	return res.status(201).json(exercise);
});

// Get all user saved exercises
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

// Delete user created exercises
router.delete(
	"/:id",
	authMiddleware,
	async (req: Request<{ id: string }>, res: Response) => {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const { userId } = req.user;
		const exerciseId = req.params.id;

		const { count } = await prisma.exercise.deleteMany({
			where: {
				userId,
				id: exerciseId,
			},
		});

		if (count === 0) {
			return res.status(404).json({ message: "Exercise not found" });
		}

		return res.status(204).send();
	},
);

// Update exercise name
router.patch(
	"/:id",
	authMiddleware,
	async (req: Request<{ id: string }>, res) => {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { userId } = req.user;
		const exerciseId = req.params.id;
		const exerciseName = req.body.name;

		const exercise = await prisma.exercise.findFirst({
			where: {
				id: exerciseId,
				userId: userId,
			},
		});

		if (!exercise) {
			return res.status(404).json({ message: "Not Found" });
		}

		if (!exerciseName) {
			return res.status(400).json({ message: "Invalid name" });
		}

		const updatedExercise = await prisma.exercise.update({
			where: {
				id: exerciseId,
			},
			data: {
				name: exerciseName,
			},
		});

		return res.status(200).json(updatedExercise);
	},
);

router.get(
	"/:id",
	authMiddleware,
	async (req: Request<{ id: string }>, res) => {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { userId } = req.user;
		const exerciseId = req.params.id;

		if (!exerciseId || typeof exerciseId !== "string") {
			return res.status(400).json({ message: "Invalid id" });
		}

		const exerciseResponse = await prisma.exercise.findFirst({
			where: {
				userId,
				id: exerciseId,
			},
		});

		if (!exerciseResponse) {
			return res.status(404).json({ message: "Exercise not found" });
		}

		return res.status(200).json(exerciseResponse);
	},
);

export default router;
