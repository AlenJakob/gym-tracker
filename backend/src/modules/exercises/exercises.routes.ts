import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, (req, res) => {
	console.log("body logged", req.body);
	console.log("test", req.user);

	const name = req.body.name;

	res.status(201).json({
		message: `Exercies ${name} create`,
	});
});

export default router;
