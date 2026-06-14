import express from "express";
import authRouter  from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import exercisesRouter from "./modules/exercises/exercises.routes";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/exercises", exercisesRouter);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});
