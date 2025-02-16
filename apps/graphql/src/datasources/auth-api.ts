import type { APIKey, FetchResponse, User } from "../models";
import { RESTDataSource, type AugmentedRequest } from "@apollo/datasource-rest";
import type { KeyValueCache } from "@apollo/utils.keyvaluecache";

export class AuthAPI extends RESTDataSource {
  override baseURL = "http://localhost:3000/";
  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers.authorization = this.token;
  }

  async getUser(userId: string) {
    return await this.get<FetchResponse<User>>(`/api/user/${userId}`);
  }

  async getAPIKeys() {
    return await this.get<FetchResponse<APIKey[]>>("/api/api_key/");
  }

  async createAPIKey() {
    return await this.post<FetchResponse<APIKey>>("/api/api_key/");
  }
}
