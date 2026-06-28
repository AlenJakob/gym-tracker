export const authDocs = {
	"/register": {
		post: {
			summary: "Create user",
			tags: ["auth"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: ["email", "password"],
							properties: {
								email: {
									type: "string",
									example: "mojo2@int.pl",
								},
								password: {
									type: "string",
									example: "123456",
								},
							},
						},
					},
				},
			},

			responses: {
				201: {
					description: "Created user",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									createdAt: {
										type: "string",
										format: "date-time",
									},
								},
							},
						},
					},
				},

				401: {
					description: "Unauthorized - missing or invalid token",
				},
				400: {
					description: "Bad Request - validation error",
				},
				409: {
					description: "Email already taken",
				},
			},
		},
	},
	"/login": {
		post: {
			summary: "Sign in",
			tags: ["auth"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: ["email", "password"],
							properties: {
								email: {
									type: "string",
									example: "mojo2@int.pl",
								},
								password: {
									type: "string",
									example: "123456",
								},
							},
						},
					},
				},
			},

			responses: {
				200: {
					description: "User logged in",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									token: {
										type: "string",
									},
								},
							},
						},
					},
				},

				401: {
					description: "Invalid credentials",
				},
			},
		},
	},
};
