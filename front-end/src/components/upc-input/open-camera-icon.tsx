import { FC, useCallback, useState } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { QrcodeReader } from "../qrcode-scanner";

export const OpenCameraIcon: FC<{
	onSelect?: (barcode: string) => void;
}> = ({ onSelect = () => { } }) => {
	const [isCameraOpen, setIsCameraOpen] = useState(false);

	const openCamera = useCallback(() => setIsCameraOpen(true), []);
	const closeCamera = useCallback(() => setIsCameraOpen(false), []);

	return (
		<>
			<ActionIcon onClick={openCamera} variant="filled" aria-label="Settings">
				<IconCamera style={{ width: "70%", height: "70%" }} stroke={1.5} />
			</ActionIcon>

			<Modal
				opened={isCameraOpen}
				onClose={closeCamera}
				title="Scan product barcode"
			>
				{isCameraOpen && (
					<QrcodeReader
						onRead={(barcode) => {
							closeCamera();
							onSelect(barcode);
						}}
					/>
				)}
			</Modal>
		</>
	);
};
