export type ServerResponse<T> = { message: string; success: boolean; data: T };

export type Product = {
	barcode: string;
	created_at: number;
	name?: string | null | undefined;
};

export type Item = {
	id: number;
	creation_date: number;
	product_barcode: string;
	location: string;
	expires_at: number;
};
