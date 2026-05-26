import {
  Drawer,
  Stack,
  Group,
  Text,
  Title,
  Button,
  NumberInput,
  ActionIcon,
  Divider,
  Badge,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import type { CartItem } from '../hooks/useCart';

interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onUpdateQuantity: (variantId: number, isSigned: boolean, quantity: number) => void;
  onRemoveItem: (variantId: number, isSigned: boolean) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  opened,
  onClose,
  items,
  totalItems,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Title order={3}>Varukorg</Title>
          {totalItems > 0 && (
            <Badge size="lg">{totalItems}</Badge>
          )}
        </Group>
      }
      position="right"
      size="md"
    >
      {items.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Varukorgen är tom.
        </Text>
      ) : (
        <Stack gap="md">
          {items.map((item) => {
            const attrs = JSON.parse(item.variant.attributes) as Record<string, string>;
            const attrText = Object.entries(attrs)
              .map(([key, val]) => `${key}: ${val}`)
              .join(', ');
            const basePrice = item.variant.priceOverride ?? item.product.price;
            const signingExtra = item.isSigned ? (item.product.signingPrice ?? 0) : 0;
            const unitPrice = basePrice + signingExtra;

            return (
              <div key={`${item.variant.id}-${item.isSigned}`}>
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Text fw={600} size="sm">{item.product.title}</Text>
                    {attrText && (
                      <Text size="xs" c="dimmed">{attrText}</Text>
                    )}
                    {item.isSigned && (
                      <Badge size="xs" variant="light" color="violet" mt={2}>
                        Signerad
                      </Badge>
                    )}
                    <Text size="sm" fw={500} mt={4}>{unitPrice} kr/st</Text>
                  </div>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onRemoveItem(item.variant.id, item.isSigned)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                <Group gap="sm" mt="xs">
                  <NumberInput
                    value={item.quantity}
                    onChange={(val) =>
                      onUpdateQuantity(
                        item.variant.id,
                        item.isSigned,
                        typeof val === 'number' ? val : 1,
                      )
                    }
                    min={1}
                    max={item.variant.stockQuantity}
                    size="xs"
                    w={80}
                  />
                  <Text size="sm" c="dimmed">
                    = {unitPrice * item.quantity} kr
                  </Text>
                </Group>

                <Divider mt="md" />
              </div>
            );
          })}

          <Group justify="space-between">
            <Text fw={700}>Totalt</Text>
            <Text fw={700} size="lg">{totalPrice} kr</Text>
          </Group>

          <Button fullWidth size="md" onClick={onCheckout}>
            Gå till beställning
          </Button>
        </Stack>
      )}
    </Drawer>
  );
}