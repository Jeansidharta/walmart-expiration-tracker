import { useState } from "react";
import { Item, Product, ServerResponse } from "../models";
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
	type Body = Omit<Item, "creation_date" | "id">;
	const { post, ...a } = usePost<Body, Item>();
	return { createExpiration: (body: Body) => post("item", body), ...a };
};
export const useDeleteProductFromRegister = () => {
	const { post, ...a } = usePost<null, Item>("DELETE");
	return {
		removeProductFromRegister: (barcode: string, register: number) =>
			post(`product/${barcode}/register/${register}`, null),
		...a,
	};
};
export const useUpdateLastCheckedExpiration = () => {
	const { post, ...a } = usePost<null, Item>();
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
	const { post, ...a } = usePost<object, Item>("DELETE");
	return {
		deleteExpiration: (id: number) => post(`item/${id}`, {}),
		...a,
	};
};

export function useGetProduct(barcode?: null | string) {
	type Response = {
		product: Product;
		items: Item[];
	};
	const { data, isLoading, error, ...others } = useSWR<Response>(
		barcode && `product/${barcode}`,
	);
	return {
		...others,
		withProduct: (withLoader<Response>).bind(null, isLoading, data, error),
	};
}

export function useGetProductRegister(barcode?: null | string) {
	type Response = {
		product_barcode: string;
		register_offset: number;
		register: number;
	}[];
	const { data, isLoading, error, ...others } = useSWR<Response>(
		barcode && `product/${barcode}/register`,
	);
	return {
		...others,
		withProductRegister: (withLoader<Response>).bind(
			null,
			isLoading,
			data,
			error,
		),
	};
}

export const useCreatePermanentRegisterLocation = () => {
	type Body = {
		product_barcode: string;
		register_offset: number;
		register: number;
	};
	const { post, ...a } = usePost<Body, null>();
	return {
		createPermanentRegisterLocation: (body: Body) => post("register", body),
		...a,
	};
};
