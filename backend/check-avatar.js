// Quick diagnostic to check avatar URLs
const https = require('https');
const http = require('http');

// REPLACE THIS with your user ID
const USER_ID = 'YOUR_USER_ID';

async function checkAvatar() {
  console.log('🔍 Checking avatar accessibility...\n');
  
  // Fetch user data
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/users/${USER_ID}`,
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const user = JSON.parse(data);
        console.log('👤 User:', user.name);
        console.log('📧 Email:', user.email);
        console.log('🖼️  Avatar URL:', user.avatar || '(no avatar set)');
        console.log('');
        
        if (user.avatar) {
          // Test if URL is accessible
          const avatarUrl = new URL(user.avatar);
          const protocol = avatarUrl.protocol === 'https:' ? https : http;
          
          console.log('🌐 Testing avatar accessibility...');
          const testReq = protocol.get(user.avatar, (testRes) => {
            console.log(`   Status: ${testRes.statusCode}`);
            console.log(`   Content-Type: ${testRes.headers['content-type']}`);
            console.log('');
            
            if (testRes.statusCode === 200) {
              console.log('✅ Avatar is publicly accessible!');
            } else if (testRes.statusCode === 403) {
              console.log('❌ Avatar is FORBIDDEN (bucket might be private)');
              console.log('');
              console.log('🔧 Solutions:');
              console.log('   1. Make your Backblaze B2 bucket public');
              console.log('   2. Re-upload your avatar after bucket is public');
            } else if (testRes.statusCode === 404) {
              console.log('❌ Avatar NOT FOUND');
              console.log('');
              console.log('🔧 Solution: Re-upload your avatar');
            } else {
              console.log('⚠️  Unexpected status code');
            }
            
            console.log('');
            console.log('📋 Avatar URL Analysis:');
            if (user.avatar.includes('supabase.co')) {
              console.log('   ⚠️  Using Supabase Storage (OLD)');
              console.log('   💡 Need to re-upload avatar to use new Backblaze B2 storage');
            } else if (user.avatar.includes('backblazeb2.com') || user.avatar.includes('dealclick-images')) {
              console.log('   ✅ Using Backblaze B2 (NEW)');
              console.log('   💡 Bucket should be set to PUBLIC');
            } else {
              console.log('   ❓ Unknown storage provider');
            }
          });
          
          testReq.on('error', (error) => {
            console.log('❌ Error testing avatar:', error.message);
          });
        } else {
          console.log('ℹ️  No avatar uploaded yet');
        }
      } catch (error) {
        console.error('❌ Error parsing response:', error.message);
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error fetching user:', error.message);
    console.log('');
    console.log('💡 Make sure backend is running: npm run start:dev');
  });

  req.end();
}

console.log('='.repeat(60));
console.log('🔍 Avatar Diagnostic Tool - DealClick');
console.log('='.repeat(60));
console.log('');

if (USER_ID === 'YOUR_USER_ID') {
  console.log('❌ Please edit this file and replace YOUR_USER_ID with your actual user ID');
  console.log('');
  console.log('To find your user ID:');
  console.log('  1. Look in your mobile app after logging in');
  console.log('  2. Or check the database directly');
  console.log('  3. Or use: curl http://localhost:3000/users/handle/YOUR_HANDLE');
  process.exit(1);
}

checkAvatar();

