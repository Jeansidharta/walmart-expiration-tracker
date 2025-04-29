import { FC } from "react";
import { useDisclosure, useUncontrolled } from "@mantine/hooks";
import { ActionIcon, Modal, TextInput } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { QrcodeReader } from "../qrcode-scanner";

const UPC_A_LEN = 11;
const UPC_E_LEN = 8;

export const SelectProduct: FC<{
	onChange?: (upc: string | null) => void;
	value?: string;
	error?: string | null;
	disabled?: boolean;
}> = ({ onChange = () => { }, value, error, disabled = false }) => {
	const [isModalOpen, { open, close }] = useDisclosure(false);
	const [upc, handleChange] = useUncontrolled({
		value,
		finalValue: "",
		defaultValue: "",
		onChange: (upc) => {
			if (upc.length == UPC_E_LEN || upc.length == UPC_A_LEN) onChange(upc);
			else onChange(null);
		},
	});

	return (
		<>
			<TextInput
				error={error}
				value={upc}
				inputMode="numeric"
				onChange={(e) => {
					const str = e.target.value;
					const onlyNumbers = str.replace(/\D/g, "");
					const withMaxLen =
						onlyNumbers.length > UPC_A_LEN
							? onlyNumbers.substring(0, 11)
							: onlyNumbers;
					handleChange(withMaxLen);
				}}
				disabled={disabled}
				label="Product UPC"
				rightSection={
					<ActionIcon onClick={open} variant="filled" aria-label="Settings">
						<IconCamera style={{ width: "70%", height: "70%" }} stroke={1.5} />
					</ActionIcon>
				}
			/>
			{isModalOpen && (
				<Modal opened onClose={close} title="Scan product barcode">
					<QrcodeReader
						onRead={(barcode) => {
			const upc = barcode.length > UPC_A_LEN ? barcode.substring(0, 11) : barcode;
							close();
							handleChange(upc);
						}}
					/>
				</Modal>
			)}
		</>
	);
};
