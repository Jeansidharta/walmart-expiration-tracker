import { useSearchParams } from "react-router";

export function useSearchParam(paramName: string, defaultValue?: string) {
	const [searchParams, setSearchParams] = useSearchParams();
	const param = searchParams.get(paramName) ?? defaultValue;
	return [
		param,
		(newValue: string) => {
			const newParams = new URLSearchParams(searchParams);
			newParams.set(paramName, newValue);
			setSearchParams(newParams);
		},
	] as const;
}
