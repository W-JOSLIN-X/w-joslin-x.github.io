export function shanghaiDay(date = new Date()) {
	return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai" }).format(
		date,
	);
}
/** Monday-first month cells. UTC arithmetic avoids browser timezone/DST shifts. */
export function monthCells(year, month) {
	const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
	const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, i) => {
		const day = i - offset + 1;
		return day > 0 && day <= count
			? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
			: null;
	});
}
export function matchesDay(post, date, records = []) {
	return (
		!date ||
		post.published === date ||
		post.updated === date ||
		records.some((r) => r.date === date && r.posts?.includes(post.slug))
	);
}
