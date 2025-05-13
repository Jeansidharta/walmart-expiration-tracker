import { FC, useMemo } from "react";
import { Item, Product } from "../../models";
import { getRegisterLocationOffset, getRegisterViewbox } from "./registers_viewbox";
import { useForm } from "@mantine/form";
import { formatExpirationDate } from "../../utils/format-date";
import { useCreateExpiration } from "../../api";
import { Badge, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { ImageExpandable } from "../../components/image-expandable";
import { productImageURL } from "../../utils/product-image-uri";
import { LoadingButton } from "../../components/loading-button";
import { DateInput } from "@mantine/dates";
import { Map } from "../../components/map";

export const ShowProductCard: FC<{
  product: Product;
  items: Item[];
  register: number;
  register_offset: number;
  onSubmit?: () => void;
}> = ({ product, items, register, register_offset, onSubmit = () => {} }) => {
  const location = getRegisterLocationOffset(register, register_offset);
  const itemsAtThisLocation = useMemo(
    () => items.filter((item) => item.location === location),
    [location, items],
  );

  const form = useForm<{ expirationDate: string }>({
    initialValues: { expirationDate: new Date().toISOString() },
    validate: {
      expirationDate: (v) =>
        new Date(v).getTime() <= Date.now()
          ? "The expiration date should be after the current date"
          : itemsAtThisLocation.find(
                (exp) =>
                  formatExpirationDate(new Date(exp.expires_at)) ===
                  formatExpirationDate(new Date(v)),
              )
            ? "This date has already been registered"
            : null,
    },
  });
  const { createExpiration, isLoading, error } = useCreateExpiration();

  async function handleSubmit({ expirationDate }: { expirationDate: string }) {
    await createExpiration({
      expires_at: new Date(expirationDate).getTime(),
      location,
      product_barcode: product.barcode,
    });
    onSubmit();
  }

  return (
    <Card withBorder w="max-content">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Flex>
            <ImageExpandable
              src={productImageURL(product.barcode)}
              fit="contain"
              w={200}
              h={200}
            />
            <Map
              height={200}
              preventScroll
              viewbox={getRegisterViewbox(register)}
              selectedShelf={location}
            />
          </Flex>
          {product.name && <Text>{product.name}</Text>}
          <Group
            mt={16}
            align="center"
            gap={4}
            style={{
              visibility: itemsAtThisLocation.length === 0 ? "hidden" : "unset",
              width: "100%",
            }}
          >
            <Text c="dimmed">Dates registered:</Text>
            {itemsAtThisLocation.map(({ expires_at }) => (
              <Badge color="gray" key={expires_at}>
                {formatExpirationDate(new Date(expires_at))}
              </Badge>
            ))}
          </Group>
          <DateInput
            label="Expiration Date"
            {...form.getInputProps("expirationDate")}
          />
          <LoadingButton
            isLoading={isLoading}
            error={error?.message}
            type="submit"
          >
            Create expiration
          </LoadingButton>
        </Stack>
      </form>
    </Card>
  );
};
