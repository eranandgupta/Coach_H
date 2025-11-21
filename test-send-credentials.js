// Test send credentials endpoint
async function testSendCredentials() {
  console.log('Testing send credentials endpoint...\n');

  // First, you need to be logged in as a coach to get a token
  console.log('Step 1: Login as coach to get auth token...');

  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'coach@example.com', // Replace with your coach email
      password: 'your-coach-password', // Replace with your coach password
    }),
  });

  if (!loginResponse.ok) {
    console.log('✗ Login failed. Please update coach email and password in the test script.');
    console.log('Response:', await loginResponse.text());
    return;
  }

  const loginData = await loginResponse.json();
  const token = loginData.token;
  console.log('✓ Logged in successfully\n');

  // Now test sending credentials
  console.log('Step 2: Send credentials to a client...');
  console.log('Enter a client ID to send credentials to:');

  const clientId = 1; // Replace with an actual client ID from your database

  try {
    const response = await fetch('http://localhost:3000/api/auth/send-credentials', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });

    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✓ Credentials sent successfully!');
      console.log('The client should receive an email with their new password.');
    } else {
      console.log('\n✗ Failed to send credentials');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
  }
}

console.log('=== Send Credentials Test ===\n');
console.log('NOTE: Update this script with:');
console.log('1. Your coach email and password (lines 11-12)');
console.log('2. A valid client ID (line 26)\n');
console.log('Make sure your dev server is running (npm run dev)\n');

testSendCredentials();
