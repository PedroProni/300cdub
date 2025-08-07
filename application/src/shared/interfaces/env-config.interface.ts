interface IEnvConfig {
  getLabel(): string;
  getMongoUri(): string;
  getAuthToken(): string;
  getProdDomain(): string;
  getLocalDomain(): string;
}

export { IEnvConfig };
