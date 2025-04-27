import { TextInput } from "@mantine/core";
import { FC } from "react";
import { useUncontrolled } from "@mantine/hooks";
import { MapModalButton } from "../map-modal-button";

export const LocationSelectorField: FC<{
	onChange?: (newState: string) => void;
	value?: string;
	shelvesToHighlight?: string[];
	error?: string | null;
}> = ({ value, onChange, error, shelvesToHighlight }) => {
	const [selectedShelf, handleChange] = useUncontrolled({
		value,
		finalValue: "",
		onChange,
	});

	return (
		<TextInput
			label="Shelf Location"
			value={selectedShelf}
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
