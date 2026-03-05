// Run: node audit.js
const fs = require('fs');

const SECRETS = ['STRIPE_SECRET_KEY', 'DATABASE_URL', 'SENDGRID_API_KEY', 'STRIPE_WEBHOOK_SECRET'];
const envPath = './server/.env';

console.log("🛡️ Starting SMGPUB Security Audit...");

// Check 1: Environment Variables
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    SECRETS.forEach(secret => {
        if (!envContent.includes(secret)) {
            console.error(`❌ MISSING: ${secret} in .env`);
        } else {
            console.log(`✅ FOUND: ${secret}`);
        }
    });
}

// Check 2: Git Leak Prevention
if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (!gitignore.includes('.env')) {
        console.error("⚠️ WARNING: .env is not in .gitignore! You risk leaking keys to GitHub.");
    } else {
        console.log("✅ .env is protected by .gitignore");
    }
}
