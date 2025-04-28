import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Loader, Stack, Title, Text, Card } from "@mantine/core";
import { SelectProduct } from "../components/upc-input";
import { NewProductButton } from "../components/new-product-button";
import useSWR from "swr";
import { Item, Product } from "../models";
import { DateInput } from "@mantine/dates";
import { LocationSelectorField } from "../components/location-selector-field";
import { useCreateExpiration } from "../api";
import { LoadingButton } from "../components/loading-button";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ImageExpandable } from "../components/image-expandable";

type Data = { productUpc: string; selectedShelf: string; expirationDate: Date };

export function RegisterExpirationPage() {
	const form = useForm<Data>({
		initialValues: {
			expirationDate: new Date(),
			productUpc: "",
			selectedShelf: "",
		},
		validate: {
			productUpc: (v) => (v === "" ? "You must type a valid UPC" : null),
			selectedShelf: (v) =>
				v === "" ? "You must select a shelf location" : null,
			expirationDate: (v) =>
				v.getTime() <= Date.now()
					? "The expiration date should be after the current date"
					: null,
		},
	});
	const { productUpc } = form.values;

	const { data, isLoading: isLoadingProduct } = useSWR<{
		product: Product;
		items: Item[];
	}>(productUpc && `product/${productUpc}`, {
		shouldRetryOnError: false,
	});

	const {
		isLoading: isLoadingExpiration,
		createExpiration,
		error,
	} = useCreateExpiration();

	async function handleSubmit(value: Data) {
		const { selectedShelf, productUpc, expirationDate } = value;
		await createExpiration({
			count: 1,
			expires_at: expirationDate.getTime(),
			location: selectedShelf,
			product_barcode: productUpc,
		});
		notifications.show({
			title: "Success!",
			message: "Successfuly created expiration",
			color: "green",
		});
	}

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
							<ImageExpandable src={data.product.image} />
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
							shelvesToHighlight={data?.items.map((item) => item.location)}
							{...form.getInputProps("selectedShelf")}
						/>
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
