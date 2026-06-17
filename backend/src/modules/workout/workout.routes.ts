import { Request, Response, Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { prisma } from "../../prisma";

const router = Router();

type RequestWorkout = Request<{ id: string }>;

router.post("/", authMiddleware, async (req: RequestWorkout, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const { userId } = req.user;
	const { workoutName } = req.body;

	if (!workoutName) {
		return res.status(400).json({ message: "Invalid workout name" });
	}

	const workout = await prisma.workout.create({
		data: {
			name: workoutName,
			userId,
		},
	});

	return res.status(201).json(workout);
});

router.get("/", authMiddleware, async (req: RequestWorkout, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const { userId } = req.user;

	const allWorkouts = await prisma.workout.findMany({
		where: {
			userId,
		},
	});

	return res.status(200).json(allWorkouts);
});

// create workout
router.post(
	"/:id/exercises",
	authMiddleware,
	async (req: RequestWorkout, res) => {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { userId } = req.user;
		const workoutId = req.params.id;
		const { exerciseId, reps, sets, weight } = req.body;

		// 1. check the workout belong to user
		const workout = await prisma.workout.findFirst({
			where: {
				id: workoutId,
				userId,
			},
		});

		if (!workout) {
			return res.status(404).json({ message: "Workout not found" });
		}

		// 2. check if exercise exist and belong to user ( or is global )
		const exercise = await prisma.exercise.findFirst({
			where: {
				id: exerciseId,
				OR: [{ userId }, { userId: null }],
			},
		});

		if (!exercise) {
			return res.status(404).json({ message: "Exercise not found" });
		}

		// 3. add workout
		const workoutExercise = await prisma.workoutExercise.create({
			data: {
				workoutId,
				exerciseId,
				reps,
				sets,
				weight,
			},
		});

		return res.status(201).json(workoutExercise);
	},
);

export default router;
