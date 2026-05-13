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
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useProduct } from '../hooks/useProducts';
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
  attrLoading,
  variantLoading,
}: ProductManageModalProps) {
  // Hämta live-data istället för att använda state
  const { data: product, isLoading } = useProduct(initialProduct?.id ?? 0);

  // Attribut-formulär
  const [attrName, setAttrName] = useState('');
  const [attrValues, setAttrValues] = useState<string[]>([]);

  // Variant-formulär
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [variantStock, setVariantStock] = useState<number>(0);
  const [variantPriceOverride, setVariantPriceOverride] = useState<number | string>('');

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

  if (!initialProduct) return null;

  const attributeDefinitions = (product?.attributeDefinitions ?? []).map((def) => ({
    ...def,
    options: JSON.parse(def.attributeValues) as string[],
  }));

  return (
    <Modal opened={initialProduct !== null} onClose={onClose} title={`Hantera – ${initialProduct.title}`} size="xl">
      {isLoading || !product ? (
        <Group justify="center" py="xl"><Loader /></Group>
      ) : (
        <Stack gap="lg">

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
              Skapa varianter med lagersaldo. Varje kombination av attribut är en egen variant.
            </Text>

            {product.variants.length > 0 && (
              <Table striped mb="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Variant</Table.Th>
                    <Table.Th>Lager</Table.Th>
                    <Table.Th>Prisöverride</Table.Th>
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