export default function paginate<T>(data: T[], maxLength: number): T[];
export default function paginate<T>(
	data: T[],
	maxLength: number,
	page: number,
): { items: T[]; page: number; maxPage: number; pageLength: number };
export default function paginate<T>(
	data: T[],
	pageLength: number,
	page?: number,
) {
	const maxPage = Math.ceil(data.length / pageLength);
	if (page && page > maxPage) page = maxPage;
	if (page) {
		return {
			items: data.length > pageLength
				? data.slice(page * pageLength, (page + 1) * pageLength)
				: data,
			page,
			maxPage,
			pageLength,
		};
	}
	const result = [];
	for (let page = 0; page < maxPage; page++) {
		result[page] = data.slice(
			page * pageLength,
			(page + 1) * pageLength,
		);
	}
	return result;
}