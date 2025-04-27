import { FC, useCallback, useState } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { IconList } from "@tabler/icons-react";
import { ProductList } from "../product-list";

export const OpenProductsListIcon: FC<{
	onSelect?: (barcode: string) => void;
}> = ({ onSelect = () => { } }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = useCallback(() => setIsModalOpen(true), []);
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	return (
		<>
			<ActionIcon onClick={openModal} variant="filled" aria-label="Settings">
				<IconList style={{ width: "70%", height: "70%" }} stroke={1.5} />
			</ActionIcon>

			<Modal opened={isModalOpen} onClose={closeModal} title="Select Product">
				{isModalOpen && <ProductList />}
			</Modal>
		</>
	);
};
