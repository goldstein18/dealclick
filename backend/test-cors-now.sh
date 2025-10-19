#!/bin/bash

echo "🧪 Quick CORS Test for Backblaze B2"
echo "===================================="
echo ""

# Test with the bucket root
URL="https://f000.backblazeb2.com/file/dealclick-images/"

echo "Testing: $URL"
echo ""

# Get headers with CORS origin
RESPONSE=$(curl -I "$URL" -H "Origin: http://localhost:8081" 2>&1)

echo "📋 Response Headers:"
echo "$RESPONSE" | head -15
echo ""

# Check for CORS header
if echo "$RESPONSE" | grep -qi "access-control-allow-origin"; then
    echo "✅ CORS is CONFIGURED!"
    echo ""
    echo "Your images should load in the app."
    echo "If they're still not showing:"
    echo "  1. Clear app cache"
    echo "  2. Restart the app"
    echo "  3. Make sure avatar URL is correct"
else
    echo "❌ CORS is NOT CONFIGURED!"
    echo ""
    echo "This is why your avatar isn't showing."
    echo ""
    echo "🔧 FIX (takes 2 minutes):"
    echo ""
    echo "1. Go to: https://secure.backblaze.com/b2_buckets.htm"
    echo "2. Click on 'dealclick-images' bucket"
    echo "3. Scroll to 'Bucket Settings' or 'CORS Rules'"
    echo "4. Click 'Add a Rule' or 'Update CORS Rules'"
    echo "5. Paste this JSON:"
    echo ""
    echo "["
    echo "  {"
    echo "    \"corsRuleName\": \"allow-all-origins\","
    echo "    \"allowedOrigins\": [\"*\"],"
    echo "    \"allowedOperations\": ["
    echo "      \"b2_download_file_by_name\","
    echo "      \"b2_download_file_by_id\""
    echo "    ],"
    echo "    \"allowedHeaders\": [\"*\"],"
    echo "    \"exposeHeaders\": [],"
    echo "    \"maxAgeSeconds\": 3600"
    echo "  }"
    echo "]"
    echo ""
    echo "6. Save"
    echo "7. Run this script again to verify"
    echo ""
    echo "📚 Full guide: ./BACKBLAZE_CORS_FIX.md"
fi

echo ""

