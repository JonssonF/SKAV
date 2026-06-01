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
  Modal,
  Checkbox,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { notifications } from '@mantine/notifications';
import { getImageUrl } from '../../../utils/imageUrl';
import type { ProductResponse, ProductVariant } from '../../../types/product.types';

interface ProductCardProps {
  product: ProductResponse;
  onAddToCart?: (product: ProductResponse, variant: ProductVariant, quantity: number, isSigned: boolean) => void;
  disabled?: boolean;
}

export function ProductCard({ product, onAddToCart, disabled }: ProductCardProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [isSigned, setIsSigned] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sortedImages = [...product.images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });
  const primaryImage = sortedImages.find((i) => i.isPrimary) ?? sortedImages[0];
  const hasMultipleImages = sortedImages.length > 1;

  // Parsa attribut-definitioner
  const attributeDefinitions = product.attributeDefinitions.map((def) => ({
    ...def,
    options: JSON.parse(def.attributeValues) as string[],
  }));

  const hasAttributes = attributeDefinitions.length > 0;

  const findVariant = (): ProductVariant | null => {
    if (!hasAttributes) {
      return product.variants[0] ?? null;
    }
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
  const basePrice = selectedVariant?.priceOverride ?? product.price;
  const signingExtra = isSigned && product.isSignable ? (product.signingPrice ?? 0) : 0;
  const totalPrice = basePrice + signingExtra;
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
  const allSelected = !hasAttributes || Object.keys(selections).length === attributeDefinitions.length;

  const handleAddToCart = () => {
  if (!selectedVariant || !onAddToCart) return;

    if (quantity > selectedVariant.stockQuantity) {
      notifications.show({
        title: 'Inte tillräckligt i lager',
        message: `Bara ${selectedVariant.stockQuantity} kvar.`,
        color: 'yellow',
      });
      return;
    }

    onAddToCart(product, selectedVariant, quantity, isSigned);
    setQuantity(1);
    setIsSigned(false);
    notifications.show({
      title: 'Tillagd i varukorgen',
      message: `${product.title} har lagts till.`,
      color: 'green',
    });
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          {hasMultipleImages ? (
            <Carousel withIndicators>
              {sortedImages.map((img, index) => (
                <Carousel.Slide key={img.id}>
                  <Image
                    src={getImageUrl(img.imageUrl)}
                    height={200}
                    alt={`${product.title} - bild ${index + 1}`}
                    fallbackSrc="https://placehold.co/400x200?text=Ingen+bild"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(index)}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Image
              src={getImageUrl(primaryImage?.imageUrl)}
              height={200}
              alt={product.title}
              fallbackSrc="https://placehold.co/400x200?text=Ingen+bild"
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick(0)}
            />
          )}
        </Card.Section>

        <Stack gap="sm" mt="md">
          <Group justify="space-between">
            <Title order={4}>{product.title}</Title>
            <Badge variant="light" size="lg">{totalPrice} kr</Badge>
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

          {product.isSignable && (
            <Checkbox
              label={
                product.signingPrice
                  ? `Signerad (+${product.signingPrice} kr) Tusch är dyrt.`
                  : 'Signerad (gratis)'
              }
              checked={isSigned}
              onChange={(e) => setIsSigned(e.currentTarget.checked)}
            />
          )}

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
              disabled={disabled || !selectedVariant || !inStock}
              size="sm"
              style={{ flex: 1 }}
            >
              {disabled ? 'Shopen är pausad' : 'Lägg i varukorg'}
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Lightbox */}
      <Modal
        opened={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        size="xl"
        padding={0}
        withCloseButton={false}
      >
        {sortedImages.length > 1 ? (
          <Carousel withIndicators initialSlide={lightboxIndex}>
            {sortedImages.map((img, index) => (
              <Carousel.Slide key={img.id}>
                <Image
                  src={getImageUrl(img.imageUrl)}
                  alt={`${product.title} - bild ${index + 1}`}
                  fit="contain"
                  h="80vh"
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Image
            src={getImageUrl(primaryImage?.imageUrl)}
            alt={product.title}
            fit="contain"
            h="80vh"
            onClick={() => setLightboxOpen(false)}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Modal>
    </>
  );
}