import { FC } from "react";
import { LoadingButton } from "../../../components/loading-button";
import { Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getRegisterOffsetFromLocation } from "../../../utils/register-offset";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { LocationSelectorField } from "../../../components/location-selector-field";
import { useCreateProductLocation } from "../../../api";
import { notifications } from "@mantine/notifications";

export const AddLocation: FC<{
	productBarcode: string;
	onCreate: () => void;
}> = ({ productBarcode, onCreate }) => {
	const [opened, { open, close }] = useDisclosure(false);
	const { createProductLocation, isLoading, error } =
		useCreateProductLocation();

	const form = useForm<{ location: string }>({
		initialValues: { location: "" },
		validate: {
			location: (val) =>
				val
					? getRegisterOffsetFromLocation(val)
						? null
						: "This location does not belong to any register"
					: "You must provide a location",
		},
	});

	async function handleSubmit(values: { location: string }) {
		await createProductLocation(productBarcode, values.location);
		notifications.show({
			title: "Success!",
			message: "Permanent Register Location Created!",
			color: "green",
		});
		onCreate();
	}

	return (
		<>
			<LoadingButton w="100%" onClick={open}>
				Add Location
			</LoadingButton>
			<Modal opened={opened} onClose={close}>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap={16}>
						<LocationSelectorField {...form.getInputProps("location")} />
						<LoadingButton
							type="submit"
							isLoading={isLoading}
							error={error?.message}
							icon={<IconPlus style={{ width: 16, height: 16 }} />}
						>
							Add
						</LoadingButton>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
