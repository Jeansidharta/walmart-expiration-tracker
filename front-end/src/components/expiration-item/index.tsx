import { FC } from "react";
import { Item, Product } from "../../models";
import { Group, Paper, Text, Stack } from "@mantine/core";
import sAgo from "s-ago";
import { ImageExpandable } from "../image-expandable";
import { MapModalButton } from "../map-modal-button";

export const ExpirationItem: FC<{ expirationItem: Item; product: Product }> = ({
	expirationItem,
	product,
}) => {
	return (
		<Paper withBorder p="xs">
			<Group>
				<ImageExpandable src={product.image} w={100} h={100} />
				<Stack>
					<Text fw={700}>{product.name}</Text>
					<Group>
						Location: {expirationItem.location}
						<MapModalButton value={expirationItem.location} />
					</Group>
					<Text>Expires {sAgo(new Date(expirationItem.expires_at))}</Text>
				</Stack>
			</Group>
		</Paper>
	);
};
