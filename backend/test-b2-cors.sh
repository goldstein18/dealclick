#!/bin/bash

# 🧪 Test Backblaze B2 CORS Configuration
# This script tests if your bucket is properly configured for public access and CORS

echo "🧪 Testing Backblaze B2 Configuration"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test URL - replace with an actual image from your bucket
# You can find one by looking at your database or Backblaze dashboard
echo "💡 To test properly, we need an actual image URL from your bucket"
echo ""
echo "Option 1: Check your database for an existing avatar URL"
echo "Option 2: Upload a test image and get the URL"
echo ""
read -p "Enter a full image URL from your bucket (or press Enter to use a test path): " IMAGE_URL

if [ -z "$IMAGE_URL" ]; then
    # Use a test URL format
    BUCKET_NAME="dealclick-images"
    IMAGE_URL="https://f000.backblazeb2.com/file/${BUCKET_NAME}/medium/test.webp"
    echo ""
    echo "Using test URL: $IMAGE_URL"
    echo -e "${YELLOW}⚠️  This might 404 if the file doesn't exist, but we can still test CORS${NC}"
fi

echo ""
echo "======================================"
echo ""

# Test 1: Basic access
echo "📡 Test 1: Basic HTTP Access"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
echo "   HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "   ${GREEN}✅ File is accessible${NC}"
elif [ "$HTTP_CODE" -eq 404 ]; then
    echo -e "   ${YELLOW}⚠️  File not found (404) - but bucket might be public${NC}"
    echo "   💡 Try with an actual image URL that exists in your bucket"
elif [ "$HTTP_CODE" -eq 403 ]; then
    echo -e "   ${RED}❌ FORBIDDEN - Bucket is PRIVATE${NC}"
    echo "   🔧 Solution: Make bucket public in Backblaze dashboard"
    echo "      1. Go to https://secure.backblaze.com/b2_buckets.htm"
    echo "      2. Click your bucket"
    echo "      3. Set to 'Public'"
else
    echo -e "   ${YELLOW}⚠️  Unexpected status: $HTTP_CODE${NC}"
fi

echo ""

# Test 2: CORS headers
echo "📡 Test 2: CORS Headers"
CORS_HEADER=$(curl -s -I "$IMAGE_URL" -H "Origin: http://localhost:8081" | grep -i "access-control-allow-origin" || echo "")

if [ -n "$CORS_HEADER" ]; then
    echo -e "   ${GREEN}✅ CORS is configured${NC}"
    echo "   $CORS_HEADER"
else
    echo -e "   ${RED}❌ CORS is NOT configured${NC}"
    echo "   🔧 Solution: Add CORS rules to your bucket"
    echo "      See: BACKBLAZE_CORS_FIX.md"
fi

echo ""

# Test 3: Content type
echo "📡 Test 3: Content Type"
CONTENT_TYPE=$(curl -s -I "$IMAGE_URL" | grep -i "content-type" || echo "")

if [ -n "$CONTENT_TYPE" ]; then
    echo "   $CONTENT_TYPE"
    if [[ "$CONTENT_TYPE" == *"image"* ]]; then
        echo -e "   ${GREEN}✅ Correct image content type${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Not an image content type${NC}"
    fi
else
    echo -e "   ${RED}❌ No content type header${NC}"
fi

echo ""
echo "======================================"
echo "📊 Summary"
echo "======================================"
echo ""

# Overall assessment
if [ "$HTTP_CODE" -eq 200 ] && [ -n "$CORS_HEADER" ]; then
    echo -e "${GREEN}✅ Everything looks good!${NC}"
    echo "   - Bucket is public"
    echo "   - CORS is configured"
    echo "   - Images should load in your app"
    echo ""
    echo "🔍 If avatar still not showing:"
    echo "   1. Check if avatar URL is from Supabase (old storage)"
    echo "   2. Re-upload your avatar using the app"
    echo "   3. Clear app cache and restart"
elif [ "$HTTP_CODE" -eq 403 ]; then
    echo -e "${RED}❌ Bucket is PRIVATE${NC}"
    echo ""
    echo "🔧 Fix:"
    echo "   1. Go to https://secure.backblaze.com/b2_buckets.htm"
    echo "   2. Click on 'dealclick-images'"
    echo "   3. Change 'Bucket Type' to 'Public'"
    echo "   4. Run this script again"
elif [ -z "$CORS_HEADER" ]; then
    echo -e "${YELLOW}⚠️  CORS not configured${NC}"
    echo ""
    echo "🔧 Fix:"
    echo "   1. See BACKBLAZE_CORS_FIX.md"
    echo "   2. Add CORS rules to your bucket"
    echo "   3. Run this script again"
else
    echo -e "${YELLOW}⚠️  Partial configuration${NC}"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Make sure bucket is public"
    echo "   2. Configure CORS (see BACKBLAZE_CORS_FIX.md)"
    echo "   3. Test with an actual image URL from your bucket"
fi

echo ""
echo "📚 Documentation:"
echo "   - CORS Fix: ./BACKBLAZE_CORS_FIX.md"
echo "   - Full Setup: ./BACKBLAZE_B2_SETUP.md"
echo ""

