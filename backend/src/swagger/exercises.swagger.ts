export const exercisesDocs = {
	"/exercises": {
		post: {
			summary: "Create exercise belonging to authenticated user",
			tags: ["Exercises"],
			security: [
				{
					bearerAuth: [],
				},
			],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: ["name"],
							properties: {
								name: {
									type: "string",
									example: "Push up",
								},
							},
						},
					},
				},
			},

			responses: {
				201: {
					description: "Created exercise",
					content: {
						application: {
							schema: {
								type: "object",
								properties: {
									name: {
										type: "string",
									},
									isGlobal: {
										type: "boolean",
									},
								},
							},
						},
					},
				},

				401: {
					description: "Unauthorized - missing or invalid token",
				},
			},
		},
		get: {
			summary: "Get Exercises",
			tags: ["Exercises"],
			security: [
				{
					bearerAuth: [],
				},
			],
			parameters: [
				{
					in: "query",
					name: "scope",
					required: false,
					schema: {
						type: "string",
						enum: ["mine", "global"],
					},
					description: "Filter exercises by scope",
				},
			],

			responses: {
				200: {
					description: "Get Exercises",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									type: "object",
									properties: {
										id: {
											type: "string",
										},
										name: {
											type: "string",
										},
										userId: {
											type: "string",
										},
										createdAt: {
											type: "string",
										},
										isGlobal: {
											type: "boolean",
										},
									},
								},
							},
						},
					},
				},

				401: {
					description: "Unauthorized - missing or invalid token",
				},
			},
		},
	},
};
