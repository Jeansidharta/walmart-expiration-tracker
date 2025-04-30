import { FC } from "react";
import { Item, Product } from "../../models";
import { Group, Paper, Text, Stack } from "@mantine/core";
import sAgo from "s-ago";
import { ImageExpandable } from "../image-expandable";
import { MapModalButton } from "../map-modal-button";
import { formatExpirationDate } from "../../utils/format-date";

export const ExpirationItem: FC<{ expirationItem: Item; product: Product }> = ({
	expirationItem,
	product,
}) => {
	const expiration = new Date(expirationItem.expires_at);
	return (
		<Paper withBorder p="xs" w="100%">
			<Group>
				<ImageExpandable src={product.image} w={100} h={100} />
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
				</Stack>
			</Group>
		</Paper>
	);
};
