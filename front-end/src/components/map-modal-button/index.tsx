import { ActionIcon, Modal } from "@mantine/core";
import { IconMap } from "@tabler/icons-react";
import { FC } from "react";
import { Map } from "../map";
import { useDisclosure } from "@mantine/hooks";

export const MapModalButton: FC<{
	onChange?: (newState: string) => void;
	value?: string;
	shelvesToHighlight?: string[];
}> = ({ value, onChange = () => { }, shelvesToHighlight = [] }) => {
	const [isModalOpen, { open: openModal, close: closeModal }] =
		useDisclosure(false);

	return (
		<>
			<ActionIcon onClick={openModal}>
				<IconMap style={{ width: "60%", height: "60%" }} />
			</ActionIcon>

			{isModalOpen && (
				<Modal opened onClose={closeModal} size="100%">
					<Map
						shelvesToHighlight={shelvesToHighlight}
						selectedShelf={value}
						onChange={(e) => onChange(e ?? "")}
					/>
				</Modal>
			)}
		</>
	);
};
