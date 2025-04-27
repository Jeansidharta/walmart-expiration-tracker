import { useEffect, useRef } from "react";

export function useEffectMemory<const D extends unknown[]>(
	fun: (dependencies: D | null) => void | (() => void),
	deps: D,
): void {
	const depsRef = useRef<D | null>(null);
	useEffect(() => {
		const oldDeps = depsRef.current;
		depsRef.current = deps;
		return fun(oldDeps);
	});
}
