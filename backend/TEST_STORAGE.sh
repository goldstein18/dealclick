#!/bin/bash

# 🧪 Script de Testing para Storage Module
# DealClick - Backblaze B2 + Cloudflare CDN

echo "🚀 Testing DealClick Storage Module"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
API_URL="http://localhost:3000"

# Test 1: Health check
echo "📡 Test 1: Backend health check..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/auth/register")
if [ "$HEALTH" -eq 201 ] || [ "$HEALTH" -eq 400 ]; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running. Start with: npm run start:dev${NC}"
    exit 1
fi
echo ""

# Test 2: Register user
echo "👤 Test 2: Registering test user..."
TIMESTAMP=$(date +%s)
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test$TIMESTAMP@dealclick.com\",
    \"password\": \"Test123!\",
    \"name\": \"Test User $TIMESTAMP\"
  }")

TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to register user${NC}"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
else
    echo -e "${GREEN}✅ User registered successfully${NC}"
    echo "Token: ${TOKEN:0:20}..."
fi
echo ""

# Test 3: Upload single image
echo "📸 Test 3: Uploading test image..."
echo "Creating test image..."

# Create a simple test image using ImageMagick (if available)
if command -v convert &> /dev/null; then
    convert -size 800x600 xc:blue -pointsize 40 -fill white \
      -gravity center -annotate +0+0 "DealClick Test Image" test-image.jpg
    echo "Test image created: test-image.jpg"
else
    echo -e "${YELLOW}⚠️  ImageMagick not installed. Please provide a test image as 'test-image.jpg'${NC}"
    echo "You can:"
    echo "  1. Install ImageMagick: brew install imagemagick"
    echo "  2. Or manually place a test image as 'test-image.jpg'"
    echo ""
    read -p "Press Enter when test-image.jpg is ready..."
fi

if [ ! -f "test-image.jpg" ]; then
    echo -e "${RED}❌ test-image.jpg not found${NC}"
    exit 1
fi

UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/storage/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-image.jpg")

ORIGINAL_URL=$(echo "$UPLOAD_RESPONSE" | grep -o '"original":"[^"]*' | sed 's/"original":"//')

if [ -z "$ORIGINAL_URL" ]; then
    echo -e "${RED}❌ Failed to upload image${NC}"
    echo "Response: $UPLOAD_RESPONSE"
    
    # Check if it's an auth error
    if echo "$UPLOAD_RESPONSE" | grep -q "Unauthorized"; then
        echo -e "${YELLOW}💡 Tip: Make sure B2 credentials are set in .env${NC}"
    fi
    
    exit 1
else
    echo -e "${GREEN}✅ Image uploaded successfully!${NC}"
    echo ""
    echo "📦 URLs generated:"
    echo "  Original:  $(echo "$UPLOAD_RESPONSE" | grep -o '"original":"[^"]*' | sed 's/"original":"//')"
    echo "  Thumbnail: $(echo "$UPLOAD_RESPONSE" | grep -o '"thumbnail":"[^"]*' | sed 's/"thumbnail":"//')"
    echo "  Medium:    $(echo "$UPLOAD_RESPONSE" | grep -o '"medium":"[^"]*' | sed 's/"medium":"//')"
    echo "  Large:     $(echo "$UPLOAD_RESPONSE" | grep -o '"large":"[^"]*' | sed 's/"large":"//')"
fi
echo ""

# Test 4: Verify image accessibility
echo "🌐 Test 4: Verifying image accessibility..."
THUMBNAIL_URL=$(echo "$UPLOAD_RESPONSE" | grep -o '"thumbnail":"[^"]*' | sed 's/"thumbnail":"//')

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$THUMBNAIL_URL")

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Image is publicly accessible!${NC}"
    echo "HTTP Status: $HTTP_CODE"
else
    echo -e "${YELLOW}⚠️  Image returned HTTP $HTTP_CODE${NC}"
    if [ "$HTTP_CODE" -eq 404 ]; then
        echo "Possible causes:"
        echo "  - Bucket is private (should be Public)"
        echo "  - CDN URL is incorrect in .env"
        echo "  - Cloudflare DNS not propagated yet (wait 5-10 min)"
    fi
fi
echo ""

# Test 5: Upload multiple images
echo "📸📸 Test 5: Uploading multiple images..."

# Create 3 test images if ImageMagick is available
if command -v convert &> /dev/null; then
    for i in 1 2 3; do
        convert -size 800x600 xc:$([ $i -eq 1 ] && echo "red" || [ $i -eq 2 ] && echo "green" || echo "blue") \
          -pointsize 40 -fill white -gravity center -annotate +0+0 "Test Image $i" test-image-$i.jpg
    done
    
    MULTI_UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/storage/upload-multiple" \
      -H "Authorization: Bearer $TOKEN" \
      -F "files=@test-image-1.jpg" \
      -F "files=@test-image-2.jpg" \
      -F "files=@test-image-3.jpg")
    
    COUNT=$(echo "$MULTI_UPLOAD_RESPONSE" | grep -o '"original":"[^"]*' | wc -l)
    
    if [ "$COUNT" -eq 3 ]; then
        echo -e "${GREEN}✅ Successfully uploaded $COUNT images!${NC}"
    else
        echo -e "${YELLOW}⚠️  Expected 3 images, got $COUNT${NC}"
        echo "Response: $MULTI_UPLOAD_RESPONSE"
    fi
    
    # Cleanup test images
    rm -f test-image-1.jpg test-image-2.jpg test-image-3.jpg
else
    echo -e "${YELLOW}⚠️  Skipping multi-upload test (ImageMagick not installed)${NC}"
fi
echo ""

# Summary
echo "========================================"
echo "🎉 Testing Complete!"
echo "========================================"
echo ""
echo "📊 Results:"
echo "  ✅ Backend: Running"
echo "  ✅ Auth: Working"
echo "  ✅ Upload: Working"
echo "  ✅ B2 Storage: Connected"
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "  ✅ CDN: Working"
else
    echo "  ⚠️  CDN: Check configuration"
fi
echo ""
echo "🔗 Test image URLs generated above"
echo "   Open them in your browser to verify!"
echo ""
echo "💡 Next steps:"
echo "   1. Open the URLs in your browser"
echo "   2. Verify images load correctly"
echo "   3. Check Backblaze B2 dashboard for files"
echo "   4. Check Cloudflare analytics for CDN hits"
echo ""
echo "📚 For more info, see: BACKBLAZE_B2_SETUP.md"
echo ""

# Cleanup
rm -f test-image.jpg

exit 0

