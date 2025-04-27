import { useEffectMemory } from "./use-effect-memory";

export function useUpdate<const D extends unknown[]>(
	fun: (dependencies: D) => void | (() => void),
	deps: D,
): void {
	useEffectMemory((deps) => {
		if (!deps) return;
		fun(deps);
	}, deps);
}
