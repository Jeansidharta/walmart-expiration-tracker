import { FC } from "react";
import { NavLink } from "react-router";
import { Item, Product } from "../models";
import {
	Button,
	Divider,
	Pagination,
	Stack,
	Switch,
	Title,
} from "@mantine/core";
import { ExpirationItem } from "../components/expiration-item";
import useSWR from "swr";
import { withLoader } from "../utils/with-loader";
import { useSearchParamWithDefault } from "../utils/use-search-param";

const PAGE_SIZE = 10;

export const HomePage: FC = () => {
	const [expired, setExpired] = useSearchParamWithDefault(
		"expired",
		(v) => v === "true",
		false,
	);
	const [page, setPage] = useSearchParamWithDefault("page", Number.parseInt, 1);
	const {
		data,
		isLoading: isLoadingItems,
		error: itemsError,
	} = useSWR<{
		items: Item[];
		products: Record<string, Product>;
		total_items: number;
	}>(`item?expired=${expired}&page=${page - 1}&page_size=${PAGE_SIZE}`);

	return (
		<Stack>
			<Title>Registered expirations</Title>
			<NavLink to="/register-expiration" end>
				<Button>Register Expiration</Button>
			</NavLink>
			<Divider />
			<Switch
				label="Expired"
				onChange={(e) => setExpired(e.target.checked)}
				checked={expired}
			/>
			<Stack gap={8} align="center">
				{withLoader(isLoadingItems, data, itemsError, ({ items, products }) =>
					items.map((item) => (
						<ExpirationItem
							key={item.id}
							expirationItem={item}
							product={products[item.product_barcode]}
						/>
					)),
				)}
				<Pagination
					value={page}
					onChange={setPage}
					total={data ? Math.ceil(data.total_items / PAGE_SIZE) : 1}
				/>
			</Stack>
		</Stack>
	);
};
