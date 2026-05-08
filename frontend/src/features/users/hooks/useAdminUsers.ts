import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useUsers, useCreateUser, useDeleteUser, useUpdateUserRole, useChangePassword } from './useUsers';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type { UserResponse, CreateUserRequest, UpdateUserRoleRequest, ChangePasswordRequest } from '../../../types/user.types';


export function useAdminUsers() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const changePassword = useChangePassword();

  // Change password modal state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string> | null>(null);

  // --- Change Password ---
  const openChangePassword = () => {
    setPasswordErrors(null);
    setPasswordOpen(true);
  };

  const closeChangePassword = () => {
    setPasswordOpen(false);
    setPasswordErrors(null);
  };

  const handleChangePassword = (data: ChangePasswordRequest) => {
    setPasswordErrors(null);
    changePassword.mutate(data, {
      onSuccess: () => {
        closeChangePassword();
        notifications.show({
          title: 'Lösenord bytt',
          message: 'Ditt lösenord har ändrats.',
          color: 'green',
        });
      },
      onError: (err) => {
        const fieldErrors = getApiErrors(err);
        if (fieldErrors) {
          setPasswordErrors(fieldErrors);
        } else {
          notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
        }
      },
    });
  };
  
  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // --- Create ---
  const openCreate = () => {
    setCreateErrors(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateErrors(null);
  };

  const handleCreate = (data: CreateUserRequest) => {
    setCreateErrors(null);
    createUser.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Användare skapad',
          message: `${data.email} har lagts till.`,
          color: 'green',
        });
      },
      onError: (err) => {
        const fieldErrors = getApiErrors(err);
        if (fieldErrors) {
          setCreateErrors(fieldErrors);
        } else {
          notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
        }
      },
    });
  };

  // --- Update Role ---
  const handleUpdateRole = (user: UserResponse, data: UpdateUserRoleRequest) => {
    updateRole.mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Roll uppdaterad',
            message: `${user.email} har fått ny roll.`,
            color: 'green',
          });
        },
        onError: (err) => {
          notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
        },
      }
    );
  };

  // --- Delete ---
  const handleDelete = (user: UserResponse) => {
    if (!window.confirm(`Vill du ta bort "${user.email}"?`)) return;
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Användare borttagen',
          message: `${user.email} har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  return {
    users: users ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createUser.isPending,
      errors: createErrors,
    },

    openCreate,
    handleUpdateRole,
    handleDelete,
    deleteLoading: deleteUser.isPending,
    roleLoading: updateRole.isPending,

    passwordModal: {
    opened: passwordOpen,
    onClose: closeChangePassword,
    onSubmit: handleChangePassword,
    loading: changePassword.isPending,
    errors: passwordErrors,
  },

  openChangePassword,
  };
};
