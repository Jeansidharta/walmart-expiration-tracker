import { FC } from "react";
import { Item, Product } from "../../models";
import { Group, Paper, Text, Stack } from "@mantine/core";
import sAgo from "s-ago";
import { ImageExpandable } from "../image-expandable";
import { MapModalButton } from "../map-modal-button";
import { formatExpirationDate } from "../../utils/format-date";
import { IconTrash } from "@tabler/icons-react";
import { ButtonWithConfirmation } from "./button-with-confirmation";
import { useDeleteExpiration } from "../../api";
import { notifications } from "@mantine/notifications";

export const ExpirationItem: FC<{
	expirationItem: Item;
	product: Product;
	onDelete?: () => void;
}> = ({ expirationItem, product, onDelete = () => { } }) => {
	const expiration = new Date(expirationItem.expires_at);
	const { isLoading, error, deleteExpiration } = useDeleteExpiration();

	async function handleDelete() {
		await deleteExpiration(expirationItem.id);
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
				<ImageExpandable src={product.image} w={150} h={200} />
				<Stack>
					<Text fw={700} tt="capitalize">
						{product.name}
					</Text>
					<Group>
						Location: {expirationItem.location}
						<MapModalButton value={expirationItem.location} />
					</Group>
					<Group>
						<Text>Expires {sAgo(expiration)}</Text>
						<Text c="dimmed">({formatExpirationDate(expiration)})</Text>
					</Group>
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
