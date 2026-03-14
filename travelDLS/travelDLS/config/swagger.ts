const swaggerConfig = {
  uiEnabled: true,
  uiUrl: 'docs',
  specEnabled: true,
  specUrl: '/swagger',
  middleware: [],

  title: 'Travel Hook API',
  version: '1.0.0',
  description: 'Travel Hook API Documentation',

  // Organization and formatting
  tagIndex: 2,
  snakeCase: true,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',

  path: './',

  // Security and Authentication Configuration
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },

  authConfigs: {
    bearer: 'BearerAuth',
  },

  persistAuthorization: true, // Persists the token even if the page is reloaded
  showFullPath: false,
}

export default swaggerConfig
