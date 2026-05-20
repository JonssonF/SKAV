export interface MemberResponse {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  quote?: string;
  imageUrl?: string;
  displayOrder: number;
  userId?: number;
}

export interface CreateMemberRequest {
  name: string;
  role?: string;
  bio?: string;
  quote?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface CreateMemberResponse {
  id: number;
}

export interface UpdateMemberRequest {
  name: string;
  role?: string;
  bio?: string;
  quote?: string;
  imageUrl?: string;
  displayOrder: number;
}