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
import {
	useDeleteExpiration,
	useDeleteProductLocation,
	useGetProduct,
	useGetProductLocation,
} from "../../../api";
import { ImageExpandable } from "../../../components/image-expandable";
import { productImageURL } from "../../../utils/product-image-uri";
import Barcode from "react-barcode";
import { appendUpcCheksum } from "../../../utils/upc";
import { Expiration } from "../../../models";
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
import { getRegisterOffsetFromLocation } from "../../../utils/register-offset";
import { LoadingButton } from "../../../components/loading-button";
import { AddLocation as AddLocation } from "./add-location";

export const ProductPage: FC = () => {
	const { product_barcode } = useParams() as { product_barcode: string };

	const { withProduct, mutate: mutateProduct } = useGetProduct(product_barcode);
	const { withProductLocation, mutate: mutateProductRegister } =
		useGetProductLocation(product_barcode);

	const isUPCA = product_barcode.length === 11;
	return (
		<Stack>
			{withProduct(({ product, expirations }) => (
				<>
					<Title tt="capitalize">{product.name}</Title>
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
								{expirations.map(({ location, ...expiration }) => (
									<ExpirationItem
										expirationItem={expiration}
										location={location}
										onDelete={mutateProduct}
										key={expiration.id}
									/>
								))}
							</Accordion.Panel>
						</Accordion.Item>
						<Accordion.Item value="registers">
							<Accordion.Control icon={<IconCashRegister />}>
								Locations
							</Accordion.Control>
							<Accordion.Panel>
								<AddLocation
									onCreate={mutateProductRegister}
									productBarcode={product_barcode}
								/>
								<Flex wrap="wrap" gap={16} justify="center">
									{withProductLocation((productLocations) =>
										productLocations.map(({ location, last_update }) => (
											<LocationItem
												onDelete={mutateProductRegister}
												location={location}
												lastUpdate={last_update}
												product_barcode={product_barcode}
												key={location}
											/>
										)),
									)}
								</Flex>
							</Accordion.Panel>
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

const LocationItem: FC<{
	product_barcode: string;
	location: string;
	lastUpdate: number | null;
	onDelete?: () => void;
}> = ({ product_barcode, lastUpdate, location, onDelete = () => { } }) => {
	const { deleteProductLocation, isLoading, error } =
		useDeleteProductLocation();
	async function handleDelete() {
		await deleteProductLocation(product_barcode, location);
		notifications.show({
			title: "Success!",
			message: "Expiration successfully removed",
			color: "green",
		});
		onDelete();
	}

	const regOff = getRegisterOffsetFromLocation(location);

	return (
		<Paper withBorder p="xs" w={180}>
			<Stack align="center">
				{regOff && (
					<RegisterMap
						height={150}
						register={regOff[0]}
						selectedShelf={location}
					/>
				)}
				<Stack gap={0} align="center">
					<span>{location}</span>
					<span>
						{lastUpdate
							? `Checked ${sAgo(new Date(lastUpdate))}`
							: "Never checked"}
					</span>
				</Stack>
				<LoadingButton
					isLoading={isLoading}
					error={error?.message}
					icon={<IconTrash style={{ width: 16, height: 16 }} />}
					onClick={handleDelete}
				>
					Delete
				</LoadingButton>
			</Stack>
		</Paper>
	);
};

const ExpirationItem: FC<{
	expirationItem: Expiration;
	location: string;
	onDelete?: () => void;
}> = ({ expirationItem, location, onDelete = () => { } }) => {
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
	const register = getRegisterOffsetFromLocation(location);
	return (
		<Paper withBorder p="xs" w="100%">
			<Flex>
				{register && (
					<div style={{ width: 120 }}>
						<RegisterMap
							height={150}
							register={register[0]}
							selectedShelf={location}
						/>
					</div>
				)}
				<Stack>
					<Group>
						Location: {location}
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
