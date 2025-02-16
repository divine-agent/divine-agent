import type { FetchResponse } from "@/types/response";
import type { APIKeyModel } from "@/types/api-key";
import type { UserModel } from "@/types/user";
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
    return await this.get<FetchResponse<UserModel>>(`/api/user/${userId}`);
  }

  async getAPIKeys() {
    return await this.get<FetchResponse<APIKeyModel[]>>("/api/api_key/");
  }

  async createAPIKey() {
    return await this.post<FetchResponse<APIKeyModel>>("/api/api_key/");
  }

  async revokeAPIKey(apiKeyId: string) {
    return await this.delete<FetchResponse<null>>(`/api/api_key/${apiKeyId}`);
  }

  async login(identity: string, password: string) {
    return await this.post<FetchResponse<string>>("/api/auth/login", {
      body: { identity, password },
    });
  }

  async loginWithAPIKey(apiKey: string) {
    return await this.post<FetchResponse<string>>("/api/auth/api_key", {
      body: { api_key: apiKey },
    });
  }
}
