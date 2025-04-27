import { FC } from "react";
import { Flex, NumberInput } from "@mantine/core";
import { OpenCameraIcon } from "./open-camera-icon";
import { OpenProductsListIcon } from "./open-products-list-icon";
import { useUncontrolled } from "@mantine/hooks";

export const SelectProduct: FC<{
	onChange?: (upc: string | null) => void;
	value?: string;
	error?: string | null;
}> = ({ onChange = () => { }, value, error }) => {
	const [upc, handleChange] = useUncontrolled({
		value,
		finalValue: "",
		onChange: (upc) => {
			const importantUpcPart = upc.length >= 11 ? upc.substring(0, 11) : null;
			if (importantUpcPart) onChange(importantUpcPart);
			else onChange(null);
		},
	});

	return (
		<NumberInput
			error={error}
			value={upc ?? undefined}
			maxLength={11}
			onChange={(e) => handleChange(e.toString())}
			label="Product UPC"
			rightSection={
				<Flex gap="md" right={8} pos="absolute">
					<OpenCameraIcon onSelect={handleChange} />
					<OpenProductsListIcon />
				</Flex>
			}
		/>
	);
};
