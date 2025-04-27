import { FC } from "react";
import { Outlet, useMatch, useNavigate } from "react-router";
import { AppShell, Flex, NavLink as NavLinkMantine } from "@mantine/core";

export const MainLayout: FC = () => {
	const isExpirations = Boolean(useMatch("/"));
	const isProducts = Boolean(useMatch("/product"));
	const navigate = useNavigate();
	return (
		<AppShell padding="md" header={{ height: 70 }}>
			<AppShell.Header p="sm">
				<Flex gap={8}>
					<NavLinkMantine
						onClick={(e) => {
							navigate("/");
							e.preventDefault();
						}}
						href="/"
						label="Expirations"
						w="max-content"
						active={isExpirations}
					/>
					<NavLinkMantine
						onClick={(e) => {
							navigate("/product");
							e.preventDefault();
						}}
						href="/product"
						label="Products"
						w="max-content"
						active={isProducts}
					/>
				</Flex>
			</AppShell.Header>
			<AppShell.Main maw={600} mx="auto">
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
};
