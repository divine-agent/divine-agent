import type { AuthAPI } from '@/datasources/auth-api';
import type { DataParkAPI } from '@/datasources/datapark-api';

export type DataSourceContext = {
  dataSources: {
    authAPI: AuthAPI;
    dataparkAPI: DataParkAPI;
  };
};
