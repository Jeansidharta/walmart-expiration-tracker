import { FC } from "react";
import { NavLink } from "react-router";
import {
	Button,
	Divider,
	Pagination,
	Stack,
	Switch,
	Title,
} from "@mantine/core";
import { ExpirationItem } from "../components/expiration-item";
import { useSearchParamWithDefault } from "../utils/use-search-param";
import { useGetExpirations } from "../api";

const PAGE_SIZE = 10;

export const HomePage: FC = () => {
	const [expired, setExpired] = useSearchParamWithDefault(
		"expired",
		(v) => v === "true",
		false,
	);
	const [page, setPage] = useSearchParamWithDefault("page", Number.parseInt, 1);
	const { withExpirations, mutate, data } = useGetExpirations(
		page,
		PAGE_SIZE,
		expired,
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
				onChange={(e) => setExpired(e.target.checked)}
				checked={expired}
			/>
			<Stack gap={8} align="center">
				{withExpirations(({ expirations }) =>
					expirations.map(({ expiration, product, location }) => (
						<ExpirationItem
							key={expiration.id}
							expiration={expiration}
							product={product}
							location={location}
							onDelete={mutate}
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
