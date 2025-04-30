export function formatExpirationDate(date: Date) {
	const year = date.getFullYear().toString().padStart(4, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day =
		date.getDate() === 1 ? null : date.getDate().toString().padStart(2, "0");
	return `${month}/${day ? `${day}/` : ""}${year}`;
}
