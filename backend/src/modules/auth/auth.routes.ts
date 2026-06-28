import { Router } from "express";
import { prisma } from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.post("/register", async (request, response) => {
	const { email, password } = request.body;

	if (!email || !password) {
		return response.status(400).json({
			message: "Email and password are required",
		});
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (existingUser) {
		return response.status(409).json({
			message: "Email already taken",
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			role: "user",
		},
	});

	return response.status(201).json({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
	});
});

router.post("/login", async (request, response) => {
	const { email, password } = request.body;

	// 1. Szukamy usera po emailu
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	// 2. Jeśli user nie istnieje → odrzucamy request
	if (!user) {
		return response.status(401).json({
			message: "Invalid credentials",
		});
	}

	// 3. Porównujemy hasło z hashem z bazy
	const isPasswordValid = await bcrypt.compare(password, user.password);

	// 4. Jeśli hasło złe → odrzucamy
	if (!isPasswordValid) {
		return response.status(401).json({
			message: "Invalid credentials",
		});
	}

	// 5. Tworzymy JWT token (identyfikator usera)
	const token = jwt.sign(
		{
			userId: user.id,
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: "1d",
		},
	);

	// 6. Zwracamy token do frontend/backend clienta
	return response.status(200).json({
		token,
		user: { email: user.email, userId: user.id },
	});
});

// TODO: role endpoint WIP
// router.patch("/users/:id/role", authMiddleware, async (req, res) => {
// 	const currentUser = req.user;

// 	if (currentUser.role !== "admin") {
// 		return res.status(403).json({ message: "Forbidden" });
// 	}

// 	const { id } = req.params;
// 	const { role } = req.body;

// 	if (!role || !["user", "admin"].includes(role)) {
// 		return res.status(400).json({ message: "Invalid role" });
// 	}

// 	const updatedUser = await prisma.user.update({
// 		where: { id },
// 		data: { role },
// 	});

// 	return res.status(200).json(updatedUser);
// });

export default router;
