import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Stack,
  Group,
} from '@mantine/core';

interface UserCreateFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    roles: number;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

const roleOptions = [
  { value: '4', label: 'Member' },
  { value: '2', label: 'Editor' },
  { value: '1', label: 'Admin' },
];

export function UserCreateForm({ onSubmit, loading, errors }: UserCreateFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roles, setRoles] = useState<string>('4');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password !== confirmPassword) {
      setPasswordError('Lösenorden matchar inte');
      return;
    }

    onSubmit({
      email,
      password,
      roles: Number(roles),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="E-post"
          placeholder="namn@example.se"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          error={errors?.email}
          required
        />

        <PasswordInput
          label="Lösenord"
          placeholder="Minst 8 tecken"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          error={errors?.password}
          required
        />

        <PasswordInput
          label="Bekräfta lösenord"
          placeholder="Upprepa lösenordet"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          error={passwordError ?? errors?.confirmNewPassword}
          required
        />

        <Select
          label="Roll"
          data={roleOptions}
          value={roles}
          onChange={(val) => setRoles(val ?? '4')}
          error={errors?.roles}
          required
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Skapa användare
          </Button>
        </Group>
      </Stack>
    </form>
  );
}