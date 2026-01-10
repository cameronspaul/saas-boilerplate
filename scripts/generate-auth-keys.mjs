

// Helper not needed as we use top-level imports in the run function
import { generateKeyPairSync, createPublicKey } from 'crypto';

function run() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    const privateKeyEnv = privateKey.replace(/\n/g, '\\n');

    const keyObject = createPublicKey(publicKey);
    const jwk = keyObject.export({ format: 'jwk' });

    // Ensure we add the "use" and "kid" fields
    jwk.use = 'sig';
    jwk.alg = 'RS256';
    jwk.kid = Math.random().toString(36).substring(2, 15);

    const jwks = JSON.stringify({ keys: [jwk] });

    console.log(`JWT_PRIVATE_KEY="${privateKeyEnv}"`);
    console.log('\n\n\n')
    console.log(`JWKS='${jwks}'`);
    console.log('\n\n\n')
}

run();
