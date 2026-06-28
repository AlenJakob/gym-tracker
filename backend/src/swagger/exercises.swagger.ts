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
					application: {
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
			summary: "Get all user created Exercises",
			security: [
				{
					bearerAuth: [],
				},
			],

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
	},
};
