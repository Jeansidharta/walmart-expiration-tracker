import { FC } from "react";
import { Text } from "@mantine/core";
import { NavLink } from "react-router";

export const ProductBarcode: FC<{ barcode: string }> = ({ barcode }) => {
	return (
		<NavLink to={`/product/${barcode}`}>
			<Text c="dimmed">
				{barcode.substring(0, barcode.length - 4)}
				<strong>{barcode.substring(barcode.length - 4)}</strong>
			</Text>
		</NavLink>
	);
};
