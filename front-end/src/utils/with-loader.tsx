import { Loader } from "@mantine/core";

export function withLoader<T>(
	isLoading: boolean,
	data: null | T | undefined,
	withData: (data: T) => React.ReactNode,
) {
	if (isLoading) return <Loader />;
	if (!data) return null;
	return withData(data);
}

export function withNoData<T>(
	data: null | T | undefined,
	withData: (data: T) => React.ReactNode,
) {
	if (!data) return <div>No Data!</div>;
	return withData(data);
}

export function withLoaderNoData<T>(
	isLoading: boolean,
	data: null | T | undefined,
	withData: (data: T) => React.ReactNode,
) {
	if (isLoading) return <Loader />;
	if (!data) return <div>No Data!</div>;
	return withData(data);
}
