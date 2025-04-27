import { FC } from "react";
import { useLoaderData } from "react-router";
import { Product } from "../models";
import { Divider, Paper, Stack, Title } from "@mantine/core";
import { NewProductButton } from "../components/new-product-button";
import { ImageExpandable } from "../components/image-expandable";

export const ProductsPage: FC = () => {
	const products = useLoaderData<Product[]>();

	return (
		<Stack>
			<Title>Products</Title>
			<NewProductButton />
			<Divider />
			<Stack gap={8}>
				{products.map((product) => (
					<Paper key={product.barcode} withBorder p={16}>
						{product.name}
						<ImageExpandable w={300} src={product.image} />
					</Paper>
				))}
			</Stack>
		</Stack>
	);
};
