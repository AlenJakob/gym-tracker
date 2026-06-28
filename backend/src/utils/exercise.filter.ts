type Scope = "mine" | "global";

export function buildExerciseWhere(scope: Scope | undefined, userId: string) {
	switch (scope) {
		case "mine":
			return { userId };

		case "global":
			return { isGlobal: true };

		default:
			return {
				OR: [{ isGlobal: true }, { userId }],
			};
	}
}
