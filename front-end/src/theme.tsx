import { MantineProvider, createTheme } from "@mantine/core";
import { FC, ReactNode } from "react";

const theme = createTheme({
	primaryColor: "pink",
	black: "background",
	shadows: {
		xs: "2px 2px 2px rgba(0, 0, 0, 0.4)",
		sm: "4px 4px 4px rgba(0, 0, 0, 0.4)",
		md: "8px 8px 8px rgba(0, 0, 0, 0.4)",
		lg: "12px 12px 12px rgba(0, 0, 0, 0.4)",
		xl: "16px 16px 16px rgba(0, 0, 0, 0.4)",
	},
	colors: {
		error: [
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
			"#d32f2f",
		],
		secondary: [
			"#deffff",
			"#caffff",
			"#99fcff",
			"#64faff",
			"#3df9ff",
			"#26f8ff",
			"#09f7ff",
			"#00dce3",
			"#00c4ca",
			"#00aab0",
		],
		pink: [
			"#ffe8ff",
			"#ffcffe",
			"#ff9bf9",
			"#ff64f5",
			"#fe38f1",
			"#fe1cef",
			"#ff09ef",
			"#e400d5",
			"#cb00be",
			"#b100a6",
		],
	},
});

export const Theme: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<MantineProvider theme={theme} defaultColorScheme="dark">
			{children}
		</MantineProvider>
	);
};
