import { FC } from "react";
import sAgo from "s-ago";
import {
	Stack,
	Title,
	Text,
	Paper,
	Group,
	Accordion,
	Flex,
} from "@mantine/core";
import { useParams } from "react-router";
import { useDeleteExpiration, useGetProduct } from "../../../api";
import { ImageExpandable } from "../../../components/image-expandable";
import { productImageURL } from "../../../utils/product-image-uri";
import Barcode from "react-barcode";
import { appendUpcCheksum } from "../../../utils/upc";
import { Item } from "../../../models";
import { notifications } from "@mantine/notifications";
import { formatExpirationDate } from "../../../utils/format-date";
import { ButtonWithConfirmation } from "../../../components/button-with-confirmation";
import {
	IconCalendar,
	IconCashRegister,
	IconCheck,
	IconTrash,
} from "@tabler/icons-react";
import { RegisterMap } from "../../../components/register-map";
import { getRegisterFromLocation } from "../../../utils/register-offset";

export const ProductPage: FC = () => {
	const { product_barcode } = useParams() as { product_barcode: string };

	const { withProduct } = useGetProduct(product_barcode);

	const isUPCA = product_barcode.length === 11;
	return (
		<Stack>
			{withProduct(({ product, items }) => (
				<>
					<Title>{product.name}</Title>
					<Stack justify="center" align="center">
						<ImageExpandable
							w={400}
							h={400}
							src={productImageURL(product_barcode)}
						/>
						<Barcode
							width={3}
							value={
								isUPCA ? appendUpcCheksum(product_barcode) : product_barcode
							}
							format={isUPCA ? "UPC" : "UPCE"}
						/>
					</Stack>

					<Accordion>
						<Accordion.Item value="expiration">
							<Accordion.Control icon={<IconCalendar />}>
								Expirations
							</Accordion.Control>
							<Accordion.Panel>
								{items.map((item) => (
									<ExpirationItem expirationItem={item} key={item.id} />
								))}
							</Accordion.Panel>
						</Accordion.Item>
						<Accordion.Item value="registers">
							<Accordion.Control icon={<IconCashRegister />}>
								Permanent Registers
							</Accordion.Control>
							<Accordion.Panel></Accordion.Panel>
						</Accordion.Item>
						<Accordion.Item value="last-checks">
							<Accordion.Control icon={<IconCheck />}>
								LastChecks
							</Accordion.Control>
							<Accordion.Panel></Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</>
			))}
		</Stack>
	);
};

const ExpirationItem: FC<{
	expirationItem: Item;
	onDelete?: () => void;
}> = ({ expirationItem, onDelete = () => { } }) => {
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
	const register = getRegisterFromLocation(expirationItem.location);
	return (
		<Paper withBorder p="xs" w="100%">
			<Flex>
				{register && (
					<div style={{ width: 120 }}>
						<RegisterMap
							height={150}
							register={register}
							selectedShelf={expirationItem.location}
						/>
					</div>
				)}
				<Stack>
					<Group>
						Location: {expirationItem.location}
						<Text c="dimmed">{expirationItem.id}</Text>
					</Group>
					<Group gap={8}>
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
						Delete
					</ButtonWithConfirmation>
				</Stack>
			</Flex>
		</Paper>
	);
};
