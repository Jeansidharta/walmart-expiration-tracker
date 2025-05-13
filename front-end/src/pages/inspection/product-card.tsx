import { FC, useMemo } from "react";
import { Item, Product } from "../../models";
import {
	getRegisterLocationOffset,
	getRegisterViewbox,
} from "./registers_viewbox";
import { useForm } from "@mantine/form";
import { formatExpirationDate } from "../../utils/format-date";
import { useCreateExpiration, useUpdateLastCheckedExpiration } from "../../api";
import { Badge, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { ImageExpandable } from "../../components/image-expandable";
import { productImageURL } from "../../utils/product-image-uri";
import { LoadingButton } from "../../components/loading-button";
import { DateInput } from "@mantine/dates";
import { Map } from "../../components/map";
import { ButtonWithConfirmation } from "../../components/button-with-confirmation";

export const ShowProductCard: FC<{
	product: Product;
	items: Item[];
	register: number;
	register_offset: number;
	onSubmit?: () => void;
}> = ({ product, items, register, register_offset, onSubmit = () => { } }) => {
	const location = getRegisterLocationOffset(register, register_offset);
	const itemsAtThisLocation = useMemo(
		() => items.filter((item) => item.location === location),
		[location, items],
	);

	const form = useForm<{ expirationDate: string }>({
		initialValues: { expirationDate: new Date().toISOString() },
		validate: {
			expirationDate: (v) =>
				new Date(v).getTime() <= Date.now()
					? "The expiration date should be after the current date"
					: itemsAtThisLocation.find(
						(exp) =>
							formatExpirationDate(new Date(exp.expires_at)) ===
							formatExpirationDate(new Date(v)),
					)
						? "This date has already been registered"
						: null,
		},
	});
	const {
		createExpiration,
		isLoading: isLoadingCreateExpiration,
		error: errorCreateExpiration,
	} = useCreateExpiration();
	const {
		updateLastCheckedExpiration,
		isLoading: isLoadingUpdateCheckedExpiration,
		error: errorUpdateCheckedExpiration,
	} = useUpdateLastCheckedExpiration();

	async function handleSubmit({ expirationDate }: { expirationDate: string }) {
		await createExpiration({
			expires_at: new Date(expirationDate).getTime(),
			location,
			product_barcode: product.barcode,
		});
		onSubmit();
	}

	async function handleNoNewExpirations() {
		await updateLastCheckedExpiration(product.barcode, location);
		onSubmit();
	}

	return (
		<Card withBorder w="max-content">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<Flex>
						<ImageExpandable
							src={productImageURL(product.barcode)}
							fit="contain"
							w={200}
							h={200}
						/>
						<Map
							height={200}
							preventScroll
							viewbox={getRegisterViewbox(register)}
							selectedShelf={location}
						/>
					</Flex>
					<Stack gap={4}>
						{product.name && <Text>{product.name}</Text>}
						<ButtonWithConfirmation
							size="xs"
							variant="outline"
							color="secondary"
							isLoading={isLoadingCreateExpiration}
							error={errorCreateExpiration?.message}
							onConfirm={handleNoNewExpirations}
						>
							No new expirations
						</ButtonWithConfirmation>
					</Stack>
					<Group
						mt={16}
						align="center"
						gap={4}
						style={{
							visibility: itemsAtThisLocation.length === 0 ? "hidden" : "unset",
							width: "100%",
						}}
					>
						<Text c="dimmed">Dates registered:</Text>
						{itemsAtThisLocation.map(({ expires_at }) => (
							<Badge color="gray" key={expires_at}>
								{formatExpirationDate(new Date(expires_at))}
							</Badge>
						))}
					</Group>
					<DateInput
						label="Expiration Date"
						{...form.getInputProps("expirationDate")}
					/>
					<Group>
						<LoadingButton
							isLoading={isLoadingUpdateCheckedExpiration}
							error={errorUpdateCheckedExpiration?.message}
							type="submit"
						>
							Create expiration
						</LoadingButton>
					</Group>
				</Stack>
			</form>
		</Card>
	);
};
