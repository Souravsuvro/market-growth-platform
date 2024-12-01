const crypto = require('crypto');

function generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

function generateSecurePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    return password;
}

const secureValues = {
    POSTGRES_PASSWORD: generateSecurePassword(),
    SECRET_KEY: generateSecureKey(),
};

console.log('\nGenerated secure values for your .env file:\n');
console.log('# Database');
console.log(`POSTGRES_USER=postgres`);
console.log(`POSTGRES_PASSWORD=${secureValues.POSTGRES_PASSWORD}`);
console.log('\n# Authentication');
console.log(`SECRET_KEY=${secureValues.SECRET_KEY}`);
console.log('\n# OpenAI');
console.log('OPENAI_API_KEY=your_openai_api_key_here  # Get this from https://platform.openai.com/api-keys');
console.log('\n# Facebook OAuth');
console.log('FACEBOOK_CLIENT_ID=your_facebook_client_id  # Get this from Facebook Developer Console');
console.log('FACEBOOK_CLIENT_SECRET=your_facebook_client_secret  # Get this from Facebook Developer Console');
