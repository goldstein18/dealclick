#!/bin/bash
echo "🔄 Waiting for CORS to propagate..."
echo ""

for i in {1..6}; do
    echo "⏳ Attempt $i/6..."
    
    RESPONSE=$(curl -I "https://f000.backblazeb2.com/file/dealclick-images/" -H "Origin: http://localhost:8081" 2>&1)
    
    if echo "$RESPONSE" | grep -qi "access-control-allow-origin"; then
        echo ""
        echo "✅ SUCCESS! CORS is working!"
        echo ""
        CORS_VALUE=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
        echo "   $CORS_VALUE"
        echo ""
        echo "🎉 Your images will now load in the app!"
        echo ""
        echo "Next steps:"
        echo "  1. Completely close and restart your React Native app"
        echo "  2. Navigate to your profile"
        echo "  3. Your avatar should now appear!"
        echo ""
        exit 0
    fi
    
    if [ $i -lt 6 ]; then
        echo "   Not ready yet, waiting 10 seconds..."
        sleep 10
    fi
done

echo ""
echo "⚠️  CORS still not detected after 1 minute."
echo ""
echo "🔍 Please verify in Backblaze:"
echo "   1. Go to https://secure.backblaze.com/b2_buckets.htm"
echo "   2. Click on 'dealclick-images' bucket"
echo "   3. Look for CORS settings"
echo "   4. Make sure 'Share everything with every origin' is CHECKED/ENABLED"
echo "   5. Click SAVE if there's a save button"
echo ""
echo "💡 Then run this script again: ./wait-and-test.sh"
echo ""
