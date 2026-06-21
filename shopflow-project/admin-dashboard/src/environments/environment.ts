// src/environments/environment.ts
//
// Angular doesn't use .env files like Node/React — it uses TypeScript
// "environment" files instead. Same idea: configuration that changes
// between development and production, swapped at build time.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',  // The API Gateway — our ONLY backend address
};
