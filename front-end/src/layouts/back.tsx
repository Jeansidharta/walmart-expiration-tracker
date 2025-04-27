import { FC } from "react";
import { Outlet, useNavigate } from "react-router";
import { Button, Space } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

export const BackLayout: FC = () => {
	const navigate = useNavigate();
	const back = () => navigate(-1);
	return (
		<>
			<Button variant="outline" mb="md" onClick={back}>
				<IconArrowLeft />
				<Space w={16} />
				Back
			</Button>
			<Outlet />
		</>
	);
};
