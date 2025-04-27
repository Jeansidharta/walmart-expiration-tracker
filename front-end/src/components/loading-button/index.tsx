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
> = ({ isLoading = false, children, icon, error, ...props }) => {
	const currentIcon = isLoading ? <Loader /> : icon;
	return (
		<Input.Wrapper>
			<Button {...props}>
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
