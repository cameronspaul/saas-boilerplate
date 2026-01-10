import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { resolve } from 'path';

const envFile = process.argv[2];
const isProd = process.argv.includes('--prod');
const isVercel = process.argv.includes('--vercel');

if (!envFile) {
    console.error('Usage: node push-convex-env.js <env-file> [--prod] [--vercel]');
    process.exit(1);
}

const getExistingVars = (isProd) => {
    try {
        const prodFlag = isProd ? '--prod' : '';
        // Increase maxBuffer for large lists
        const output = execSync(`npx convex env list ${prodFlag}`, {
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
            maxBuffer: 10 * 1024 * 1024
        });

        const vars = {};
        let currentKey = null;

        output.split(/\r?\n/).forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Use regex to ensure the line starts with a valid environment variable name
            // Convex requires names to begin with a letter and only include a-z, A-Z, 0-9, and underscores
            const match = trimmedLine.match(/^([a-zA-Z][a-zA-Z0-9_]*)=(.*)$/);
            if (match) {
                currentKey = match[1].trim();
                let value = match[2].trim();

                // Strip quotes if they exist in Convex output
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                vars[currentKey] = value;
            } else if (currentKey) {
                // If the line doesn't match the KV pattern, it's likely a continuation of the previous value
                vars[currentKey] += '\n' + trimmedLine;
            }
        });
        return vars;
    } catch (err) {
        console.error('⚠️ Could not fetch existing variables from Convex.');
        return {};
    }
};

const getExistingVercelVars = () => {
    const tempFile = `.env.vercel.sync.temp`;
    try {
        // Try to pull production env vars to a temp file for diffing
        execSync(`npx vercel env pull --environment=production ${tempFile}`, {
            stdio: ['ignore', 'ignore', 'ignore'],
            timeout: 30000
        });

        if (!existsSync(tempFile)) return null;

        const content = readFileSync(tempFile, 'utf-8');
        const vars = {};
        content.split(/\r?\n/).forEach(line => {
            const splitIndex = line.indexOf('=');
            if (splitIndex !== -1) {
                const key = line.substring(0, splitIndex).trim();
                let value = line.substring(splitIndex + 1).trim();
                // Remove surrounding quotes if they exist
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                vars[key] = value;
            }
        });
        unlinkSync(tempFile);
        return vars;
    } catch (err) {
        if (existsSync(tempFile)) unlinkSync(tempFile);
        return null;
    }
};

try {
    const content = readFileSync(resolve(process.cwd(), envFile), 'utf-8');
    const lines = content.split(/\r?\n/);

    const existingVars = getExistingVars(isProd);

    console.log(`🚀 Syncing to Convex ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} from ${envFile}...`);

    let changeCount = 0;
    let failCount = 0;
    const processedKeys = new Set();

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        const match = line.match(/^([a-zA-Z][a-zA-Z0-9_]*)=(.*)$/);
        if (!match) continue;

        const key = match[1].trim();
        let value = match[2].trim();

        // Remove surrounding quotes if they exist in the file
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
        }

        // Strip trailing comments if they aren't inside quotes
        if (!value.startsWith('"') && !value.startsWith("'")) {
            const hashIndex = value.indexOf('#');
            if (hashIndex !== -1) {
                value = value.substring(0, hashIndex).trim();
            }
        }

        if (key === 'JWT_PRIVATE_KEY' || key === 'JWKS') continue;
        processedKeys.add(key);

        // Check if value actually changed
        if (existingVars[key] === value) {
            continue;
        }

        try {
            const prodFlag = isProd ? '--prod' : '';
            console.log(`  Updating ${key}...`);

            // First, escape double quotes with backslashes for the Convex CLI to preserve them
            // Then escape single quotes for PowerShell (doubled: ' -> '')
            const escapedValue = value.replace(/"/g, '\\"').replace(/'/g, "''");

            // Use -- to signify end of options so the private key (starting with -) isn't parsed as a flag
            // Single quotes in PowerShell prevent any interpretation of special characters
            execSync(`npx convex env set ${prodFlag} ${key} -- '${escapedValue}'`, {
                shell: 'powershell.exe',
                stdio: 'inherit'
            });
            changeCount++;

        } catch (err) {
            console.error(`  ❌ Failed to set ${key}`);
            failCount++;
        }
    }

    // New: Remove keys from Convex that are not in the local file
    for (const key of Object.keys(existingVars)) {
        // Skip system keys and keys we just processed/skipped
        if (processedKeys.has(key)) continue;
        if (key === 'JWT_PRIVATE_KEY' || key === 'JWKS') continue;
        if (key.startsWith('CONVEX_')) continue; // Skip other internal convex vars

        try {
            const prodFlag = isProd ? '--prod' : '';
            console.log(`  🗑️  Removing ${key} from Convex (not in local file)...`);
            execSync(`npx convex env remove ${prodFlag} ${key}`, {
                stdio: 'inherit'
            });
            changeCount++;
        } catch (err) {
            console.error(`  ❌ Failed to remove ${key} from Convex`);
            failCount++;
        }
    }

    if (changeCount === 0 && failCount === 0) {
        console.log('✨ Everything is already in sync. No changes made.');
    } else if (failCount > 0) {
        console.log(`⚠️ Sync complete with ${failCount} failures. Updated ${changeCount} variables.`);
    } else {
        console.log(`✅ Sync complete! Updated ${changeCount} variables.`);
    }

    if (isVercel) {
        console.log(`\n🚀 Syncing to Vercel PRODUCTION from ${envFile}...`);

        const existingVercelVars = getExistingVercelVars();
        if (!existingVercelVars) {
            console.warn('⚠️  Could not fetch existing Vercel variables.');
            console.warn('👉 Be sure to link the project using "npx vercel link" if you haven\'t already.');
            console.warn('   Falling back to standard push...\n');
        }

        let vercelAddCount = 0;
        let vercelRemoveCount = 0;
        const processedKeys = new Set();

        // 1. Add/Update variables from the local file
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            const firstEqualIndex = line.indexOf('=');
            if (firstEqualIndex === -1) continue;

            const key = line.substring(0, firstEqualIndex).trim();
            let value = line.substring(firstEqualIndex + 1).trim();

            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.substring(1, value.length - 1);
            }

            // Strip trailing comments if they aren't inside quotes
            if (!value.startsWith('"') && !value.startsWith("'")) {
                const hashIndex = value.indexOf('#');
                if (hashIndex !== -1) {
                    value = value.substring(0, hashIndex).trim();
                }
            }

            if (key === 'JWT_PRIVATE_KEY' || key === 'JWKS') continue;
            processedKeys.add(key);

            // Check if update is needed
            if (existingVercelVars && existingVercelVars[key] === value) {
                continue;
            }

            try {
                console.log(`  ${existingVercelVars ? (existingVercelVars[key] ? 'Updating' : 'Adding') : 'Syncing'} ${key} to Vercel...`);

                // Use spawnSync to handle complex values via stdin
                // Use --force for newer Vercel CLI versions to overwrite
                const result = spawnSync('npx', ['vercel', 'env', 'add', key, 'production', '--force'], {
                    input: value,
                    encoding: 'utf-8',
                    shell: true
                });

                if (result.status === 0) {
                    vercelAddCount++;
                } else {
                    // Fallback for older Vercel CLI versions that don't support --force
                    try {
                        execSync(`npx vercel env rm ${key} production -y`, { stdio: 'ignore', shell: 'powershell.exe' });
                        const retryResult = spawnSync('npx', ['vercel', 'env', 'add', key, 'production'], {
                            input: value,
                            encoding: 'utf-8',
                            shell: true
                        });
                        if (retryResult.status === 0) {
                            vercelAddCount++;
                        } else {
                            console.error(`  ❌ Failed to sync ${key}: ${retryResult.stderr?.trim() || 'Unknown error'}`);
                        }
                    } catch (e) {
                        const errorMsg = result.stderr?.trim() || 'Unknown error';
                        console.error(`  ❌ Failed to sync ${key}: ${errorMsg}`);
                        if (errorMsg.includes('not linked')) {
                            console.error('     (Hint: Try running "npx vercel link")');
                        }
                    }
                }
            } catch (err) {
                console.error(`  ❌ Error syncing ${key} to Vercel: ${err.message}`);
            }
        }

        // 2. Remove variables from Vercel that aren't in the local file
        if (existingVercelVars) {
            for (const key of Object.keys(existingVercelVars)) {
                // Don't remove system variables, build cache keys, or variables handled in local file
                if (!processedKeys.has(key) &&
                    !key.startsWith('VERCEL_') &&
                    !key.startsWith('NX_') &&
                    !key.startsWith('TURBO_') &&
                    key !== 'VERCEL'
                ) {
                    console.log(`  🗑️  Removing ${key} from Vercel (not in local file)...`);
                    try {
                        execSync(`npx vercel env rm ${key} production -y`, { stdio: 'ignore' });
                        vercelRemoveCount++;
                    } catch (err) {
                        console.error(`  ❌ Failed to remove ${key} from Vercel`);
                    }
                }
            }
        }

        if (vercelAddCount === 0 && vercelRemoveCount === 0) {
            console.log('✨ Vercel is already in sync. No changes made.');
        } else {
            console.log(`✅ Vercel sync complete! Added/Updated ${vercelAddCount}, Removed ${vercelRemoveCount}.`);
        }
    }

    console.log('\n⚠️  REMEBER TO MANUALLY UPDATE JWT');
} catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
}
