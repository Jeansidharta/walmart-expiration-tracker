import { FC } from "react";
import { Product } from "../models";
import {
	Divider,
	Paper,
	Stack,
	Title,
	Text,
	Flex,
	Pagination,
	Group,
} from "@mantine/core";
import { NewProductButton } from "../components/new-product-button";
import { ImageExpandable } from "../components/image-expandable";
import useSWR from "swr";
import { withLoader } from "../utils/with-loader";
import { useSearchParamWithDefault } from "../utils/use-search-param";
import { productImageURL } from "../utils/product-image-uri";

const PAGE_SIZE = 10;

export const ProductsPage: FC = () => {
	const [page, setPage] = useSearchParamWithDefault(`page`, Number.parseInt, 1);
	const { data, isLoading, error } = useSWR<{
		products: Product[];
		total_items: number;
	}>(`product?page=${page - 1}&page_size=${PAGE_SIZE}`);

	return (
		<Stack>
			<Title>Products</Title>
			<NewProductButton />
			<Divider />
			<Flex wrap="wrap" gap={8} justify="center">
				{withLoader(isLoading, data, error, ({ products }) =>
					products.map((product) => (
						<Paper key={product.barcode} withBorder p={16} w={180}>
							<Stack gap={16} align="center" justify="space-between" h="100%">
								<Text tt="capitalize" fw={700} ta="center">
									{product.name}
								</Text>
								<ImageExpandable w={100} src={productImageURL( product.barcode)} />
							</Stack>
						</Paper>
					)),
				)}
			</Flex>
			<Group justify="center">
				<Pagination
					value={page}
					onChange={setPage}
					total={data ? Math.ceil(data.total_items / PAGE_SIZE) : 1}
				/>
			</Group>
		</Stack>
	);
};
