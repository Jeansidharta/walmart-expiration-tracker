import { FC, ReactNode } from "react";
import { SWRConfig } from "swr";
import { BASE_URL } from "../constants";
import { ServerResponse } from "../models";

async function parseResponse<T = unknown>(res: Response) {
	const json: ServerResponse<T> = await res.json();
	if (res.ok) return json.data;
	else throw new Error(json.message);
}

export const SWRProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<SWRConfig
			value={{
				fetcher: (resource, init) =>
					fetch(`${BASE_URL}/${resource}`, init).then(parseResponse),
			}}
			children={children}
		/>
	);
};
