import { ComponentProps, FC, useState } from "react";
import { LoadingButton } from "../loading-button";
import { useClickOutside, useDisclosure, useTimeout } from "@mantine/hooks";
import { Popover } from "@mantine/core";

function useDuoTimeout(
	onFinish: () => void,
	firstTime: number,
	secondTime: number,
) {
	const [state, setState] = useState<number | null>(null);
	const { start: startSecondTimeout, clear: clearSecondTimeout } = useTimeout(
		onFinish,
		secondTime,
	);
	const { start: startFirstTimeout, clear: clearFirstTimeout } = useTimeout(
		() => {
			setState(1);
			startSecondTimeout();
		},
		firstTime,
	);
	return [
		state,
		{
			start: () => {
				setState(0);
				startFirstTimeout();
			},
			clear: () => {
				setState(null);
				clearFirstTimeout();
				clearSecondTimeout();
			},
		},
	] as const;
}

export const ButtonWithConfirmation: FC<
	{ onConfirm?: () => void } & ComponentProps<typeof LoadingButton>
> = ({ onConfirm = () => { }, ...props }) => {
	const [isInConfirmation, { open, close }] = useDisclosure(false);
	const [timeoutState, { start, clear }] = useDuoTimeout(close, 1000, 2000);

	const reset = () => {
		close();
		clear();
	};

	const ref = useClickOutside(reset);

	function handleTrash() {
		if (!isInConfirmation) {
			open();
			start();
		} else {
			onConfirm();
			reset();
		}
	}

	return (
		<Popover opened={isInConfirmation}>
			<Popover.Target>
				<LoadingButton
					ref={ref}
					disabled={props.disabled || timeoutState === 0}
					onClick={handleTrash}
					{...props}
				>
					{props.children}
				</LoadingButton>
			</Popover.Target>
			<Popover.Dropdown>Are you sure?</Popover.Dropdown>
		</Popover>
	);
};
