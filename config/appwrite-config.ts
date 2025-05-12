// appwrite-config.ts
import { Client, Storage } from 'appwrite';

// Check if required environment variables are defined
if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not defined in environment variables');
}

if (!process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID) {
  throw new Error('NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID is not defined in environment variables');
}

// Initialize Appwrite client
const client = new Client();

// Appwrite configuration with type assertions
const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID as string,
};

// Initialize the client with the config
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize Storage service
const storage = new Storage(client);

// Export the initialized services and config
export { appwriteConfig, client, storage };