import type { FetchResponse } from '@/types/response';
import type { ApiKey, User } from '@/types/types';
import { type AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

export class AuthAPI extends RESTDataSource {
  override baseURL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000/';
  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers.authorization = this.token;
  }

  async createUser(email: string, password: string, username: string) {
    return await this.post<FetchResponse<User>>('/api/user/', {
      body: { email, password, username },
    });
  }

  async getCurrentUser() {
    return await this.get<FetchResponse<User>>('/api/user/');
  }

  async getUser(userId: string) {
    return await this.get<FetchResponse<User>>(`/api/user/${userId}`);
  }

  async updateUser(userId: string, name: string | undefined) {
    return await this.patch<FetchResponse<User>>(`/api/user/${userId}`, {
      body: { name },
    });
  }

  async deleteUser(userId: string, password: string) {
    return await this.delete<FetchResponse<null>>(`/api/user/${userId}`, {
      body: { password },
    });
  }

  async getAPIKeys() {
    return await this.get<FetchResponse<ApiKey[]>>('/api/api_key/');
  }

  async createAPIKey(name: string) {
    return await this.post<FetchResponse<ApiKey>>('/api/api_key/', {
      body: { name },
    });
  }

  async updateAPIKey(apiKeyId: string, name: string | undefined) {
    return await this.patch<FetchResponse<ApiKey>>(`/api/api_key/${apiKeyId}`, {
      body: { name },
    });
  }

  async revokeAPIKey(apiKeyId: string) {
    return await this.delete<FetchResponse<null>>(`/api/api_key/${apiKeyId}`);
  }

  async login(identity: string, password: string) {
    return await this.post<FetchResponse<string>>('/api/auth/login', {
      body: { identity, password },
    });
  }

  async loginWithAPIKey(apiKey: string) {
    return await this.post<FetchResponse<string>>('/api/auth/api_key', {
      body: { api_key: apiKey },
    });
  }
}
