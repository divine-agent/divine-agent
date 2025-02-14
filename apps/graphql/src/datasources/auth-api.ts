import type { FetchResponse, User } from "../models";
import { RESTDataSource } from "@apollo/datasource-rest";

export class AuthAPI extends RESTDataSource {
  override baseURL = "http://localhost:3000/";
  private token: string | null = null;

  async getUser(userId: string) {
    return (await this.get<FetchResponse<User>>(`/api/user/${userId}`)).data;
  }
}
