import { FC, useState } from "react";
import { Group, NumberInput, Pagination, Paper, Stack } from "@mantine/core";
import useSWR from "swr";
import { withLoader } from "../../utils/with-loader";
import { Item, Product } from "../../models";
import { ShowProductCard } from "./product-card";
import { RegisterProductItem } from "./register-product-item";
import { useSearchParamWithDefault } from "../../utils/use-search-param";

type Response = {
	products: {
		barcode: string;
		register_offset: number;
		name: string;
		last_update?: number;
	}[];
	total_items: number;
};

const PAGE_SIZE = 10;

function useRegisterProducts(register: null | number, page: number) {
	const { data, isLoading, error, ...others } = useSWR<Response>(
		typeof register === "number" && register >= 1 && register <= 13
			? `register/${register}?page_size=${PAGE_SIZE}&page=${page}`
			: null,
	);
	return {
		...others,
		withRegisterProducts: (withLoader<Response>).bind(
			null,
			isLoading,
			data,
			error,
		),
	};
}

function useGetProduct(barcode?: null | string) {
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

export const InspectionPage: FC = () => {
	const [register, setRegister] = useState<number | null>(null);

	const [page, setPage] = useSearchParamWithDefault(`page`, Number.parseInt, 1);
	const [selectedProduct, setSelectedProduct] = useState<{
		barcode: string;
		last_update?: number;
		register_offset: number;
	} | null>(null);
	const { withRegisterProducts, mutate: mutateRegisterProducts } =
		useRegisterProducts(register, page);
	const { withProduct, mutate: mutateGetProduct } = useGetProduct(
		selectedProduct?.barcode,
	);
	return (
		<Stack>
			<NumberInput
				label="Register"
				w={200}
				max={13}
				min={1}
				value={register ?? 0}
				onChange={(v) => {
					setRegister(Number(v));
					setSelectedProduct(null);
				}}
			/>
			{typeof register === "number" &&
				withRegisterProducts(({ products, total_items }) => (
					<>
						{withProduct(
							({ items, product }) =>
								selectedProduct && (
									<ShowProductCard
										product={product}
										register={register!}
										register_offset={selectedProduct!.register_offset}
										items={items}
										onUnselect={() => setSelectedProduct(null)}
										onMutate={() => {
											mutateRegisterProducts();
											mutateGetProduct();
										}}
									/>
								),
						)}
						<Paper withBorder>
							{products.map((product) => (
								<RegisterProductItem
									onClick={() => setSelectedProduct(product)}
									isSelected={product.barcode === selectedProduct?.barcode}
									key={product.barcode}
									product={product}
								/>
							))}
						</Paper>
						<Group justify="center">
							<Pagination
								value={page}
								onChange={setPage}
								total={Math.floor(total_items / PAGE_SIZE)}
							/>
						</Group>
					</>
				))}
		</Stack>
	);
};
