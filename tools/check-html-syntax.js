/* Verifikasi sintaks JS inline di file HTML */
const fs = require('fs');

const files = ['customer/subscriptions.html', 'customer/profile-tier.html', 'customer/points-topup.html'];
let allOk = true;

files.forEach(function (f) {
  try {
    const html = fs.readFileSync(f, 'utf8');
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let count = 0;
    while ((match = scriptRegex.exec(html)) !== null) {
      const code = match[1].trim();
      if (!code) continue;
      count++;
      new Function(code);
    }
    console.log('OK: ' + f + ' (' + count + ' blok script valid)');
  } catch (e) {
    allOk = false;
    console.log('FAIL: ' + f + ' — ' + e.message);
  }
});

console.log(allOk ? 'SEMUA HTML VALID' : 'ADA ERROR');
process.exit(allOk ? 0 : 1);