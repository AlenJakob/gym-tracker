import { Router } from "express";
import { prisma } from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

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
	const isPasswordValid = await bcrypt.compare(
		password,
		user.password
	);

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
		}
	);

	// 6. Zwracamy token do frontend/backend clienta
	return response.json({
		token,
	});
});

router.post("/register", async (request, response) => {
	const { email, password } = request.body;

	// 1. Walidacja wejścia
	if (!email || !password) {
		return response.status(400).json({
			message: "Email and password are required",
		});
	}

	// 2. Sprawdzenie czy user już istnieje
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

	// 3. Hash hasła (NIGDY nie zapisujemy plaintext)
	const hashedPassword = await bcrypt.hash(password, 10);

	// 4. Tworzymy usera w bazie
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
		},
	});

	// 5. Zwracamy bezpieczne dane (bez hasła)
	return response.status(201).json({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
	});
});

export default router;