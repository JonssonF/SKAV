import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  Image,
  ActionIcon,
  Box,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { productsApi } from '../../../api/products.api';
import { getImageUrl } from '../../../utils/imageUrl';
import type { MemberResponse } from '../../../types/member.types';

interface MemberFormProps {
  initialData?: MemberResponse;
  onSubmit: (data: {
    name: string;
    role?: string;
    bio?: string;
    quote?: string;
    imageUrl?: string;
    displayOrder: number;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function MemberForm({ initialData, onSubmit, loading, errors }: MemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | string>(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role ?? '');
      setBio(initialData.bio ?? '');
      setQuote(initialData.quote ?? '');
      setImageUrl(initialData.imageUrl ?? '');
      setDisplayOrder(initialData.displayOrder);
    }
  }, [initialData]);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await productsApi.uploadImage(file, 'members');
      if (result.error || !result.url) {
        notifications.show({
          title: 'Uppladdning misslyckades',
          message: result.error ?? 'Okänt fel',
          color: 'red',
        });
        return;
      }
      setImageUrl(result.url);
      notifications.show({
        title: 'Bild uppladdad',
        message: 'Bilden har laddats upp.',
        color: 'green',
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      role: role || undefined,
      bio: bio || undefined,
      quote: quote || undefined,
      imageUrl: imageUrl || undefined,
      displayOrder: displayOrder !== '' ? Number(displayOrder) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Namn"
          placeholder="T.ex. Anna Svensson"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={errors?.name}
          required
        />

        <TextInput
          label="Roll"
          placeholder="T.ex. Basist, Gitarrist, Sångare"
          value={role}
          onChange={(e) => setRole(e.currentTarget.value)}
          error={errors?.role}
        />

        <Textarea
          label="Bio"
          placeholder="Berätta lite om dig själv..."
          value={bio}
          onChange={(e) => setBio(e.currentTarget.value)}
          error={errors?.bio}
          minRows={3}
          autosize
        />

        <TextInput
          label="Citat"
          placeholder="Valfritt citat"
          value={quote}
          onChange={(e) => setQuote(e.currentTarget.value)}
          error={errors?.quote}
        />

        <div>
          <Text size="sm" fw={500} mb={4}>Medlemsbild</Text>

          {imageUrl ? (
            <Box pos="relative" w={160}>
              <Image
                src={getImageUrl(imageUrl)}
                h={160}
                w={160}
                radius="sm"
                alt="Medlemsbild"
              />
              <ActionIcon
                pos="absolute"
                top={4}
                right={4}
                size="sm"
                variant="filled"
                color="red"
                onClick={() => setImageUrl('')}
                title="Ta bort bild"
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Box>
          ) : (
            <Dropzone
              onDrop={handleUpload}
              accept={IMAGE_MIME_TYPE}
              maxSize={10 * 1024 * 1024}
              maxFiles={1}
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
                    Dra en bild hit eller klicka för att välja
                  </Text>
                  <Text size="xs" c="dimmed" inline mt={4}>
                    JPG, PNG, GIF, WebP – max 10 MB
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
        </div>

        <NumberInput
          label="Visningsordning"
          placeholder="Lägre nummer visas först"
          value={displayOrder}
          onChange={(value) => setDisplayOrder(Number(value))}
          error={errors?.displayOrder}
          min={0}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialData ? 'Uppdatera' : 'Lägg till medlem'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}