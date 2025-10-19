#!/bin/bash
echo "🎯 Final CORS Test - After clicking 'Update CORS Rules'"
echo "======================================================"
echo ""
echo "⏳ Waiting 90 seconds for CORS to propagate..."
echo "(Backblaze says changes take ~1 minute)"
echo ""

sleep 90

echo "🧪 Testing CORS now..."
echo ""

RESPONSE=$(curl -I "https://f000.backblazeb2.com/file/dealclick-images/" -H "Origin: http://localhost:8081" 2>&1)

echo "📋 Response headers:"
echo "$RESPONSE" | head -10
echo ""

if echo "$RESPONSE" | grep -qi "access-control-allow-origin"; then
    echo "🎉 SUCCESS! CORS is working!"
    echo ""
    CORS_VALUE=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
    echo "   ✅ $CORS_VALUE"
    echo ""
    echo "🚀 Your avatars will now load in the app!"
    echo ""
    echo "Next steps:"
    echo "  1. Close your React Native app completely"
    echo "  2. Reopen the app"
    echo "  3. Go to your profile"
    echo "  4. Your avatar should now appear!"
    echo ""
    echo "🎊 Problem solved!"
else
    echo "❌ CORS still not detected."
    echo ""
    echo "🔍 Let's debug:"
    echo "  1. Make sure you clicked 'Update CORS Rules'"
    echo "  2. Wait another 2-3 minutes"
    echo "  3. Run: ./final-cors-test.sh"
    echo ""
    echo "💡 Or try a different approach:"
    echo "   - Re-upload your avatar in the app"
    echo "   - New uploads will have CORS headers"
fi
echo ""
