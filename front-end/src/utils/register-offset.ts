const REGISTERS_VIEWBOX: Record<
	number,
	{ x: number; y: number; width: number; height: number; locations: string[] }
> = {
	1: {
		x: 1233.965,
		y: 1315.02,
		width: 61.681,
		height: 132.122,
		locations: [
			"Z2-1",
			"Z2-2",
			"Z2-3",
			"Z2-4",
			"Z3-1",
			"Z3-2",
			"Z3-3",
			"Z3-200",
		],
	},
	2: {
		x: 1295.103,
		y: 1308.374,
		width: 53.706,
		height: 81.839,
		locations: ["Z4-1", "Z4-2", "Z4-3", "Z5-1", "Z5-2", "Z5-3", "Z5-200"],
	},
	3: {
		x: 1348.266,
		y: 1307.488,
		width: 53.706,
		height: 84.497,
		locations: ["Z6-1", "Z6-2", "Z6-3", "Z7-1", "Z7-2", "Z7-3", "Z7-200"],
	},
	4: {
		x: 1401.208,
		y: 1313.912,
		width: 53.706,
		height: 75.858,
		locations: ["Z8-1", "Z8-2", "Z8-3", "Z9-1", "Z9-2", "Z9-3", "Z9-200"],
	},
	5: {
		x: 1454.371,
		y: 1313.247,
		width: 53.484,
		height: 76.523,
		locations: [
			"Z10-1",
			"Z10-2",
			"Z10-3",
			"Z11-1",
			"Z11-2",
			"Z11-3",
			"Z11-200",
		],
	},
	6: {
		x: 1507.534,
		y: 1313.025,
		width: 53.262,
		height: 76.523,
		locations: [
			"Z12-1",
			"Z12-2",
			"Z12-3",
			"Z13-1",
			"Z13-2",
			"Z13-3",
			"Z13-200",
		],
	},
	7: {
		x: 1560.254,
		y: 1313.247,
		width: 51.268,
		height: 76.523,
		locations: [
			"Z14-1",
			"Z14-2",
			"Z14-3",
			"Z15-1",
			"Z15-2",
			"Z15-3",
			"Z15-200",
		],
	},
	8: {
		x: 1610.981,
		y: 1313.025,
		width: 51.49,
		height: 76.523,
		locations: [
			"Z16-1",
			"Z16-2",
			"Z16-3",
			"Z17-1",
			"Z17-2",
			"Z17-3",
			"Z17-200",
		],
	},
	9: {
		x: 1661.043,
		y: 1313.247,
		width: 51.49,
		height: 76.523,
		locations: [
			"Z18-1",
			"Z18-2",
			"Z18-3",
			"Z19-1",
			"Z19-2",
			"Z19-3",
			"Z19-200",
		],
	},
	10: {
		x: 1711.327,
		y: 1313.69,
		width: 50.825,
		height: 76.523,
		locations: [
			"Z20-1",
			"Z20-2",
			"Z20-3",
			"Z21-1",
			"Z21-2",
			"Z21-3",
			"Z21-200",
		],
	},
	11: {
		x: 1761.389,
		y: 1307.709,
		width: 68.104,
		height: 82.504,
		locations: [
			"Z22-1",
			"Z22-2",
			"Z22-3",
			"Z23-1",
			"Z23-2",
			"Z23-3",
			"Z23-200",
		],
	},
	12: {
		x: 1829.172,
		y: 1306.823,
		width: 62.345,
		height: 82.504,
		locations: [
			"Z24-1",
			"Z24-2",
			"Z24-3",
			"Z25-1",
			"Z25-2",
			"Z25-3",
			"Z25-200",
		],
	},
	13: {
		x: 1891.196,
		y: 1305.937,
		width: 113.071,
		height: 117.725,
		locations: [
			"Z26-1",
			"Z26-2",
			"Z26-3",
			"Z27-1",
			"Z27-2",
			"Z27-3",
			"Z27-4",
			"Z27-5",
			"Z27-6",
			"Z27-7",
			"Z27-8",
			"Z27-9",
			"Z27-10",
			"Z27-11",
			"Z27-12",
		],
	},
};

export function getRegisterViewbox(register: number) {
	return REGISTERS_VIEWBOX[register];
}

export function getRegisterLocationOffset(register: number, offset: number) {
	return REGISTERS_VIEWBOX[register].locations[offset!];
}

export function getRegisterOffsetFromLocation(location: string) {
	const register = Object.entries({
		Z2: 1,
		Z3: 1,

		Z4: 2,
		Z5: 2,

		Z6: 3,
		Z7: 3,

		Z8: 4,
		Z9: 4,

		Z10: 5,
		Z11: 5,

		Z12: 6,
		Z13: 6,

		Z14: 7,
		Z15: 7,

		Z16: 8,
		Z17: 8,

		Z18: 9,
		Z19: 9,

		Z20: 10,
		Z21: 10,

		Z22: 11,
		Z23: 11,

		Z24: 12,
		Z25: 12,

		Z26: 13,
		Z27: 13,
	}).find(([key]) => location.startsWith(key + "-"))?.[1];

	if (register === undefined) return null;

	const offset = REGISTERS_VIEWBOX[register].locations.findIndex(
		(val) => val === location,
	);

	if (offset === -1) return null;

	return [register, offset] as const;
}
