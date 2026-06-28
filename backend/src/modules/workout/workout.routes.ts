import { Request, Response, Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { prisma } from "../../prisma";

const router = Router();

type RequestWorkout = Request<{ id: string }>;

// Create workout
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

// Get User Workout
router.get("/", authMiddleware, async (req: RequestWorkout, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const { userId } = req.user;

	const allWorkouts = await prisma.workout.findMany({
		where: {
			userId,
		},
		include: {
			workoutExercises: {
				include: {
					exercise: true,
					exerciseSets: true,
				},
			},
		},
	});

	return res.status(200).json(allWorkouts);
});

// Create workout
router.post(
	"/:id/exercises",
	authMiddleware,
	async (req: RequestWorkout, res) => {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { userId } = req.user;
		const workoutId = req.params.id;
		const { exerciseId } = req.body;

		const workout = await prisma.workout.findFirst({
			where: {
				id: workoutId,
				userId,
			},
		});

		if (!workout) {
			return res.status(404).json({ message: "Workout not found" });
		}

		const exercise = await prisma.exercise.findFirst({
			where: {
				id: exerciseId,
				OR: [{ userId }, { userId: null }],
			},
		});

		if (!exercise) {
			return res.status(404).json({ message: "Exercise not found" });
		}

		const workoutExercise = await prisma.workoutExercise.create({
			data: {
				workoutId,
				exerciseId,
			},
		});

		return res.status(201).json(workoutExercise);
	},
);

router.post(
	"/workout-exercises/:id/sets",
	authMiddleware,
	async (req: RequestWorkout, res) => {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const { userId } = req.user;
		const { reps, weight, unit } = req.body;
		const workoutExerciseId = req.params.id;

		console.log(workoutExerciseId, reps, weight, unit, "logger heere");

		const workoutExercise = await prisma.workoutExercise.findFirst({
			where: {
				id: workoutExerciseId,
				workout: {
					userId,
				},
			},
		});

		if (!workoutExercise) {
			return res.status(404).json({ message: "Workout exercise not found" });
		}

		const count = await prisma.exerciseSet.count({
			where: { workoutExerciseId },
		});

		const nextOrder = count + 1;

		const exerciseSet = await prisma.exerciseSet.create({
			data: {
				workoutExerciseId: workoutExerciseId,
				reps: reps,
				weight: weight ?? null,
				unit: unit ?? null,
				order: nextOrder,
			},
		});

		return res.status(201).json(exerciseSet);
	},
);

export default router;
