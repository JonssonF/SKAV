import { useState } from 'react';
import { PasswordInput, Button, Stack, Group } from '@mantine/core';

interface ChangePasswordFormProps {
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => void;
  loading?: boolean;
  errors?: Record<string, string> | null;
}

export function ChangePasswordForm({ onSubmit, loading, errors }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMatchError(null);

    if (newPassword !== confirmNewPassword) {
      setMatchError('Lösenorden matchar inte');
      return;
    }

    onSubmit({ currentPassword, newPassword, confirmNewPassword });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <PasswordInput
          label="Nuvarande lösenord"
          placeholder="Ditt nuvarande lösenord"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.currentTarget.value)}
          error={errors?.currentPassword}
          required
        />

        <PasswordInput
          label="Nytt lösenord"
          placeholder="Minst 8 tecken"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
          error={errors?.newPassword}
          required
        />

        <PasswordInput
          label="Bekräfta nytt lösenord"
          placeholder="Upprepa nya lösenordet"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
          error={matchError ?? errors?.confirmNewPassword}
          required
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Byt lösenord
          </Button>
        </Group>
      </Stack>
    </form>
  );
}