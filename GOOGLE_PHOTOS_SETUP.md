# Google Photos Uploader Setup Guide

## Overview
The admin page now includes a Google Photos uploader button that allows you to import photos directly from your Google Photos library.

## Setup Instructions

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 2. Enable Required APIs
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable:
   - **Google Photos Library API**
   - **Google Picker API**

### 3. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:8080/admin` (for local development)
   - `https://your-domain.com/admin` (for production)
5. Copy the **Client ID**

### 4. Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the **API Key**
4. (Optional) Restrict the API key to only allow the Google Photos Library API and Google Picker API

### 5. Configure Environment Variables
Add the following to your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 6. Handle OAuth Callback
Add this script to your admin page HTML or handle it in your React component to capture the OAuth token:

```javascript
// Add this to your index.html or a separate script
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GOOGLE_AUTH_TOKEN') {
    sessionStorage.setItem('google_oauth_token', event.data.token);
    window.close();
  }
});
```

## Usage
1. Log in to the admin page
2. Navigate to any media slot (hero, gallery, about, etc.)
3. Click the 📷 camera button next to "Upload File"
4. Authorize Google access if prompted
5. Select photos from your Google Photos library
6. The selected photo will be downloaded and uploaded to your Supabase storage

## Security Notes
- Keep your Client ID and API Key secure
- Never commit these credentials to version control
- Use environment variables to store sensitive data
- Consider restricting your API key to specific domains

## Troubleshooting

### "Failed to open Google Photos picker"
- Ensure both APIs are enabled in Google Cloud Console
- Verify your Client ID and API Key are correct
- Check that your redirect URI matches exactly

### "Authentication cancelled"
- Make sure your redirect URI is correctly configured
- Check browser popup blockers
- Ensure cookies are enabled

### CORS Errors
- Google Photos thumbnails may have CORS restrictions
- The current implementation downloads the image server-side through Supabase
