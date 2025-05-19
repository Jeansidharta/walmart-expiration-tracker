export type ServerResponse<T> = { message: string; success: boolean; data: T };

export type Product = {
	barcode: string;
	created_at: number;
	name?: string | null | undefined;
};

export type Expiration = {
	id: number;
	creation_date: number;
	product_location_id: number;
	expires_at: number;
};
