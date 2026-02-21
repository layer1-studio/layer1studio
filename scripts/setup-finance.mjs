// Run this script ONCE to set up the financeConfig document in Firestore.
// Usage: node scripts/setup-finance.mjs
//
// This script authenticates with Firebase Auth first, then writes the config.

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createInterface } from 'readline';

const firebaseConfig = {
    apiKey: "AIzaSyCKLXNE3JFIfSULFUCFwz0G3XeUb4BNnkg",
    authDomain: "layer1studio-750f4.firebaseapp.com",
    projectId: "layer1studio-750f4",
    storageBucket: "layer1studio-750f4.firebasestorage.app",
    messagingSenderId: "540706846466",
    appId: "1:540706846466:web:7080fcb3c6533dd081f41b",
    measurementId: "G-8YCTMN2X95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function ask(question) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function setup() {
    console.log('🔐 Finance Portal Setup\n');

    // Authenticate first
    const loginEmail = await ask('Login email (your existing Firebase Auth account): ');
    const loginPassword = await ask('Login password: ');

    try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log('✅ Authenticated!\n');
    } catch (err) {
        console.error('❌ Auth failed:', err.message);
        process.exit(1);
    }

    // Configure finance settings
    const financeEmail = await ask('Finance manager email (who can access the portal): ');
    const passcode = await ask('6-digit passcode: ');
    const payDay = 22;

    await setDoc(doc(db, 'financeConfig', 'settings'), {
        allowedEmails: [financeEmail.toLowerCase()],
        passcode: passcode,
        payDay: payDay,
        reminderDaysBefore: 3,
        createdAt: new Date().toISOString(),
    });

    console.log('\n✅ Finance config created successfully!');
    console.log(`   Allowed email: ${financeEmail}`);
    console.log(`   Passcode: ${passcode}`);
    console.log(`   Pay Day: ${payDay}th`);

    // Also create employees and payroll collections by writing a placeholder
    // (Firestore creates collections on first write)

    console.log('\n🎉 Setup complete! Navigate to /vault/internal/gate/secure/finance/login to access.');
    process.exit(0);
}

setup().catch(err => {
    console.error('❌ Setup failed:', err);
    process.exit(1);
});
