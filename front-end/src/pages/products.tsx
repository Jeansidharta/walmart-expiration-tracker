import { FC } from "react";
import { useLoaderData } from "react-router";
import { Product } from "../models";
import { Divider, Paper, Stack, Title, Text, Flex } from "@mantine/core";
import { NewProductButton } from "../components/new-product-button";
import { ImageExpandable } from "../components/image-expandable";

export const ProductsPage: FC = () => {
	const products = useLoaderData<Product[]>();

	return (
		<Stack>
			<Title>Products</Title>
			<NewProductButton />
			<Divider />
			<Flex wrap="wrap" gap={8} justify="center">
				{products.map((product) => (
					<Paper key={product.barcode} withBorder p={16} w={180}>
						<Stack gap={16} align="center" justify="space-between" h="100%">
							<Text tt="capitalize" fw={700} ta="center">
								{product.name}
							</Text>
							<ImageExpandable w={100} src={product.image} />
						</Stack>
					</Paper>
				))}
			</Flex>
		</Stack>
	);
};
