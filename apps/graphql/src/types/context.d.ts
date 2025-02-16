import type { AuthAPI } from "@/datasources/auth-api";

export type DataSourceContext = {
  dataSources: {
    authAPI: AuthAPI;
  };
};
