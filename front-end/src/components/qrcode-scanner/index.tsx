import { Html5QrcodeCameraScanConfig, Html5Qrcode } from "html5-qrcode";
import { QrcodeSuccessCallback } from "html5-qrcode/esm/core";
import styles from "./styles.module.css";
import { FC, useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

export type CameraState = "DISABLED" | "PAUSED" | "RUNNING";
interface Props {
	onRead: QrcodeSuccessCallback;
	onError?: (message: string) => void;
}

export const QrcodeReader: FC<Props> = ({ onRead, onError }) => {
	useEffect(() => {
		const html5QrCode = new Html5Qrcode(qrcodeRegionId, false);
		const config: Html5QrcodeCameraScanConfig = {
			fps: 10,
			qrbox: (width, height) => ({ width, height }),
			aspectRatio: undefined,
			disableFlip: false,
		};

		html5QrCode
			.start({ facingMode: "environment" }, config, onRead, onError)
			.catch(() => {
				if (onError) onError("Failed to start camera");
			});

		return () => {
			if (html5QrCode.isScanning) html5QrCode.stop();
		};
	}, [onRead, onError]);

	return <div id={qrcodeRegionId} className={styles.panel} />;
};
