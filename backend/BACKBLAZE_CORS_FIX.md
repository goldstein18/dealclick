# 🔧 Fix Backblaze B2 CORS for Avatar Display

## Problem
Your bucket is public, but avatars won't show because of CORS (Cross-Origin Resource Sharing) restrictions.

## Solution: Configure CORS on Backblaze B2

### Method 1: Via Backblaze Web UI (Easiest)

1. **Go to Backblaze Dashboard**
   - Visit: https://secure.backblaze.com/b2_buckets.htm
   - Click on your `dealclick-images` bucket

2. **Find Bucket Settings**
   - Scroll down to "Bucket Info"
   - Look for "CORS Rules"

3. **Add CORS Rule**
   - Click "Add a Rule" or "Update CORS Rules"
   - Add this JSON:

```json
[
  {
    "corsRuleName": "allow-all-origins",
    "allowedOrigins": [
      "*"
    ],
    "allowedOperations": [
      "b2_download_file_by_name",
      "b2_download_file_by_id"
    ],
    "allowedHeaders": [
      "*"
    ],
    "exposeHeaders": [
      "x-bz-content-sha1"
    ],
    "maxAgeSeconds": 3600
  }
]
```

4. **Save Changes**

### Method 2: Via Backblaze B2 CLI (Advanced)

```bash
# Install B2 CLI
pip install b2

# Authorize
b2 authorize-account <key_id> <application_key>

# Update CORS
b2 update-bucket dealclick-images allPublic \
  --cors-rules '[{"corsRuleName":"allow-all","allowedOrigins":["*"],"allowedOperations":["b2_download_file_by_name","b2_download_file_by_id"],"allowedHeaders":["*"],"exposeHeaders":[],"maxAgeSeconds":3600}]'
```

### For Production (More Secure)

Replace `"*"` in `allowedOrigins` with your actual domains:

```json
"allowedOrigins": [
  "http://localhost:19006",
  "http://localhost:8081",
  "exp://192.168.1.*:8081",
  "https://yourdomain.com",
  "https://www.yourdomain.com"
]
```

## Verify CORS is Working

```bash
# Test CORS headers
curl -I https://f000.backblazeb2.com/file/dealclick-images/medium/some-image.webp \
  -H "Origin: http://localhost:8081"

# Should see:
# Access-Control-Allow-Origin: *
```

## ✅ After Configuring CORS

1. **Test in your app**
   - Refresh your profile page
   - Avatar should now load

2. **If still not working:**
   - Clear app cache
   - Re-upload avatar
   - Check if using old Supabase URL (need to re-upload)

## 🆘 Still Having Issues?

Run the diagnostic:
```bash
cd backend
node check-avatar.js
```

(First edit `check-avatar.js` and replace `YOUR_USER_ID` with your actual user ID)

