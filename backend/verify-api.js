const http = require('http');

const API_URL = 'http://localhost:5000/api';

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING BACKEND API VERIFICATION TESTS ---');

  try {
    // Test 1: Check server responsiveness & tools retrieval
    console.log('\nTest 1: Fetching digital tools list (Public GET)...');
    const getToolsOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tools',
      method: 'GET'
    };
    const res1 = await makeRequest(getToolsOpts);
    if (res1.statusCode === 200 && res1.body.success) {
      console.log(`✅ Passed: Successfully fetched ${res1.body.tools.length} seeded tools.`);
    } else {
      console.error(`❌ Failed: Received status ${res1.statusCode}`, res1.body);
    }

    // Test 2: Check categories aggregation endpoint
    console.log('\nTest 2: Fetching categories aggregated count (Public GET)...');
    const getCatsOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/categories',
      method: 'GET'
    };
    const res2 = await makeRequest(getCatsOpts);
    if (res2.statusCode === 200 && res2.body.success) {
      console.log(`✅ Passed: Successfully fetched ${res2.body.categories.length} categories.`);
      console.log('Categories:', res2.body.categories.map(c => `${c.name} (${c.count} tools)`).join(', '));
    } else {
      console.error(`❌ Failed: Received status ${res2.statusCode}`, res2.body);
    }

    // Test 3: Check protected route blocking (POST without credentials)
    console.log('\nTest 3: Attempting to Add Tool without credentials (Protected POST)...');
    const postToolOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tools',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res3 = await makeRequest(postToolOpts, { toolName: 'Test Tool' });
    if (res3.statusCode === 401) {
      console.log('✅ Passed: Blocked unauthorized request with 401 Unauthorized.');
    } else {
      console.error(`❌ Failed: Expected 401 Unauthorized, but received status ${res3.statusCode}`);
    }

    // Test 4: Check protected route blocking (POST with incorrect credentials)
    console.log('\nTest 4: Attempting to Add Tool with incorrect credentials (Protected POST)...');
    const postToolOptsWrong = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tools',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-username': 'mshahzaib',
        'x-admin-password': 'wrongpassword'
      }
    };
    const res4 = await makeRequest(postToolOptsWrong, { toolName: 'Test Tool' });
    if (res4.statusCode === 401) {
      console.log('✅ Passed: Blocked request with incorrect credentials with 401 Unauthorized.');
    } else {
      console.error(`❌ Failed: Expected 401, but received status ${res4.statusCode}`);
    }

    // Test 5: Verify login validation endpoint
    console.log('\nTest 5: Verifying login endpoint with correct credentials (POST)...');
    const loginOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res5 = await makeRequest(loginOpts, { username: 'mshahzaib', password: 'pakistan123' });
    if (res5.statusCode === 200 && res5.body.success) {
      console.log('✅ Passed: Login successful for admin user mshahzaib.');
    } else {
      console.error(`❌ Failed: Login rejected with status ${res5.statusCode}`, res5.body);
    }

    console.log('\n--- ALL BACKEND API VERIFICATION TESTS COMPLETED ---');

  } catch (error) {
    console.error('System validation test error:', error);
  }
};

runTests();
