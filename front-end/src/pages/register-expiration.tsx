import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Loader, Stack, Title, Text, Card, Badge, Group } from "@mantine/core";
import { SelectProduct } from "../components/upc-input";
import { NewProductButton } from "../components/new-product-button";
import useSWR from "swr";
import { Expiration, Product } from "../models";
import { DateInput } from "@mantine/dates";
import { LocationSelectorField } from "../components/location-selector-field";
import { useCreateExpiration } from "../api";
import { LoadingButton } from "../components/loading-button";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ImageExpandable } from "../components/image-expandable";
import { formatExpirationDate } from "../utils/format-date";
import { useMemo } from "react";
import { productImageURL } from "../utils/product-image-uri";

type Data = {
	productUpc: string;
	selectedShelf: string;
	expirationDate: string;
};

export function RegisterExpirationPage() {
	const form = useForm<Data>({
		initialValues: {
			expirationDate: new Date().toISOString(),
			productUpc: "",
			selectedShelf: "",
		},
		validate: {
			productUpc: (v) => (v === "" ? "You must type a valid UPC" : null),
			selectedShelf: (v) =>
				v === "" ? "You must select a shelf location" : null,
			expirationDate: (v) =>
				new Date(v).getTime() <= Date.now()
					? "The expiration date should be after the current date"
					: datesRegistered?.find(
						(exp) => exp === formatExpirationDate(new Date(v)),
					)
						? "This date has already been registered"
						: null,
		},
	});
	const { productUpc } = form.values;

	const {
		data,
		isLoading: isLoadingProduct,
		mutate,
	} = useSWR<{
		product: Product;
		expirations: (Expiration & { location: string })[];
	}>(productUpc && `product/${productUpc}`, {
		shouldRetryOnError: false,
	});

	const {
		isLoading: isLoadingExpiration,
		createExpiration,
		error,
	} = useCreateExpiration();

	async function handleSubmit(value: Data) {
		const {
			selectedShelf,
			productUpc,
			expirationDate: expirationDateString,
		} = value;
		const expirationDate = new Date(expirationDateString);
		await createExpiration({
			expires_at:
				expirationDate.getTime() +
				expirationDate.getTimezoneOffset() * 60 * 1000,
			location: selectedShelf,
			product_barcode: productUpc,
		});
		mutate();
		notifications.show({
			title: "Success!",
			message: "Successfuly created expiration",
			color: "green",
		});
	}

	const datesRegistered: string[] | undefined = useMemo(
		() =>
			data?.expirations
				.filter(
					(expiration) => expiration.location === form.values.selectedShelf,
				)
				.sort((left, right) => left.expires_at - right.expires_at)
				.map((expiration) =>
					formatExpirationDate(new Date(expiration.expires_at)),
				) ?? [],
		[data?.expirations, form.values.selectedShelf],
	);

	return (
		<Stack>
			<Title mb="lg">New Expiration</Title>
			<form
				onSubmit={(e) => {
					e.stopPropagation();
					form.onSubmit(handleSubmit)(e);
				}}
			>
				<Stack gap={8}>
					<SelectProduct {...form.getInputProps("productUpc")} />
					{isLoadingProduct ? (
						<Loader />
					) : data ? (
						<Card withBorder maw={300}>
							{data.product.name && <Text>{data.product.name}</Text>}
							<ImageExpandable src={productImageURL(data.product.barcode)} />
						</Card>
					) : null}
					<div
						style={{
							display:
								!isLoadingProduct && !data && Boolean(productUpc)
									? "unset"
									: "none",
						}}
					>
						Product not found. <NewProductButton barcode={productUpc ?? ""} />
					</div>
					<div
						style={{
							display:
								!isLoadingProduct && data && Boolean(productUpc)
									? "unset"
									: "none",
						}}
					>
						<LocationSelectorField
							shelvesToHighlight={data?.expirations.map(
								(expiration) => expiration.location,
							)}
							{...form.getInputProps("selectedShelf")}
						/>
						<Group
							mt={16}
							align="center"
							gap={4}
							style={{
								visibility: datesRegistered.length === 0 ? "hidden" : "unset",
							}}
						>
							<Text c="dimmed">Dates registered:</Text>
							{datesRegistered.map((expiration) => (
								<Badge color="gray" key={expiration}>
									{expiration}
								</Badge>
							))}
						</Group>
						<DateInput
							label="Expiration Date"
							{...form.getInputProps("expirationDate")}
						/>
						<LoadingButton
							error={error?.message}
							loading={isLoadingExpiration}
							mt={8}
							type="submit"
						>
							Register Expiration
						</LoadingButton>
					</div>
				</Stack>
			</form>
		</Stack>
	);
}
