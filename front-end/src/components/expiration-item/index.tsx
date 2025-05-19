import { FC } from "react";
import { Expiration, Product } from "../../models";
import { Group, Paper, Text, Stack } from "@mantine/core";
import sAgo from "s-ago";
import { ImageExpandable } from "../image-expandable";
import { MapModalButton } from "../map-modal-button";
import { formatExpirationDate } from "../../utils/format-date";
import { IconTrash } from "@tabler/icons-react";
import { useDeleteExpiration } from "../../api";
import { notifications } from "@mantine/notifications";
import { productImageURL } from "../../utils/product-image-uri";
import { ButtonWithConfirmation } from "../button-with-confirmation";
import { ProductBarcode } from "../product-barcode";

export const ExpirationItem: FC<{
	expiration: Expiration;
	product: Product;
	location: string;
	onDelete?: () => void;
}> = ({ expiration, product, location, onDelete = () => { } }) => {
	const expirationDate = new Date(expiration.expires_at);
	const { isLoading, error, deleteExpiration } = useDeleteExpiration();

	async function handleDelete() {
		await deleteExpiration(expiration.id);
		notifications.show({
			title: "Success!",
			message: "Expiration successfully removed",
			color: "green",
		});
		onDelete();
	}
	return (
		<Paper withBorder p="xs" w="100%">
			<Group>
				<ImageExpandable
					src={productImageURL(product.barcode)}
					w={150}
					h={200}
				/>
				<Stack>
					<Group>
						<Stack gap={0}>
							<Text fw={700} tt="capitalize">
								{product.name}
							</Text>
							<ProductBarcode barcode={product.barcode} />
						</Stack>
						<Text c="dimmed">{expiration.id}</Text>
					</Group>
					<Group>
						Location: {location}
						<MapModalButton value={location} />
					</Group>
					<Stack gap={0}>
						<Text>Expires {sAgo(expirationDate)}</Text>
						<Text c="dimmed">({formatExpirationDate(expirationDate)})</Text>
					</Stack>
					<ButtonWithConfirmation
						isLoading={isLoading}
						icon={<IconTrash style={{ width: 16, height: 16 }} />}
						size="xs"
						w="max-content"
						onConfirm={handleDelete}
						error={error?.message}
					>
						Pull
					</ButtonWithConfirmation>
				</Stack>
			</Group>
		</Paper>
	);
};
