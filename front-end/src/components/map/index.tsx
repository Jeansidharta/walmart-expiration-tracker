import { FC, useEffect, useRef } from "react";
import PlantSvg from "../../assets/plant.svg?raw";

import style from "./styles.module.css";
import { useUncontrolled } from "@mantine/hooks";

export type Point = { x: number; y: number };
export type BoundingBox = { topLeft: Point; bottomRight: Point };
export type Dot = Point & {
	radius?: number;
	color?: string;
};

// Look for the shelf position that was clicked
function findLabel(elem: HTMLElement): string | null {
	let node: HTMLElement | null = elem;
	while (node && node.nodeName !== "svg") {
		const attr = node.getAttribute("inkscape:label");
		if (attr?.match(/\w\d{1,2}/)) return attr;
		node = node.parentElement;
	}
	return null;
}

type Viewbox = { x: number; y: number; width: number; height: number };

const BASE_VIEWBOX: Viewbox = {
	x: 1219.169,
	y: 1291.454,
	width: 788.339,
	height: 168.92,
};

function viewboxToString({ x, y, width, height }: Viewbox) {
	return `${x} ${y} ${width} ${height}`;
}

export const Map: FC<{
	onChange?: (isle: string | null) => void;
	shelvesToHighlight?: string[];
	selectedShelf?: string | null;
	viewbox?: Viewbox;
	height?: number;
	preventScroll?: boolean;
}> = ({
	onChange,
	height = 500,
	selectedShelf,
	preventScroll = false,
	shelvesToHighlight = [],
	viewbox = BASE_VIEWBOX,
}) => {
		const rootRef = useRef<HTMLDivElement | null>(null);
		const [_selectedShelf, handleChange] = useUncontrolled({
			value: selectedShelf,
			finalValue: null,
			onChange,
		});

		function handleClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
			if (!handleChange) return;
			const label = findLabel(event.target as unknown as HTMLElement);
			if (label) {
				if (label === _selectedShelf) handleChange(null);
				else handleChange(label);
			}
		}

		const selector =
			_selectedShelf &&
			`[inkscape\\:label="${_selectedShelf}"] { fill: var(--color-primary) !important; }`;
		const highlight = `${shelvesToHighlight.map((shelf) => `[inkscape\\:label="${shelf}"] { fill: var(--color-secondary) !important; }`).join("\n")}`;

		useEffect(() => {
			const parentDiv = rootRef.current;
			if (!parentDiv) return;
			if (!_selectedShelf) return;

			const selectedElement = parentDiv.querySelector(
				`[inkscape\\:label="${_selectedShelf}"]`,
			);
			if (!selectedElement) return;
			selectedElement.scrollIntoView({ inline: "center" });
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<div
				style={
					preventScroll
						? {}
						: {
							width: "100%",
							overflowX: "auto",
						}
				}
				ref={rootRef}
			>
				<div style={{ width: "max-content" }}>
					<svg
						onClick={handleClick}
						viewBox={viewboxToString(viewbox)}
						width="100%"
						height={`${height}px`}
						className={style.map}
						dangerouslySetInnerHTML={{ __html: PlantSvg }}
					/>
					<style>
						.{style.map} {"{"}
						{highlight}
						{"\n"}
						{selector}
						{"}"}
					</style>
				</div>
			</div>
		);
	};
