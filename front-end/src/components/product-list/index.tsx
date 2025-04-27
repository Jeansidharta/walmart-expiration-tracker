import styles from "./styles.module.css";
import { FC } from "react";
import { Paper, SimpleGrid } from "@mantine/core";
import useSWR from "swr";
import { Product, ServerResponse } from "../../models";
import { withLoaderNoData } from "../../utils/with-loader";
import { ProductCard } from "../product-card";

interface Props {
	location?: string;
}

export const ProductList: FC<Props> = () => {
	const { isLoading, data } = useSWR<ServerResponse<Product[]>>(`product`);
	return (
		<Paper withBorder p={16} className={styles.productList}>
			{withLoaderNoData(isLoading, data, (data) => (
				<SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
					{data.data.map((product) => (
						<ProductCard product={product} />
					))}
				</SimpleGrid>
			))}
		</Paper>
	);
};
