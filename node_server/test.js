import http from 'http'

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',  // Adjust the path according to your Trino setup
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status code: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Error connecting to Trino server: ${e.message}`);
});

req.end();