#!/bin/bash
echo "🔍 Debugging CORS with different URLs..."
echo "========================================"
echo ""

# Test different possible URLs
URLS=(
    "https://f000.backblazeb2.com/file/dealclick-images/"
    "https://f000.backblazeb2.com/file/dealclick-images/medium/"
    "https://f000.backblazeb2.com/file/dealclick-images/thumbnail/"
    "https://f000.backblazeb2.com/file/dealclick-images/original/"
)

for URL in "${URLS[@]}"; do
    echo "Testing: $URL"
    
    RESPONSE=$(curl -I "$URL" -H "Origin: http://localhost:8081" 2>&1)
    
    if echo "$RESPONSE" | grep -qi "access-control-allow-origin"; then
        echo "✅ CORS FOUND!"
        CORS_VALUE=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
        echo "   $CORS_VALUE"
        echo ""
        echo "🎉 Your CORS is working!"
        echo "Your images should now load in the app."
        echo ""
        exit 0
    else
        HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP/" | cut -d' ' -f2)
        echo "   HTTP: $HTTP_CODE (no CORS)"
    fi
    echo ""
done

echo "❌ No CORS detected on any URL."
echo ""
echo "🤔 This could mean:"
echo "   1. CORS rules didn't save properly"
echo "   2. Need to wait longer (some CDNs take 5-10 minutes)"
echo "   3. Backblaze has a different CORS implementation"
echo ""
echo "💡 Let's try a different approach:"
echo "   1. Check if you can access an image directly in browser"
echo "   2. Re-upload your avatar (new uploads get CORS headers)"
echo ""
echo "🔍 To check if CORS is really working, try this:"
echo "   Open your browser and go to:"
echo "   https://f000.backblazeb2.com/file/dealclick-images/"
echo "   Then open Developer Tools (F12) and check the Console for CORS errors"
echo ""

