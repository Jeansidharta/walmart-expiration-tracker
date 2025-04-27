import { ActionIcon, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { FC, Ref, useRef } from "react";
import Webcam from "react-webcam";
import { IconCamera, IconReload } from "@tabler/icons-react";

const CAMERA_WIDTH = 300;
const CAMERA_HEIGHT = 300;

export const WebcamCapture: FC<{
	onChange: (screenshot: string | null) => void;
	value?: string;
	error?: null | string;
}> = ({ onChange, value = "", error }) => {
	const ref = useRef<Webcam>(null) as Ref<Webcam>;

	function handleRetake() {
		onChange(null);
	}

	function capture() {
		const newScreenshot = (
			ref as unknown as { current: { getScreenshot: () => string } }
		).current.getScreenshot();

		onChange(newScreenshot);
	}
	return (
		<Stack gap="xs" style={{ width: CAMERA_WIDTH, margin: "0 auto" }}>
			<Paper withBorder>
				<Group
					align="center"
					justify="center"
					style={{ width: CAMERA_WIDTH, height: CAMERA_HEIGHT }}
				>
					{value ? (
						<Image
							fit="contain"
							src={value}
							h={CAMERA_WIDTH}
							w={CAMERA_HEIGHT}
						/>
					) : (
						<Webcam
							height={CAMERA_HEIGHT}
							width={CAMERA_WIDTH}
							screenshotFormat="image/jpeg"
							ref={ref}
							videoConstraints={{
								facingMode: "environment",
							}}
						/>
					)}
				</Group>

				<div
					style={{
						position: "relative",
						marginLeft: "100%",
						right: "40px",
						bottom: 40,
					}}
				>
					<div style={{ position: "absolute" }}>
						{value ? (
							<ActionIcon size="lg" color="blue" onClick={handleRetake}>
								<IconReload />
							</ActionIcon>
						) : (
							<ActionIcon size="lg" onClick={capture}>
								<IconCamera />
							</ActionIcon>
						)}
					</div>
				</div>
			</Paper>
			{error && (
				<Text
					style={{
						color: "var(--mantine-color-error)",
						fontSize:
							"var(--input-error-size,calc(var(--mantine-font-size-sm) - .125rem*var(--mantine-scale)))",
					}}
					size="sm"
				>
					{error}
				</Text>
			)}
		</Stack>
	);
};
