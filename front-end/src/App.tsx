import { RouterProvider, createBrowserRouter } from "react-router";
import { RegisterExpirationPage } from "./pages/register-expiration";
import { HomePage } from "./pages/home";
import { BASE_URL } from "./constants";
import { Item, Product, ServerResponse } from "./models";
import { MainLayout } from "./layouts/main";
import { BackLayout } from "./layouts/back";
import { ProductsPage } from "./pages/products";

const router = createBrowserRouter([
	{
		Component: MainLayout,
		children: [
			{
				Component: BackLayout,
				children: [
					{ path: "/register-expiration", Component: RegisterExpirationPage },
				],
			},
			{
				path: "/",
				children: [
					{
						index: true,
						Component: HomePage,
					},
					{
						path: "product",
						Component: ProductsPage,
						loader: async () => {
							const items: ServerResponse<Product[]> = await fetch(
								`${BASE_URL}/product`,
							).then((r) => r.json());
							return items.data;
						},
					},
				],
			},
		],
	},
	{
		Component: MainLayout,
		children: [
			{ path: "/register-expiration", Component: RegisterExpirationPage },
			{
				path: "/",
				Component: HomePage,
				loader: async ({ request }) => {
					const url = new URL(request.url);
					const items: ServerResponse<{ item: Item; product: Product }[]> =
						await fetch(`${BASE_URL}/item${url.search}`).then((r) => r.json());
					return items.data;
				},
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
