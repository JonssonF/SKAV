import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from './useMembers';
import { getApiErrors, getApiMessage } from '../../../utils/getApiErrors';
import type { MemberResponse, CreateMemberRequest, UpdateMemberRequest } from '../../../types/member.types';

export function useAdminMembers() {
  const { data: members, isLoading, error } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string> | null>(null);

  // Edit modal state
  const [editMember, setEditMember] = useState<MemberResponse | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string> | null>(null);

  // --- Create ---
  const openCreate = () => {
    setCreateErrors(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateErrors(null);
  };

  const handleCreate = (data: CreateMemberRequest) => {
    setCreateErrors(null);
    createMember.mutate(data, {
      onSuccess: () => {
        closeCreate();
        notifications.show({
          title: 'Medlem tillagd',
          message: `${data.name} har lagts till.`,
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

  // --- Edit ---
  const openEdit = (member: MemberResponse) => {
    setEditErrors(null);
    setEditMember(member);
  };

  const closeEdit = () => {
    setEditMember(null);
    setEditErrors(null);
  };

  const handleUpdate = (data: UpdateMemberRequest) => {
    if (!editMember) return;
    setEditErrors(null);
    updateMember.mutate(
      { id: editMember.id, data },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({
            title: 'Medlem uppdaterad',
            message: `${data.name} har uppdaterats.`,
            color: 'green',
          });
        },
        onError: (err) => {
          const fieldErrors = getApiErrors(err);
          if (fieldErrors) {
            setEditErrors(fieldErrors);
          } else {
            notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
          }
        },
      }
    );
  };

  // --- Delete ---
  const handleDelete = (member: MemberResponse) => {
    if (!window.confirm(`Vill du ta bort "${member.name}"?`)) return;
    deleteMember.mutate(member.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Medlem borttagen',
          message: `${member.name} har tagits bort.`,
          color: 'green',
        });
      },
      onError: (err) => {
        notifications.show({ title: 'Något gick fel', message: getApiMessage(err), color: 'red' });
      },
    });
  };

  return {
    members: members ?? [],
    isLoading,
    error,

    createModal: {
      opened: createOpen,
      onClose: closeCreate,
      onSubmit: handleCreate,
      loading: createMember.isPending,
      errors: createErrors,
    },

    editModal: {
      member: editMember,
      onClose: closeEdit,
      onSubmit: handleUpdate,
      loading: updateMember.isPending,
      errors: editErrors,
    },

    openCreate,
    openEdit,
    handleDelete,
    deleteLoading: deleteMember.isPending,
  };
}