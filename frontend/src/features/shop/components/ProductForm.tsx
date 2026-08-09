import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Group,
  Switch,
  Combobox,
  InputBase,
  useCombobox,
} from '@mantine/core';
import type { ProductResponse } from '../../../types/product.types';
import { useProductCategories } from '../hooks/useProducts';

interface ProductFormProps {
  initialData?: ProductResponse;
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    category?: string;
    isSignable: boolean;
    signingPrice?: number;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

function CategoryCombobox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const { data: categories = [] } = useProductCategories();
  const [search, setSearch] = useState(value);

  // Håll sökfältet i synk om formuläret fylls i (t.ex. vid redigering)
  useEffect(() => {
    setSearch(value);
  }, [value]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const exactMatch = categories.some(
    (item) => item.toLowerCase() === search.toLowerCase().trim()
  );

  const filtered = categories.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          onChange(search.trim());
        } else {
          onChange(val);
          setSearch(val);
        }
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label="Kategori"
          placeholder="T.ex. Kläder, Musik, Övrigt"
          value={search}
          error={error}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onChange={(e) => {
            const val = e.currentTarget.value;
            setSearch(val);
            onChange(val);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
          {filtered.map((item) => (
            <Combobox.Option value={item} key={item}>
              {item}
            </Combobox.Option>
          ))}

          {!exactMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">
              + Skapa "{search.trim()}"
            </Combobox.Option>
          )}

          {filtered.length === 0 && search.trim().length === 0 && (
            <Combobox.Empty>Inga kategorier ännu</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export function ProductForm({ initialData, onSubmit, loading, errors }: ProductFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(0);
  const [category, setCategory] = useState('');
  const [isSignable, setIsSignable] = useState(false);
  const [signingPrice, setSigningPrice] = useState<number | string>('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setCategory(initialData.category ?? '');
      setIsSignable(initialData.isSignable);
      setSigningPrice(initialData.signingPrice ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      price: price !== '' ? Number(price) : 0,
      category: category || undefined,
      isSignable,
      signingPrice: isSignable && signingPrice !== '' ? Number(signingPrice) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Titel"
          placeholder="T.ex. SKAV T-shirt"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={errors?.title}
          required
        />

        <Textarea
          label="Beskrivning"
          placeholder="Beskriv produkten..."
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          error={errors?.description}
          minRows={3}
          required
        />

        <NumberInput
          label="Pris (kr)"
          placeholder="0"
          value={price}
          onChange={(val) => setPrice(Number(val))}
          error={errors?.price}
          min={0}
          required
        />

        <CategoryCombobox
          value={category}
          onChange={setCategory}
          error={errors?.category}
        />

        <Switch
          label="Kan signeras"
          checked={isSignable}
          onChange={(e) => setIsSignable(e.currentTarget.checked)}
        />

        {isSignable && (
          <NumberInput
            label="Signeringspris (kr)"
            description="Lämna tomt eller 0 för gratis signering"
            placeholder="0"
            value={signingPrice}
            onChange={(val) => setSigningPrice(val !== undefined ? Number(val) : '')}
            min={0}
          />
        )}

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Skapa produkt'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}