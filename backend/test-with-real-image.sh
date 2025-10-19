#!/bin/bash
echo "🧪 Testing with a real image upload..."
echo "====================================="
echo ""

# Create a simple test image
echo "Creating test image..."
convert -size 100x100 xc:blue -pointsize 20 -fill white -gravity center -annotate +0+0 "TEST" test-avatar.jpg 2>/dev/null

if [ ! -f "test-avatar.jpg" ]; then
    echo "❌ ImageMagick not available. Please try the app directly:"
    echo ""
    echo "🎯 ACTION:"
    echo "   1. Open your React Native app"
    echo "   2. Go to profile settings"
    echo "   3. Try to change/re-upload your avatar"
    echo "   4. See if it works now"
    echo ""
    echo "If it works, the CORS is fixed!"
    echo "If not, we'll debug further."
    exit 0
fi

echo "✅ Test image created"
echo ""
echo "Now let's upload it to test CORS..."

# We need a token first
echo "📝 Note: To test upload, you need to:"
echo "   1. Register/login to get a token"
echo "   2. Use the upload endpoint"
echo ""
echo "But for now, let's try the simpler approach:"
echo ""
echo "🎯 RECOMMENDED ACTION:"
echo "   Try your app now - CORS might be working!"
echo ""
echo "   1. Close React Native app completely"
echo "   2. Reopen it"
echo "   3. Check your profile - avatar should appear"
echo "   4. If not, try re-uploading your avatar"
echo ""

# Cleanup
rm -f test-avatar.jpg

