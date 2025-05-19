import { Flex, Paper, Stack, Text } from "@mantine/core";
import sAgo from "s-ago";
import { FC } from "react";
import { ImageExpandable } from "../../components/image-expandable";
import { productImageURL } from "../../utils/product-image-uri";
import { formatExpirationDate } from "../../utils/format-date";

export const RegisterProductItem: FC<{
	product: {
		barcode: string;
		location: string;
		name: string;
		last_update?: number;
	};
	isSelected?: boolean;
	onClick?: () => void;
}> = ({
	product: { barcode, name, last_update },
	isSelected = false,
	onClick = () => { },
}) => {
		return (
			<Paper
				withBorder
				p="xs"
				w="100%"
				onClick={onClick}
				style={{
					borderColor: isSelected ? "var(--mantine-primary-color-6)" : "",
				}}
			>
				<Flex gap="sm">
					<ImageExpandable src={productImageURL(barcode)} w={100} h={100} />
					<Stack>
						<Stack gap={0}>
							<Text fw={700} tt="capitalize">
								{name}
							</Text>
							<Text c="dimmed">{barcode}</Text>
						</Stack>
						{last_update ? (
							<Stack gap={0}>
								<Text>Last checked {sAgo(new Date(last_update))}</Text>
								<Text c="dimmed">
									({formatExpirationDate(new Date(last_update))})
								</Text>
							</Stack>
						) : (
							<Text>Not checked yet</Text>
						)}
					</Stack>
				</Flex>
			</Paper>
		);
	};
