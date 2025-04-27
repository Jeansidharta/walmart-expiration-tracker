import { FC } from "react";
import { NavLink, useLoaderData, useSearchParams } from "react-router";
import { Item, Product } from "../models";
import { Button, Divider, Stack, Switch, Title } from "@mantine/core";
import { ExpirationItem } from "../components/expiration-item";

export const HomePage: FC = () => {
	const items = useLoaderData<{ item: Item; product: Product }[]>();
	const [searchParams, setSearchParams] = useSearchParams();
	const expired = searchParams.get("expired") === "true";

	return (
		<Stack>
			<Title>Registered expirations</Title>
			<NavLink to="/register-expiration" end>
				<Button>Register Expiration</Button>
			</NavLink>
			<Divider />
			<Switch
				label="Expired"
				onChange={(e) =>
					setSearchParams((prev) => {
						prev.set("expired", e.target.checked ? "true" : "false");
						return prev;
					})
				}
				checked={expired}
			/>
			<Stack gap={8}>
				{items.map(({ item, product }) => (
					<ExpirationItem
						key={item.id}
						expirationItem={item}
						product={product}
					/>
				))}
			</Stack>
		</Stack>
	);
};
