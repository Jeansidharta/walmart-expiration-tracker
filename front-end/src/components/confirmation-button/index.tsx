import { FC, ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Flex, Modal, Stack, Title } from "@mantine/core";

export const ConfirmationButton: FC<{
	buttonComponent: ReactNode;
	modalMessage?: ReactNode;
	onConfirm?: () => void;
}> = ({ buttonComponent, modalMessage, onConfirm }) => {
	const [isModalOpen, { open, close }] = useDisclosure();
	return (
		<>
			<span onClick={open}>{buttonComponent}</span>
			{isModalOpen && (
				<Modal opened onClose={close}>
					<Modal.Title>
						<Title mb="md">Confirmation</Title>
					</Modal.Title>
					<Modal.Body>
						<Stack gap={16}>
							{modalMessage ?? "Are you sure you want to continue?"}
							<Flex direction="row-reverse" gap={16}>
								<Button variant="outline" onClick={close}>
									No
								</Button>
								<Button onClick={onConfirm}>Yes</Button>
							</Flex>
						</Stack>
					</Modal.Body>
				</Modal>
			)}
		</>
	);
};
