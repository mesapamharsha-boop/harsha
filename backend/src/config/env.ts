import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look for .env files in multiple standard locations
const possibleEnvPaths = [
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
  path.resolve(__dirname, '..', '..', '..', '.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
// Also execute default dotenv config
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'leox_jwt_super_secret_production_key_2026',
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'harsha@leox').toLowerCase(),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'leoX@4536',
  MONGO_URI: process.env.MONGO_URI || '',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'leox',
  EMAIL_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST || '',
  EMAIL_PORT: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.SMTP_USER || process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || '',
  NOTIFICATION_EMAIL: process.env.CONTACT_EMAIL || process.env.NOTIFICATION_EMAIL || 'leoxshoots@gmail.com',
  SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || '',
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || process.env.NOTIFICATION_EMAIL || 'leoxshoots@gmail.com',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'Leox',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '983334811893568',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'Ju9D4qV5_3uQQ_evOxPeblLfkUU',
  WHATSAPP_BUSINESS_NUMBER: process.env.WHATSAPP_BUSINESS_NUMBER || '918374404536',
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_CLOUD_API_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
};
