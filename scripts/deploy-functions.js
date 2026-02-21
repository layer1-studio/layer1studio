const { execSync } = require('child_process');

try {
    console.log('Setting Resend API Key...');
    execSync('firebase secrets:set RESEND_API_KEY --project layer1studio-750f4 --non-interactive', {
        input: 're_95Ja1Ykm_PbguhR3HB1gtdSXxgmYG8Jku\n',
        stdio: ['pipe', 'inherit', 'inherit']
    });

    console.log('Deploying functions...');
    execSync('firebase deploy --only functions --project layer1studio-750f4', {
        stdio: 'inherit'
    });

    console.log('Deployment successful!');
} catch (err) {
    console.error('Deployment failed.');
}
