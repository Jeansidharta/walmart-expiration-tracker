import { FC } from "react";
import { ImageProps, Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const ImageExpandable: FC<{} & ImageProps> = ({ w, h, ...props }) => {
	const [isModalOpen, { open, close }] = useDisclosure();
	return (
		<>
			<Image
				onClick={(e) => {
					e.stopPropagation();
					open();
				}}
				w={w}
				h={h}
				fit="contain"
				{...props}
			/>
			{isModalOpen && (
				<Modal onClose={close} opened>
					<Image {...props} />
				</Modal>
			)}
		</>
	);
};
