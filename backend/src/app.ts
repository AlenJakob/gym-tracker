import express from "express";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import exercisesRouter from "./modules/exercises/exercises.routes";
import workoutsRouter from "./modules/workout/workout.routes";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/exercises", exercisesRouter);
app.use("/workouts", workoutsRouter);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
