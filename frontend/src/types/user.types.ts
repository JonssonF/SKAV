export interface UserResponse {
  id: number;
  email: string;
  roles: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  roles: number;
}

export interface CreateUserResponse {
  email: string;
  roles: number;
}

export interface UpdateUserRoleRequest {
  roles: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const RoleLabels: Record<number, string> = {
  1: 'Admin',
  2: 'Editor',
  4: 'Member',
};

export function getRoleLabel(role: number): string {
  return RoleLabels[role] ?? 'Okänd';
}