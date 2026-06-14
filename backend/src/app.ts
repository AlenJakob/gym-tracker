import express from "express";
import { authRouter } from "./routes/auth.routes";
import userRouter from "./routes/user.routes";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});
