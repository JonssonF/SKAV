import { useState } from 'react';
import {
  Modal,
  Title,
  Text,
  Stack,
  Group,
  TextInput,
  NumberInput,
  Select,
  Button,
  Table,
  Badge,
  ActionIcon,
  Divider,
  TagsInput,
  Loader,
  Image,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconUpload, IconPhoto, IconX, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useProduct } from '../hooks/useProducts';
import { productsApi } from '../../../api/products.api';
import { getImageUrl } from '../../../utils/imageUrl';
import type {
  ProductResponse,
  CreateProductAttributeDefinitionRequest,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
} from '../../../types/product.types';

interface ProductManageModalProps {
  product: ProductResponse | null;
  onClose: () => void;
  onCreateAttribute: (data: CreateProductAttributeDefinitionRequest) => void;
  onDeleteAttribute: (id: number) => void;
  onCreateVariant: (data: CreateProductVariantRequest) => void;
  onUpdateVariant: (id: number, data: UpdateProductVariantRequest) => void;
  onDeleteVariant: (id: number) => void;
  onImagesChanged?: () => void;
  attrLoading?: boolean;
  variantLoading?: boolean;
}

export function ProductManageModal({
  product: initialProduct,
  onClose,
  onCreateAttribute,
  onDeleteAttribute,
  onCreateVariant,
  onUpdateVariant,
  onDeleteVariant,
  onImagesChanged,
  attrLoading,
  variantLoading,
}: ProductManageModalProps) {
  const { data: product, isLoading, refetch } = useProduct(initialProduct?.id ?? 0);

  const [attrName, setAttrName] = useState('');
  const [attrValues, setAttrValues] = useState<string[]>([]);
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [variantStock, setVariantStock] = useState<number>(0);
  const [variantPriceOverride, setVariantPriceOverride] = useState<number | string>('');
  const [uploading, setUploading] = useState(false);

  const handleCreateAttribute = () => {
    if (!product || !attrName.trim() || attrValues.length === 0) return;
    onCreateAttribute({
      productId: product.id,
      name: attrName.trim(),
      attributeValues: JSON.stringify(attrValues),
      displayOrder: product.attributeDefinitions.length,
    });
    setAttrName('');
    setAttrValues([]);
  };

  const handleCreateVariant = () => {
    if (!product) return;
    const hasAttributes = product.attributeDefinitions.length > 0;
    if (hasAttributes && Object.keys(variantSelections).length !== product.attributeDefinitions.length) return;
    onCreateVariant({
      productId: product.id,
      attributes: hasAttributes ? JSON.stringify(variantSelections) : '{}',
      stockQuantity: variantStock,
      priceOverride: variantPriceOverride !== '' ? Number(variantPriceOverride) : undefined,
    });
    setVariantSelections({});
    setVariantStock(0);
    setVariantPriceOverride('');
  };

  const handleUpload = async (files: File[]) => {
    if (!product) return;
    setUploading(true);

    try {
      for (const file of files) {
        // 1. Ladda upp filen
        const uploadResult = await productsApi.uploadImage(file, 'products');
        if (uploadResult.error || !uploadResult.url) {
          notifications.show({
            title: 'Uppladdning misslyckades',
            message: uploadResult.error ?? 'Okänt fel',
            color: 'red',
          });
          continue;
        }

        // 2. Koppla bilden till produkten
        const isFirst = product.images.length === 0;
        await productsApi.createImage({
          productId: product.id,
          imageUrl: uploadResult.url,
          isPrimary: isFirst,
          displayOrder: product.images.length,
        });
      }

      notifications.show({
        title: 'Klart!',
        message: `${files.length} bild${files.length > 1 ? 'er' : ''} uppladdad${files.length > 1 ? 'e' : ''}.`,
        color: 'green',
      });

      refetch();
      onImagesChanged?.();
    } catch {
      notifications.show({
        title: 'Fel',
        message: 'Kunde inte ladda upp bilden.',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    if (!product) return;
    const image = product.images.find((i) => i.id === imageId);
    if (!image || image.isPrimary) return;

    try {
      await productsApi.updateImage(imageId, {
        imageUrl: image.imageUrl,
        isPrimary: true,
        displayOrder: image.displayOrder,
      });
      refetch();
      onImagesChanged?.();
    } catch {
      notifications.show({ title: 'Fel', message: 'Kunde inte sätta primärbild.', color: 'red' });
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await productsApi.deleteImage(imageId);
      refetch();
      onImagesChanged?.();
      notifications.show({ title: 'Borttagen', message: 'Bilden togs bort.', color: 'green' });
    } catch {
      notifications.show({ title: 'Fel', message: 'Kunde inte ta bort bilden.', color: 'red' });
    }
  };

  if (!initialProduct) return null;

  const attributeDefinitions = (product?.attributeDefinitions ?? []).map((def) => ({
    ...def,
    options: JSON.parse(def.attributeValues) as string[],
  }));

  const sortedImages = [...(product?.images ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <Modal opened={initialProduct !== null} onClose={onClose} title={`Hantera – ${initialProduct.title}`} size="xl">
      {isLoading || !product ? (
        <Group justify="center" py="xl"><Loader /></Group>
      ) : (
        <Stack gap="lg">

          {/* ── Bilder ────────────────────────────────────── */}
          <div>
            <Title order={4} mb="sm">Bilder</Title>
            <Text size="sm" c="dimmed" mb="md">
              Dra och släpp bilder eller klicka för att välja. Första bilden sätts som primär automatiskt.
            </Text>

            {sortedImages.length > 0 && (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} mb="md">
                {sortedImages.map((img) => (
                  <Box key={img.id} pos="relative">
                    <Image
                      src={getImageUrl(img.imageUrl)}
                      height={120}
                      radius="sm"
                      alt="Produktbild"
                    />
                    <Group
                      gap={4}
                      pos="absolute"
                      top={4}
                      right={4}
                    >
                      <ActionIcon
                        size="sm"
                        variant="filled"
                        color={img.isPrimary ? 'yellow' : 'gray'}
                        onClick={() => handleSetPrimary(img.id)}
                        title={img.isPrimary ? 'Primärbild' : 'Sätt som primärbild'}
                      >
                        {img.isPrimary ? <IconStarFilled size={14} /> : <IconStar size={14} />}
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="filled"
                        color="red"
                        onClick={() => handleDeleteImage(img.id)}
                        title="Ta bort bild"
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                    {img.isPrimary && (
                      <Badge
                        size="xs"
                        pos="absolute"
                        bottom={4}
                        left={4}
                        variant="filled"
                        color="yellow"
                      >
                        Primär
                      </Badge>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            )}

            <Dropzone
              onDrop={handleUpload}
              accept={IMAGE_MIME_TYPE}
              maxSize={10 * 1024 * 1024}
              loading={uploading}
            >
              <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={40} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={40} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={40} stroke={1.5} />
                </Dropzone.Idle>
                <div>
                  <Text size="sm" inline>
                    Dra bilder hit eller klicka för att välja
                  </Text>
                  <Text size="xs" c="dimmed" inline mt={4}>
                    JPG, PNG, GIF, WebP – max 10 MB
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </div>

          <Divider />

          {/* ── Attribut ──────────────────────────────────── */}
          <div>
            <Title order={4} mb="sm">Attribut</Title>
            <Text size="sm" c="dimmed" mb="md">
              Definiera vilka egenskaper produkten har (t.ex. Storlek, Färg).
            </Text>

            {attributeDefinitions.length > 0 && (
              <Stack gap="xs" mb="md">
                {attributeDefinitions.map((def) => (
                  <Group key={def.id} justify="space-between">
                    <Group gap="sm">
                      <Text size="sm" fw={500}>{def.name}:</Text>
                      {def.options.map((val) => (
                        <Badge key={val} variant="light" size="sm">{val}</Badge>
                      ))}
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => onDeleteAttribute(def.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}

            <Group gap="sm" align="flex-end">
              <TextInput
                label="Attributnamn"
                placeholder="T.ex. Storlek"
                value={attrName}
                onChange={(e) => setAttrName(e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <TagsInput
                label="Värden"
                placeholder="Skriv och tryck Enter"
                value={attrValues}
                onChange={setAttrValues}
                style={{ flex: 2 }}
              />
              <Button
                onClick={handleCreateAttribute}
                loading={attrLoading}
                disabled={!attrName.trim() || attrValues.length === 0}
              >
                Lägg till
              </Button>
            </Group>
          </div>

          <Divider />

          {/* ── Varianter ─────────────────────────────────── */}
          <div>
            <Title order={4} mb="sm">Varianter & Lager</Title>
            <Text size="sm" c="dimmed" mb="md">
              Skapa varianter med lagersaldo. Varje kombination av attribut är en egen variant.<br />Avvikande pris kan sättas per variant, annars används produktens ordinarie pris.
            </Text>

            {product.variants.length > 0 && (
              <Table striped mb="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Variant</Table.Th>
                    <Table.Th>Lager</Table.Th>
                    <Table.Th>Avvikande pris</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {product.variants.map((variant) => {
                    const attrs = JSON.parse(variant.attributes) as Record<string, string>;
                    const attrText = Object.entries(attrs)
                      .map(([key, val]) => `${key}: ${val}`)
                      .join(', ');

                    return (
                      <Table.Tr key={variant.id}>
                        <Table.Td>
                          <Text size="sm">{attrText || 'Standard'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            value={variant.stockQuantity}
                            onChange={(val) =>
                              onUpdateVariant(variant.id, {
                                attributes: variant.attributes,
                                priceOverride: variant.priceOverride,
                                stockQuantity: typeof val === 'number' ? val : 0,
                              })
                            }
                            min={0}
                            size="xs"
                            w={80}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {variant.priceOverride ? `${variant.priceOverride} kr` : '–'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => onDeleteVariant(variant.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}

            <Group gap="sm" align="flex-end" wrap="wrap">
              {attributeDefinitions.map((def) => (
                <Select
                  key={def.id}
                  label={def.name}
                  placeholder={`Välj ${def.name.toLowerCase()}`}
                  data={def.options}
                  value={variantSelections[def.name] ?? null}
                  onChange={(val) =>
                    setVariantSelections((prev) => ({
                      ...prev,
                      [def.name]: val ?? '',
                    }))
                  }
                  style={{ flex: 1, minWidth: 100 }}
                />
              ))}
              <NumberInput
                label="Antal i lager"
                value={variantStock}
                onChange={(val) => setVariantStock(typeof val === 'number' ? val : 0)}
                min={0}
                w={100}
              />
              <NumberInput
                label="Prisöverride (valfritt)"
                placeholder="–"
                value={variantPriceOverride}
                onChange={(val) => setVariantPriceOverride(val !== undefined ? Number(val) : '')}
                min={0}
                w={140}
              />
              <Button
                onClick={handleCreateVariant}
                loading={variantLoading}
              >
                Lägg till variant
              </Button>
            </Group>
          </div>
        </Stack>
      )}
    </Modal>
  );
}