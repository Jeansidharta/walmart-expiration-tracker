import { FC } from "react";
import { NavLink } from "react-router";
import { Item, Product } from "../models";
import { Button, Divider, Stack, Switch, Title } from "@mantine/core";
import { ExpirationItem } from "../components/expiration-item";
import useSWR from "swr";
import { withLoader } from "../utils/with-loader";
import { useSearchParam } from "../utils/use-search-param";

export const HomePage: FC = () => {
	const [expired, setExpired] = useSearchParam("expired", "false");
	const {
		data,
		isLoading: isLoadingItems,
		error: itemsError,
	} = useSWR<{ items: Item[]; products: Record<string, Product> }>(
		`item?expired=${expired}`,
	);

	return (
		<Stack>
			<Title>Registered expirations</Title>
			<NavLink to="/register-expiration" end>
				<Button>Register Expiration</Button>
			</NavLink>
			<Divider />
			<Switch
				label="Expired"
				onChange={(e) => setExpired(e.target.checked ? "true" : "false")}
				checked={expired === "true"}
			/>
			<Stack gap={8}>
				{withLoader(isLoadingItems, data, itemsError, ({ items, products }) =>
					items.map((item) => (
						<ExpirationItem
							key={item.id}
							expirationItem={item}
							product={products[item.product_barcode]}
						/>
					)),
				)}
			</Stack>
		</Stack>
	);
};
