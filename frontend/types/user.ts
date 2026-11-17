export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export type User = {
  user_id: string;
  name: string | null;
  email: string | null;
  photo: string | null;
  course: string | null;
  campus: string | null;
  role: UserRole;
  joined_at: string;
};

export type UserUpdate = Partial<
  Pick<User, "name" | "email" | "photo" | "course" | "campus">
>;

export type UserRoleUpdate = {
  role: UserRole;
};

export type UserLogin = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string; // JWT
};
