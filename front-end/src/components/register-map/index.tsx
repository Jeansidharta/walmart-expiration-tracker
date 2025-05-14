import { ComponentProps, FC } from "react";
import { Map } from "../map";
import {
	getRegisterLocationOffset,
	getRegisterViewbox,
} from "../../utils/register-offset";

export const RegisterMap: FC<
	{
		register: number;
		selectedOffset?: number;
		selectedShelf?: string;
	} & ComponentProps<typeof Map>
> = ({ register, selectedOffset, selectedShelf, ...props }) => {
	const location =
		selectedShelf || getRegisterLocationOffset(register, selectedOffset!);
	return (
		<Map
			viewbox={getRegisterViewbox(register)}
			selectedShelf={location}
			{...props}
		/>
	);
};
