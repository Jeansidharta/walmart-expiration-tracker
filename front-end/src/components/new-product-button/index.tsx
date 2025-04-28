import { FC, useEffect } from "react";
import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { WebcamCapture } from "../camera";
import { useForm } from "@mantine/form";
import { useCreateProduct } from "../../api";
import { LoadingButton } from "../loading-button";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useSWRConfig } from "swr";
import { SelectProduct } from "../upc-input";

type Value = {
	image: string;
	name?: string;
	barcode: string;
};

export const NewProductButton: FC<{
	barcode?: string;
	disabled?: boolean;
	visible?: boolean;
}> = ({ disabled = false, visible = true, barcode = "" }) => {
	const [isModalOpen, { open: openModal, close: closeModal }] =
		useDisclosure(false);
	const { createProduct, isLoading, error } = useCreateProduct();
	const { mutate } = useSWRConfig();

	const form = useForm<Value>({
		initialValues: { barcode, image: "", name: "" },
		validate: {
			image: (v) => (v ? null : "You must take a picture"),
			barcode: (v) => (v ? null : "You must provide a barcode"),
		},
	});

	useEffect(() => {
		if (barcode && form.values.barcode !== barcode)
			form.setFieldValue("barcode", barcode);
	}, [barcode, form]);

	async function handleSubmit(values: Value) {
		const newProduct = await createProduct(values);
		notifications.show({
			title: "Success!",
			message: "Product created successfuly!",
			color: "green",
		});
		mutate(`product/${values.barcode}`, newProduct);
		form.reset();
		closeModal();
	}

	return (
		<>
			<Button
				onClick={openModal}
				disabled={disabled}
				style={{ display: visible ? "unset" : "none" }}
			>
				New Product
				<IconPlus style={{ width: "60%", height: "60%", marginLeft: 4 }} />
			</Button>
			<Modal opened={isModalOpen} onClose={closeModal} title="Create Product">
				{isModalOpen && (
					<form
						onSubmit={(e) => {
							e.stopPropagation();
							form.onSubmit(handleSubmit)(e);
						}}
					>
						<Stack>
							<WebcamCapture {...form.getInputProps("image")} />
							<SelectProduct
								disabled={Boolean(barcode)}
								{...form.getInputProps("barcode")}
							/>
							<TextInput label="Product Name" {...form.getInputProps("name")} />
							<LoadingButton
								icon={<IconPlus style={{ width: "60%", height: "60%" }} />}
								type="submit"
								loading={isLoading}
								error={error?.message}
							>
								Create
							</LoadingButton>
						</Stack>
					</form>
				)}
			</Modal>
		</>
	);
};
