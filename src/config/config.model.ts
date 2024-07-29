interface DatabaseConfiguration {
  HOST: string;
  USERNAME: string;
  PASSWORD: string;
  NAME: string;
  PORT: number;
}

export interface ApplicationConfiguration {
  PORT: number;
  DB: DatabaseConfiguration;
  JWT_SECRET: string;
}
