import { createRoot } from "react-dom/client";
import { Theme } from "./theme.tsx";
import "./index.css";
import "@mantine/notifications/styles.css";
import App from "./App.tsx";
import { SWRProvider } from "./api/swr.tsx";
import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")!).render(
	<SWRProvider>
		<Theme>
			<Notifications position="top-right" />
			<App />
		</Theme>
	</SWRProvider>,
);
