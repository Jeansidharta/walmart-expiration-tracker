import { FC, useState } from "react";
import sAgo from "s-ago";
import {
	Accordion,
	Badge,
	Card,
	Flex,
	Group,
	NumberInput,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Map } from "../components/map";
import useSWR from "swr";
import { withLoader } from "../utils/with-loader";
import { ImageExpandable } from "../components/image-expandable";
import { productImageURL } from "../utils/product-image-uri";
import { formatExpirationDate } from "../utils/format-date";
import { Item, Product } from "../models";
import { DateInput } from "@mantine/dates";
import { LoadingButton } from "../components/loading-button";
import { useCreateExpiration } from "../api";
import { useForm } from "@mantine/form";

const REGISTERS_VIEWBOX: Record<
	number,
	{ x: number; y: number; width: number; height: number; locations: string[] }
> = {
	1: {
		x: 1233.965,
		y: 1315.02,
		width: 61.681,
		height: 132.122,
		locations: [
			"Z2-1",
			"Z2-2",
			"Z2-3",
			"Z2-4",
			"Z3-1",
			"Z3-2",
			"Z3-3",
			"Z3-200",
		],
	},
	2: {
		x: 1295.103,
		y: 1308.374,
		width: 53.706,
		height: 81.839,
		locations: ["Z4-1", "Z4-2", "Z4-3", "Z5-1", "Z5-2", "Z5-3", "Z5-200"],
	},
	3: {
		x: 1348.266,
		y: 1307.488,
		width: 53.706,
		height: 84.497,
		locations: ["Z6-1", "Z6-2", "Z6-3", "Z7-1", "Z7-2", "Z7-3", "Z7-200"],
	},
	4: {
		x: 1401.208,
		y: 1313.912,
		width: 53.706,
		height: 75.858,
		locations: ["Z8-1", "Z8-2", "Z8-3", "Z9-1", "Z9-2", "Z9-3", "Z9-200"],
	},
	5: {
		x: 1454.371,
		y: 1313.247,
		width: 53.484,
		height: 76.523,
		locations: [
			"Z10-1",
			"Z10-2",
			"Z10-3",
			"Z11-1",
			"Z11-2",
			"Z11-3",
			"Z11-200",
		],
	},
	6: {
		x: 1507.534,
		y: 1313.025,
		width: 53.262,
		height: 76.523,
		locations: [
			"Z12-1",
			"Z12-2",
			"Z12-3",
			"Z13-1",
			"Z13-2",
			"Z13-3",
			"Z13-200",
		],
	},
	7: {
		x: 1560.254,
		y: 1313.247,
		width: 51.268,
		height: 76.523,
		locations: [
			"Z14-1",
			"Z14-2",
			"Z14-3",
			"Z15-1",
			"Z15-2",
			"Z15-3",
			"Z15-200",
		],
	},
	8: {
		x: 1610.981,
		y: 1313.025,
		width: 51.49,
		height: 76.523,
		locations: [
			"Z16-1",
			"Z16-2",
			"Z16-3",
			"Z17-1",
			"Z17-2",
			"Z17-3",
			"Z17-200",
		],
	},
	9: {
		x: 1661.043,
		y: 1313.247,
		width: 51.49,
		height: 76.523,
		locations: [
			"Z18-1",
			"Z18-2",
			"Z18-3",
			"Z19-1",
			"Z19-2",
			"Z19-3",
			"Z19-200",
		],
	},
	10: {
		x: 1711.327,
		y: 1313.69,
		width: 50.825,
		height: 76.523,
		locations: [
			"Z20-1",
			"Z20-2",
			"Z20-3",
			"Z21-1",
			"Z21-2",
			"Z21-3",
			"Z21-200",
		],
	},
	11: {
		x: 1761.389,
		y: 1307.709,
		width: 68.104,
		height: 82.504,
		locations: [
			"Z22-1",
			"Z22-2",
			"Z22-3",
			"Z23-1",
			"Z23-2",
			"Z23-3",
			"Z23-200",
		],
	},
	12: {
		x: 1829.172,
		y: 1306.823,
		width: 62.345,
		height: 82.504,
		locations: [
			"Z24-1",
			"Z24-2",
			"Z24-3",
			"Z25-1",
			"Z25-2",
			"Z25-3",
			"Z25-200",
		],
	},
	13: {
		x: 1891.196,
		y: 1305.937,
		width: 113.071,
		height: 117.725,
		locations: [
			"Z27-5",
			"Z27-6",
			"Z27-7",
			"Z27-8",
			"Z27-9",
			"Z27-10",
			"Z27-11",
			"Z27-12",
			"Z26-1",
			"Z26-2",
			"Z26-3",
			"Z27-1",
			"Z27-2",
			"Z27-3",
			"Z27-4",
		],
	},
};

type Response = {
	checked: {
		barcode: string;
		register_offset: number;
		name: string;
		last_update: number;
	}[];
	unchecked: {
		barcode: string;
		register_offset: number;
		name: string;
	}[];
};

const RegisterProduct: FC<{
	product: {
		barcode: string;
		register_offset: number;
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
						{last_update && (
							<Stack gap={0}>
								<Text>Last updated {sAgo(new Date(last_update))}</Text>
								<Text c="dimmed">
									({formatExpirationDate(new Date(last_update))})
								</Text>
							</Stack>
						)}
					</Stack>
				</Flex>
			</Paper>
		);
	};

function useRegisterProducts(register: null | number) {
	const { data, isLoading, error, ...others } = useSWR<Response>(
		typeof register === "number" ? `register/${register}` : null,
		{ keepPreviousData: false },
	);
	return {
		...others,
		withRegisterProducts: (withLoader<Response>).bind(
			null,
			isLoading,
			data,
			error,
		),
	};
}

function useGetProduct(barcode?: null | string) {
	type Response = {
		product: Product;
		items: Item[];
	};
	const { data, isLoading, error, ...others } = useSWR<Response>(
		barcode && `product/${barcode}`,
	);
	return {
		...others,
		withProduct: (withLoader<Response>).bind(null, isLoading, data, error),
	};
}

const ShowProduct: FC<{
	product: Product;
	items: Item[];
	register: number;
	register_offset: number;
	onSubmit?: () => void;
}> = ({ product, items, register, register_offset, onSubmit = () => { } }) => {
	const form = useForm<{ expirationDate: string }>({
		initialValues: { expirationDate: new Date().toISOString() },
		validate: {
			expirationDate: (v) =>
				new Date(v).getTime() <= Date.now()
					? "The expiration date should be after the current date"
					: items.find(
						(exp) =>
							formatExpirationDate(new Date(exp.expires_at)) ===
							formatExpirationDate(new Date(v)),
					)
						? "This date has already been registered"
						: null,
		},
	});
	const { createExpiration, isLoading, error } = useCreateExpiration();

	const location = REGISTERS_VIEWBOX[register].locations[register_offset!];

	async function handleSubmit({ expirationDate }: { expirationDate: string }) {
		await createExpiration({
			expires_at: new Date(expirationDate).getTime(),
			location,
			product_barcode: product.barcode,
		});
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
							viewbox={REGISTERS_VIEWBOX[register]}
							selectedShelf={location}
						/>
					</Flex>
					{product.name && <Text>{product.name}</Text>}
					<Group
						mt={16}
						align="center"
						gap={4}
						style={{
							visibility: items.length === 0 ? "hidden" : "unset",
							width: "100%",
						}}
					>
						<Text c="dimmed">Dates registered:</Text>
						{items
							.filter((item) => item.location === location)
							.map(({ expires_at }) => (
								<Badge color="gray" key={expires_at}>
									{formatExpirationDate(new Date(expires_at))}
								</Badge>
							))}
					</Group>
					<DateInput
						label="Expiration Date"
						{...form.getInputProps("expirationDate")}
					/>
					<LoadingButton
						isLoading={isLoading}
						error={error?.message}
						type="submit"
					>
						Create expiration
					</LoadingButton>
				</Stack>
			</form>
		</Card>
	);
};

export const InspectionPage: FC = () => {
	const [register, setRegister] = useState<number | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<{
		barcode: string;
		last_update?: number;
		register_offset: number;
	} | null>(null);
	const { withRegisterProducts, mutate: mutateRegisterProducts } =
		useRegisterProducts(register);
	const { withProduct, mutate: mutateGetProduct } = useGetProduct(
		selectedProduct?.barcode,
	);
	return (
		<Stack>
			<NumberInput
				label="Register"
				w={200}
				max={13}
				min={1}
				value={register ?? 0}
				onChange={(v) => setRegister(Number(v))}
			/>
			{typeof register === "number" &&
				withRegisterProducts(({ checked, unchecked }) => (
					<>
						{withProduct(({ items, product }) => (
							<ShowProduct
								product={product}
								register={register!}
								register_offset={selectedProduct!.register_offset}
								items={items}
								onSubmit={() => {
									mutateRegisterProducts();
									mutateGetProduct();
								}}
							/>
						))}
						<Paper withBorder>
							<Accordion defaultValue="Apples">
								<Accordion.Item value="unchecked">
									<Accordion.Control>
										<Title>Unchecked Products (x{unchecked.length})</Title>
									</Accordion.Control>
									<Accordion.Panel>
										{unchecked.map((product) => (
											<RegisterProduct
												onClick={() => setSelectedProduct(product)}
												isSelected={
													product.barcode === selectedProduct?.barcode
												}
												key={product.barcode}
												product={product}
											/>
										))}
									</Accordion.Panel>
								</Accordion.Item>
								<Accordion.Item value="checked">
									<Accordion.Control>
										<Title>Checked Products (x{checked.length})</Title>
									</Accordion.Control>
									<Accordion.Panel>
										{checked.map((product) => (
											<RegisterProduct
												onClick={() => setSelectedProduct(product)}
												isSelected={
													product.barcode === selectedProduct?.barcode
												}
												key={product.barcode}
												product={product}
											/>
										))}
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Paper>
					</>
				))}
		</Stack>
	);
};
