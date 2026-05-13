import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Image,
  Badge,
  Button,
  Select,
  Group,
  Stack,
  NumberInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { ProductResponse, ProductVariant } from '../../../types/product.types';

interface ProductCardProps {
  product: ProductResponse;
  onAddToCart: (product: ProductResponse, variant: ProductVariant, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);

  // Parsa attribut-definitioner
  const attributeDefinitions = product.attributeDefinitions.map((def) => ({
    ...def,
    options: JSON.parse(def.attributeValues) as string[],
  }));

  const hasAttributes = attributeDefinitions.length > 0;

  // Hitta matchande variant baserat på valda attribut
  const findVariant = (): ProductVariant | null => {
    if (!hasAttributes) {
      return product.variants[0] ?? null;
    }

    // Alla attribut måste vara valda
    if (Object.keys(selections).length !== attributeDefinitions.length) {
      return null;
    }

    return product.variants.find((variant) => {
      const variantAttrs = JSON.parse(variant.attributes) as Record<string, string>;
      return attributeDefinitions.every(
        (def) => variantAttrs[def.name] === selections[def.name]
      );
    }) ?? null;
  };

  const selectedVariant = findVariant();
  const price = selectedVariant?.priceOverride ?? product.price;
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
  const allSelected = !hasAttributes || Object.keys(selections).length === attributeDefinitions.length;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    if (quantity > selectedVariant.stockQuantity) {
      notifications.show({
        title: 'Inte tillräckligt i lager',
        message: `Bara ${selectedVariant.stockQuantity} kvar.`,
        color: 'yellow',
      });
      return;
    }

    onAddToCart(product, selectedVariant, quantity);
    setQuantity(1);
    notifications.show({
      title: 'Tillagd i varukorgen',
      message: `${product.title} har lagts till.`,
      color: 'green',
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={product.imageUrl}
          height={200}
          alt={product.title}
          fallbackSrc="https://placehold.co/400x200?text=Ingen+bild"
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between">
          <Title order={4}>{product.title}</Title>
          <Badge variant="light" size="lg">{price} kr</Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {product.description}
        </Text>

        {product.category && (
          <Badge variant="light" color="gray" size="sm">
            {product.category}
          </Badge>
        )}

        {attributeDefinitions.map((def) => (
          <Select
            key={def.id}
            label={def.name}
            placeholder={`Välj ${def.name.toLowerCase()}`}
            data={def.options}
            value={selections[def.name] ?? null}
            onChange={(val) =>
              setSelections((prev) => ({
                ...prev,
                [def.name]: val ?? '',
              }))
            }
            size="sm"
          />
        ))}

        {allSelected && selectedVariant && (
          <Text size="xs" c={inStock ? 'green' : 'red'}>
            {inStock
              ? `${selectedVariant.stockQuantity} i lager`
              : 'Slut i lager'}
          </Text>
        )}

        <Group gap="sm">
          <NumberInput
            value={quantity}
            onChange={(val) => setQuantity(typeof val === 'number' ? val : 1)}
            min={1}
            max={selectedVariant?.stockQuantity ?? 1}
            size="sm"
            w={80}
          />
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !inStock}
            size="sm"
            style={{ flex: 1 }}
          >
            Lägg i varukorg
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}