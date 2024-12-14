interface AppConfig {
  // App-wide settings
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  // API configurations
  api: {
    baseUrl: string;
    timeout: number;
  };
  // Feature flags
  features: {
    enableDebugMode: boolean;
  };
  // Date and time settings
  dateTime: {
    defaultTimezone: string;
    dateFormat: string;
  };
}

const config: AppConfig = {
  app: {
    name: 'DealClosers',
    version: '1.0.0',
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development',
  },
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000, // 30 seconds
  },
  features: {
    enableDebugMode: process.env.NODE_ENV === 'development',
  },
  dateTime: {
    defaultTimezone: 'America/Chicago',
    dateFormat: 'YYYY-MM-DD',
  },
};

export default config;
