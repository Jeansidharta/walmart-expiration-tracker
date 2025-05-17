import { TextInput } from "@mantine/core";
import { FC, ReactNode } from "react";
import { useUncontrolled } from "@mantine/hooks";
import { MapModalButton } from "../map-modal-button";

export const LocationSelectorField: FC<{
	onChange?: (newState: string) => void;
	value?: string;
	inputString?: string;
	shelvesToHighlight?: string[];
	error?: ReactNode | null;
}> = ({ value, onChange, error, shelvesToHighlight, inputString }) => {
	const [selectedShelf, handleChange] = useUncontrolled({
		value,
		finalValue: "",
		onChange,
	});

	return (
		<TextInput
			label="Shelf Location"
			value={inputString ?? selectedShelf}
			error={error}
			rightSection={
				<MapModalButton
					value={value}
					onChange={handleChange}
					shelvesToHighlight={shelvesToHighlight}
				/>
			}
		/>
	);
};
