import { useSearchParams } from "react-router";

export function useSearchParam<T extends { toString: () => string }>(
	paramName: string,
	parseValue: (val: string) => T,
) {
	const [searchParams, setSearchParams] = useSearchParams();
	const maybeParam = searchParams.get(paramName);
	const param = maybeParam ? parseValue(maybeParam) : null;
	return [
		param,
		(newValue: T) => {
			const newParams = new URLSearchParams(searchParams);
			newParams.set(paramName, newValue.toString());
			setSearchParams(newParams);
		},
	] as const;
}

export function useSearchParamWithDefault<T extends { toString: () => string }>(
	paramName: string,
	parseValue: (val: string) => T,
	defaultValue: T,
) {
	const [val, setVal] = useSearchParam(paramName, parseValue);
	return [val ?? defaultValue, setVal] as const;
}
