export function decorationState({
	hidden,
	focus,
	saver,
	reduced,
	mode,
	atmosphere,
	edge,
}) {
	const allowed = !hidden && !focus && !saver && !reduced && mode !== "none";
	return {
		atmosphere: allowed && atmosphere !== "none",
		edge: allowed && mode === "banner" && edge !== "none",
	};
}
