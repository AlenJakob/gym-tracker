import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../../package.json";
import { exercisesDocs } from "./exercises.swagger";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Exercise API",
			version,
			description: "REST API documentation",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
		paths: {
			...exercisesDocs,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},

	// apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.schemas.ts"],
	apis: ["./src/routes/**/*.ts"],
};

export default swaggerJsdoc(options);
