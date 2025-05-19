import { useState } from "react";
import { Expiration, Product, ServerResponse } from "../models";
import { BASE_URL } from "../constants";
import useSWR from "swr";
import { withLoader } from "../utils/with-loader";

async function parseResponse<T = unknown>(res: Response) {
	const json: ServerResponse<T> = await res.json();
	if (res.ok) return json.data;
	else throw new Error(json.message);
}

// const sleep = (time: number) => new Promise((res) => setTimeout(res, time));

export const usePost = <Body, Response>(method: string = "POST") => {
	const [state, setState] = useState<{
		data: Response | null;
		isLoading: boolean;
		error: Error | null;
	}>({ data: null, isLoading: false, error: null });

	return {
		isLoading: state.isLoading,
		error: state.error,
		post: async (path: string, body: Body) => {
			try {
				setState({ data: null, isLoading: true, error: null });
				const res = await fetch(`${BASE_URL}/${path}`, {
					method,
					body: body ? JSON.stringify(body) : undefined,
					headers: { "Content-Type": "application/json" },
				});
				const data = await parseResponse<Response>(res);
				setState({ data, isLoading: false, error: null });
				return data;
			} catch (e: unknown) {
				setState({ data: null, isLoading: false, error: e as Error });
				throw e;
			}
		},
	};
};

export const useCreateExpiration = () => {
	type Body = { location: string; product_barcode: string; expires_at: number };
	const { post, ...a } = usePost<Body, Expiration>();
	return { createExpiration: (body: Body) => post("expiration", body), ...a };
};
export const useDeleteProductLocation = () => {
	const { post, ...a } = usePost<null, Expiration>("DELETE");
	return {
		deleteProductLocation: (barcode: string, location: string) =>
			post(`product/${barcode}/location/${location}`, null),
		...a,
	};
};
export const useUpdateLastCheckedExpiration = () => {
	const { post, ...a } = usePost<null, Expiration>("PATCH");
	return {
		updateLastCheckedExpiration: (barcode: string, location: string) =>
			post(`product/${barcode}/location/${location}`, null),
		...a,
	};
};
export const useCreateProduct = () => {
	type Body = Omit<Product, "created_at">;
	const { post, ...a } = usePost<Body, Product>();
	return { createProduct: (body: Body) => post("product", body), ...a };
};
export const useDeleteExpiration = () => {
	const { post, ...a } = usePost<object, Expiration>("DELETE");
	return {
		deleteExpiration: (id: number) => post(`expiration/${id}`, {}),
		...a,
	};
};

export function useGetExpirations(
	page: number = 1,
	pageSize?: number,
	expired: boolean = false,
) {
	type Response = {
		expirations: {
			expiration: Expiration;
			product: Product;
			location: string;
		}[];
		total_items: number;
	};
	const { data, isLoading, error, ...others } = useSWR<Response>(
		`expiration?expired=${expired}&page=${page - 1}${pageSize ? `&page_size=${pageSize}` : ""}`,
	);
	return {
		...others,
		data,
		withExpirations: (withLoader<Response>).bind(null, isLoading, data, error),
	};
}

export function useGetProduct(barcode?: null | string) {
	type Response = {
		product: Product;
		expirations: (Expiration & { location: string })[];
	};
	const { data, isLoading, error, ...others } = useSWR<Response>(
		barcode && `product/${barcode}`,
	);
	return {
		...others,
		withProduct: (withLoader<Response>).bind(null, isLoading, data, error),
	};
}

export function useGetProductLocation(barcode?: null | string) {
	type Response = {
		location: string;
		last_update: number | null;
	}[];
	const { data, isLoading, error, ...others } = useSWR<Response>(
		barcode && `product/${barcode}/location`,
	);
	return {
		...others,
		withProductLocation: (withLoader<Response>).bind(
			null,
			isLoading,
			data,
			error,
		),
	};
}

export const useCreateProductLocation = () => {
	const { post, ...a } = usePost<{ last_update: null }, Expiration>();
	return {
		createProductLocation: (barcode: string, location: string) =>
			post(`product/${barcode}/location/${location}`, { last_update: null }),
		...a,
	};
};
