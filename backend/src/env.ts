import dotenv from 'dotenv';

dotenv.config();

const assertEnvString = (name: string) => {
  const value = process.env[name];

  if (typeof value !== 'string')
    throw new Error('Missing string value process.env.' + name);

  return value;
};

const assertEnvInteger = (name: string) => {
  try {
    const value = parseInt(process.env[name]!);

    return value;
  } catch (err) {
    throw new Error('Missing integer value process.env.' + name);
  }
};

export const env = {
  port: assertEnvInteger('PORT'),
  publicUrl: assertEnvString('PUBLIC_SERVICE_URL'),
  openai: {
    apiKey: assertEnvString('OPENAI_API_KEY'),
  },
  luma: {
    sessionToken: assertEnvString('LUMA_SESSION_TOKEN'),
  },
  linkedin: {
    sessionToken: assertEnvString('LINKEDIN_SESSION_TOKEN'),
    csrfToken: assertEnvString('LINKEDIN_CSRF_TOKEN'),
  },
};
