import type { APIKeyModel } from "@/types/api-key";

export type UserModel = {
  id: number;
  username: string;
  email: string;
  api_keys: APIKeyModel[];
};
