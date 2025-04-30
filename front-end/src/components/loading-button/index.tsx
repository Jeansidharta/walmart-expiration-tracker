import { ComponentProps, FC, ReactNode } from "react";
import { Button, ButtonProps, Input, Loader, Space } from "@mantine/core";

export const LoadingButton: FC<
	{
		isLoading?: boolean;
		error?: string;
		children: ReactNode;
		icon?: ReactNode;
	} & ButtonProps &
	ComponentProps<"button">
> = ({
	isLoading = false,
	children,
	icon,
	error,
	onClick = () => { },
	disabled,
	...props
}) => {
		const currentIcon = isLoading ? <Loader size={16} /> : icon;
		return (
			<Input.Wrapper>
				<Button
					{...props}
					onClick={(event) => !isLoading && onClick(event)}
					disabled={disabled || isLoading}
				>
					{children}
					{currentIcon && (
						<>
							<Space w={8} />
							{currentIcon}
						</>
					)}
				</Button>
				<Input.Error mt={4}>{error}</Input.Error>
			</Input.Wrapper>
		);
	};
