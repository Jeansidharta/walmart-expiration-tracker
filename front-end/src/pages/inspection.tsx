import { FC, useState } from "react";
import { NumberInput, Stack, Text } from "@mantine/core";
import { Map } from "../components/map";

const REGISTERS_VIEWBOX: Record<
	number,
	{ x: number; y: number; width: number; height: number }
> = {
	1: {
		x: 1233.965,
		y: 1315.02,
		width: 61.681,
		height: 132.122,
	},
	2: {
		x: 1295.103,
		y: 1308.374,
		width: 53.706,
		height: 81.839,
	},
	3: {
		x: 1348.266,
		y: 1307.488,
		width: 53.706,
		height: 84.497,
	},
	4: {
		x: 1401.208,
		y: 1313.912,
		width: 53.706,
		height: 75.858,
	},
	5: {
		x: 1454.371,
		y: 1313.247,
		width: 53.484,
		height: 76.523,
	},
	6: {
		x: 1507.534,
		y: 1313.025,
		width: 53.262,
		height: 76.523,
	},
	7: {
		x: 1560.254,
		y: 1313.247,
		width: 51.268,
		height: 76.523,
	},
	8: {
		x: 1610.981,
		y: 1313.025,
		width: 51.49,
		height: 76.523,
	},
	9: {
		x: 1661.043,
		y: 1313.247,
		width: 51.49,
		height: 76.523,
	},
	10: {
		x: 1711.327,
		y: 1313.69,
		width: 50.825,
		height: 76.523,
	},
	11: {
		x: 1761.389,
		y: 1307.709,
		width: 68.104,
		height: 82.504,
	},
	12: {
		x: 1829.172,
		y: 1306.823,
		width: 62.345,
		height: 82.504,
	},
	13: {
		x: 1891.196,
		y: 1305.937,
		width: 113.071,
		height: 117.725,
	},
};

export const InspectionPage: FC = () => {
	const [register, setRegister] = useState<number | null>(null);
	const [selectedShelf, setSelectedShelf] = useState<string | null>(null);

	return (
		<Stack>
			<NumberInput
				label="Register"
				w={200}
				max={13}
				min={1}
				value={register ?? 0}
				onChange={(v) => setRegister(Number(v))}
			/>
			{typeof register === "number" && (
				<>
					<Map
						viewbox={REGISTERS_VIEWBOX[register]}
						selectedShelf={selectedShelf}
						onChange={setSelectedShelf}
					/>
					<Text size="xl">{selectedShelf && `Shelf ${selectedShelf}`}</Text>
				</>
			)}
		</Stack>
	);
};
