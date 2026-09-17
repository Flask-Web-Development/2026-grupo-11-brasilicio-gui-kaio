export enum UserRole {
  USER = "User",
  ADMIN = "Admin",
}

interface UserBase {
  username: string;
  email: string | null;
}

// UserCreate
export type UserCreate = UserBase & {
  password: string;
};

// UserUpdate (tudo opcional)
export type UserUpdate = Partial<Omit<UserBase, "role">> & {
  password?: string;
  role?: UserRole; // ver observação #5
};

// UserResponse
export type User = UserBase & {
  id: number;
  role: UserRole;
  created_at: string;
  updated_at: string | null;
};
