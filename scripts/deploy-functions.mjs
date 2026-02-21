import { execSync } from 'child_process';

try {
    console.log('Setting Resend API Key...');

    // Correct Firebase CLI command is functions:secrets:set
    execSync('echo "re_95Ja1Ykm_PbguhR3HB1gtdSXxgmYG8Jku" | npx firebase-tools functions:secrets:set RESEND_API_KEY --project layer1studio-750f4', {
        stdio: 'inherit'
    });

    console.log('Installing function dependencies...');
    execSync('cd functions && npm install', {
        stdio: 'inherit'
    });

    console.log('Deploying functions...');
    execSync('npx firebase-tools deploy --only functions --project layer1studio-750f4', {
        stdio: 'inherit'
    });

    console.log('✅ Deployment successful! Emails will now be sent upon payroll authorization.');
} catch (err) {
    console.error('❌ Deployment failed:', err.message);
}
