import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema.graphql',
  generates: {
    './src/types/types.d.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: './context#DataSourceContext',
        mappers: {
          User: './user#UserModel',
          APIKey: './api-key#APIKeyModel',
        },
      },
    },
  },
};

export default config;
