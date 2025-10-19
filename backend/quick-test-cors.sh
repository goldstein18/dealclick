#!/bin/bash
echo "⏳ Waiting 5 seconds for CORS changes to propagate..."
sleep 5
echo ""
echo "🧪 Testing CORS..."
echo ""

RESPONSE=$(curl -I "https://f000.backblazeb2.com/file/dealclick-images/" -H "Origin: http://localhost:8081" 2>&1)

if echo "$RESPONSE" | grep -qi "access-control-allow-origin"; then
    echo "✅ SUCCESS! CORS is now configured!"
    echo ""
    echo "🎉 Your avatars should now load in the app!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart your app (close and reopen)"
    echo "  2. Check your profile - avatar should appear"
    echo "  3. If using web, do a hard refresh (Cmd+Shift+R)"
else
    echo "❌ CORS not detected yet."
    echo ""
    echo "Wait a minute and run this again:"
    echo "  ./quick-test-cors.sh"
fi
echo ""
