import { RouterProvider, createBrowserRouter } from "react-router";
import { RegisterExpirationPage } from "./pages/register-expiration";
import { HomePage } from "./pages/home";
import { BASE_URL } from "./constants";
import { Expiration, Product, ServerResponse } from "./models";
import { MainLayout } from "./layouts/main";
import { BackLayout } from "./layouts/back";
import { ProductsPage } from "./pages/products";
import { InspectionPage } from "./pages/inspection";
import { ProductPage } from "./pages/product/_barcode";

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
						path: "/product/:product_barcode",
						Component: ProductPage,
					},
					{
						path: "/product",
						Component: ProductsPage,
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
				Component: InspectionPage,
				path: "/inspection",
			},
			{
				path: "/",
				Component: HomePage,
				loader: async ({ request }) => {
					const url = new URL(request.url);
					const items: ServerResponse<
						{ item: Expiration; product: Product }[]
					> = await fetch(`${BASE_URL}/item${url.search}`).then((r) =>
						r.json(),
					);
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
