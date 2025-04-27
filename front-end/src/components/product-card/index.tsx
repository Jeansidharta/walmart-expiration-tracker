import { FC } from "react";
import { Card, Text } from "@mantine/core";
import { Product } from "../../models";
import { ImageExpandable } from "../image-expandable";

const IMAGE_DIMENSIONS = { x: 300, y: 300 };

export const ProductCard: FC<{ product: Product }> = ({ product }) => {
	return (
		<Card maw={300}>
			{product.name && (
				<Text c="primary" fw={500}>
					{product.name}
				</Text>
			)}
			<ImageExpandable
				h={IMAGE_DIMENSIONS.y}
				w={IMAGE_DIMENSIONS.x}
				src={product.image}
			/>
		</Card>
	);
};
