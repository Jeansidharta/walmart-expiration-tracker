import { FC, ReactNode, useMemo } from "react";
import { Item, Product } from "../../models";
import { useForm } from "@mantine/form";
import { formatExpirationDate } from "../../utils/format-date";
import {
	useCreateExpiration,
	useRemoveProductFromRegister,
	useUpdateLastCheckedExpiration,
} from "../../api";
import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Flex,
	Group,
	Input,
	Menu,
	Modal,
	Stack,
	Text,
	Title,
	useModalsStack,
} from "@mantine/core";
import { ImageExpandable } from "../../components/image-expandable";
import { productImageURL } from "../../utils/product-image-uri";
import { LoadingButton } from "../../components/loading-button";
import { DateInput } from "@mantine/dates";
import {
	IconCashRegister,
	IconCurrentLocation,
	IconDotsVertical,
	IconNewsOff,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { ProductBarcode } from "../../components/product-barcode";
import { RegisterMap } from "../../components/register-map";
import { getRegisterLocationOffset } from "../../utils/register-offset";

const ConfirmModal: FC<{
	opened: boolean;
	body?: ReactNode;
	title?: ReactNode;
	onConfirm?: () => void;
	isLoading?: boolean;
	actionError?: string;
	onClose: () => void;
}> = ({
	opened,
	onClose,
	onConfirm = () => { },
	body = "Are you sure you want to proceeed?",
	title = "Confirmation",
	isLoading = false,
	actionError,
}) => {
		return (
			<Modal opened={opened} onClose={onClose} withCloseButton={false}>
				<Stack gap={32}>
					<Title>{title}</Title>
					<Text>{body}</Text>
					<Input.Wrapper>
						<Flex justify="flex-end" gap={16}>
							<Button variant="outline" color="secondary" onClick={onClose}>
								Cancel
							</Button>
							<LoadingButton isLoading={isLoading} onClick={onConfirm}>
								Confirm
							</LoadingButton>
						</Flex>
						<Input.Error mt={4}>{actionError}</Input.Error>
					</Input.Wrapper>
				</Stack>
			</Modal>
		);
	};

const ConfirmRemoveProductFromRegister: FC<{
	opened: boolean;
	onClose: () => void;
	barcode: string;
	register: number;
	onSubmit: () => void;
}> = ({ opened, onClose, barcode, register, onSubmit }) => {
	const { removeProductFromRegister, isLoading, error } =
		useRemoveProductFromRegister();

	return (
		<ConfirmModal
			onClose={onClose}
			opened={opened}
			title="Remove From Register"
			onConfirm={async () => {
				await removeProductFromRegister(barcode, register);
				notifications.show({
					title: "Success!",
					message: `Successfuly removed product from register ${register}`,
					color: "green",
				});
				onClose();
				onSubmit();
			}}
			isLoading={isLoading}
			actionError={error?.message}
		/>
	);
};
const ConfirmUpdateCheckDate: FC<{
	opened: boolean;
	onClose: () => void;
	barcode: string;
	location: string;
	onSubmit: () => void;
}> = ({ opened, onClose, barcode, location, onSubmit }) => {
	const { updateLastCheckedExpiration, isLoading, error } =
		useUpdateLastCheckedExpiration();

	return (
		<ConfirmModal
			onClose={onClose}
			opened={opened}
			title="Update Check Date"
			onConfirm={async () => {
				await updateLastCheckedExpiration(barcode, location);
				notifications.show({
					title: "Success!",
					message: "Successfuly updated product",
					color: "green",
				});
				onClose();
				onSubmit();
			}}
			isLoading={isLoading}
			actionError={error?.message}
		/>
	);
};

export const ShowProductCard: FC<{
	product: Product;
	items: Item[];
	register: number;
	register_offset: number;
	onMutate?: () => void;
	onUnselect?: () => void;
}> = ({
	product,
	items,
	register,
	register_offset,
	onMutate = () => { },
	onUnselect = () => { },
}) => {
		const stack = useModalsStack([
			"confirm-update-check-date",
			"confirm-remove-from-register",
		]);
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
		const { createExpiration, isLoading, error } = useCreateExpiration();

		async function handleSubmit({ expirationDate }: { expirationDate: string }) {
			await createExpiration({
				expires_at: new Date(expirationDate).getTime(),
				location,
				product_barcode: product.barcode,
			});
			onMutate();
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
							<RegisterMap
								height={200}
								preventScroll
								selectedOffset={register_offset}
								register={register}
							/>
						</Flex>
						<Flex gap={4} justify="space-between">
							<Stack gap={0}>
								{product.name && <Text>{product.name}</Text>}
								<ProductBarcode barcode={product.barcode} />
							</Stack>
							<Menu shadow="md">
								<Menu.Target>
									<ActionIcon
										variant="transparent"
										color="secondary"
										aria-label="Settings"
									>
										<IconDotsVertical
											style={{ width: "70%", height: "70%" }}
											stroke={2.5}
										/>
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item
										onClick={() => stack.open("confirm-update-check-date")}
										leftSection={<IconNewsOff size={14} />}
									>
										No new expirations
									</Menu.Item>
									<Menu.Item
										onClick={() => {
											alert("Not yet implemented");
										}}
										leftSection={<IconCurrentLocation size={14} />}
									>
										Item in wrong place
									</Menu.Item>
									<Menu.Item
										onClick={() => stack.open("confirm-remove-from-register")}
										leftSection={<IconCashRegister size={14} />}
									>
										Item not in this register
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</Flex>
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
								isLoading={isLoading}
								error={error?.message}
								type="submit"
							>
								Create expiration
							</LoadingButton>
						</Group>
					</Stack>
				</form>
				<Modal.Stack>
					<ConfirmRemoveProductFromRegister
						opened={stack.state["confirm-remove-from-register"]}
						barcode={product.barcode}
						register={register}
						onClose={stack.closeAll}
						onSubmit={() => {
							onMutate();
							onUnselect();
						}}
					/>
					<ConfirmUpdateCheckDate
						opened={stack.state["confirm-update-check-date"]}
						barcode={product.barcode}
						location={location}
						onClose={stack.closeAll}
						onSubmit={() => {
							onMutate();
							onUnselect();
						}}
					/>
				</Modal.Stack>
			</Card>
		);
	};
