/** This public static site does not implement password-protected articles. */
export function assertPublicContent(data, source = "Article") {
	if (
		(data.encrypted !== undefined && data.encrypted !== false) ||
		data.password ||
		data.passwordHint ||
		data.hideHomeContent
	) {
		throw new Error(
			`${source}: encrypted/password/passwordHint/hideHomeContent are unsupported; do not publish private content here`,
		);
	}
}

export function inferredUpdated(published, date) {
	return new Date(
		Math.max(
			new Date(published).valueOf(),
			new Date(`${date}T00:00:00Z`).valueOf(),
		),
	);
}
