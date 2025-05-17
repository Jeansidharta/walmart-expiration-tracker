import { FC } from "react";
import { LoadingButton } from "../../../components/loading-button";
import { Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getRegisterOffsetFromLocation } from "../../../utils/register-offset";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { LocationSelectorField } from "../../../components/location-selector-field";
import { useCreatePermanentRegisterLocation } from "../../../api";
import { notifications } from "@mantine/notifications";

export const AddPermanentRegisterButton: FC<{
	productBarcode: string;
	onCreate: () => void;
}> = ({ productBarcode, onCreate }) => {
	const [opened, { open, close }] = useDisclosure(false);
	const { createPermanentRegisterLocation, isLoading, error } =
		useCreatePermanentRegisterLocation();

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

	const regOffset = getRegisterOffsetFromLocation(form.values.location);

	async function handleSubmit(values: { location: string }) {
		const [register, offset] = getRegisterOffsetFromLocation(values.location)!;
		await createPermanentRegisterLocation({
			product_barcode: productBarcode,
			register,
			register_offset: offset,
		});
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
				Add Permanent Register
			</LoadingButton>
			<Modal opened={opened} onClose={close}>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap={16}>
						<LocationSelectorField
							inputString={
								form.values.location
									? regOffset
										? `Register: ${regOffset[0]}, Offset: ${regOffset[1]}`
										: "Invalid location: not assigned to register"
									: undefined
							}
							{...form.getInputProps("location")}
						/>
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
