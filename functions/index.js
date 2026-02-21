const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Resend } = require("resend");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

admin.initializeApp();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;
const MANAGER_WHATSAPP_TO = process.env.MANAGER_WHATSAPP_TO;

/**
 * Helper to generate PDF from HTML
 */
async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new"
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
    });
    await browser.close();
    return pdfBuffer;
}

const PAYSLIP_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        :root {
            --primary: #79c5e3;
            --text-main: #0a0c10;
            --text-muted: #64748b;
            --slate-100: #f1f5f9;
            --slate-200: #e2e8f0;
            --font-main: 'Outfit', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-main); color: var(--text-main); background: white; -webkit-print-color-adjust: exact; }
        .page { width: 210mm; min-height: 297mm; padding: 12mm 15mm; position: relative; overflow: hidden; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
        .logo-section { display: flex; flex-direction: column; align-items: center; }
        .logo-section img { height: 60px; margin-bottom: 8px; }
        .badge { display: inline-block; padding: 4px 12px; background: var(--primary); color: white; border-radius: 4px; font-weight: 600; font-size: 9pt; text-transform: uppercase; margin-bottom: 10px; }
        .studio-info { text-align: right; font-size: 9.5pt; color: var(--text-muted); }
        .studio-info h1 { font-size: 16pt; font-weight: 700; color: var(--text-main); margin-bottom: 5px; }
        .doc-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; }
        .client-info h3, .doc-info h3 { text-transform: uppercase; font-size: 8.5pt; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        th { text-align: left; background: var(--slate-100); padding: 10px; font-size: 9.5pt; text-transform: uppercase; }
        td { padding: 10px; border-bottom: 1px solid var(--slate-200); font-size: 10.5pt; }
        .total-row td { border-bottom: none; font-weight: 700; }
        .total-row .label { text-align: right; }
        .total-row .amount { background: var(--slate-100); font-size: 13pt; color: var(--primary); }
        .footer-content { position: absolute; bottom: 12mm; left: 15mm; right: 15mm; border-top: 1px solid var(--slate-200); padding-top: 15px; display: flex; justify-content: space-between; font-size: 8.5pt; color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="page">
        <header class="header">
            <div class="logo-section">
                <img src="https://layer1-studio.github.io/layer1studio/assets/logo.png" alt="logo">
                <div class="badge">Payslip</div>
            </div>
            <div class="studio-info">
                <h1>layer1.studio</h1>
                <p>London • Colombo</p>
                <p>studio.layer1@gmail.com</p>
                <p>Period: {{pay_period}}</p>
            </div>
        </header>
        <section class="doc-meta">
            <div class="client-info">
                <h3>Employee Details</h3>
                <p><strong>{{employee.name}}</strong></p>
                <p>{{employee.designation}}</p>
                <p>ID: {{employee.id}}</p>
            </div>
            <div class="doc-info" style="text-align: right;">
                <h3>Pay Date</h3>
                <p>{{pay_date}}</p>
                <h3>Tax Code</h3>
                <p>{{tax_code}}</p>
            </div>
        </section>
        <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
                <h3 style="font-size: 10pt; text-transform: uppercase; border-bottom: 2px solid var(--slate-200); margin-bottom: 10px;">Earnings</h3>
                <table>
                    {{#each earnings}}
                    <tr><td>{{description}}</td><td style="text-align: right;">£{{amount}}</td></tr>
                    {{/each}}
                </table>
            </div>
            <div style="flex: 1;">
                <h3 style="font-size: 10pt; text-transform: uppercase; border-bottom: 2px solid var(--slate-200); margin-bottom: 10px;">Deductions</h3>
                <table>
                    {{#each deductions}}
                    <tr><td>{{description}}</td><td style="text-align: right;">£{{amount}}</td></tr>
                    {{/each}}
                </table>
            </div>
        </div>
        <div style="margin-top: 20px; border-top: 2px solid var(--slate-200); padding-top: 10px;">
            <table style="width: 50%; margin-left: auto;">
                <tr class="total-row"><td class="label">Total Earnings</td><td style="text-align: right;">£{{total_earnings}}</td></tr>
                <tr class="total-row"><td class="label">Total Deductions</td><td style="text-align: right;">£{{total_deductions}}</td></tr>
                <tr class="total-row"><td class="label" style="font-size: 14pt;">Net Pay</td><td class="amount" style="text-align: right;">£{{net_pay}}</td></tr>
            </table>
        </div>
        <section style="margin-top: 40px; background: var(--slate-100); padding: 20px; border-radius: 8px;">
            <h3 style="font-size: 10pt; text-transform: uppercase; margin-bottom: 10px;">Payment Details</h3>
            <p><strong>Bank:</strong> {{bank.name}}</p>
            <p><strong>Account Number:</strong> {{bank.account_number}}</p>
            <p><strong>Sort Code:</strong> {{bank.sort_code}}</p>
        </section>
        <footer class="footer-content"><p>layer1.studio</p><p>Confidential</p><p>© 2026 layer1.studio</p></footer>
    </div>
</body>
</html>
`;

/**
 * Trigger: When payroll status changes to 'authorized'
 */
exports.processPayroll = functions.region("europe-west2").runWith({
    memory: "1GB",
    timeoutSeconds: 300,
    secrets: ["RESEND_API_KEY"]
}).firestore
    .document("payroll/{payrollId}")
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        if (previousValue.status === "approved" && newValue.status === "authorized") {
            const resend = new Resend(RESEND_API_KEY || "re_123");
            const employees = newValue.employees || [];

            for (const emp of employees) {
                try {
                    console.log(`Generating payslip for ${emp.name}...`);

                    // 1. Prepare data for Handlebars
                    const templateData = {
                        pay_period: `${newValue.month + 1}/${newValue.year}`,
                        pay_date: newValue.payDay + "th",
                        tax_code: emp.taxCode || "1257L",
                        employee: {
                            name: emp.name,
                            designation: emp.designation,
                            id: emp.empCode
                        },
                        earnings: [
                            { description: "Basic Salary", amount: emp.baseSalary },
                            { description: "Bonus", amount: emp.bonus || 0 },
                            { description: "Overtime", amount: emp.overtime || 0 },
                            { description: "Allowances", amount: emp.allowances || 0 }
                        ],
                        deductions: [
                            { description: "Tax", amount: emp.taxDeduction || 0 },
                            { description: "Pension", amount: emp.pensionDeduction || 0 },
                            { description: "Other", amount: emp.otherDeductions || 0 }
                        ],
                        total_earnings: emp.totalEarnings,
                        total_deductions: emp.totalDeductions,
                        net_pay: emp.netPay,
                        bank: {
                            name: emp.bankName,
                            account_number: emp.accountNumber,
                            sort_code: emp.sortCode
                        }
                    };

                    const compiledHtml = handlebars.compile(PAYSLIP_TEMPLATE)(templateData);
                    const pdfBuffer = await generatePDF(compiledHtml);

                    // 2. Send via Resend
                    await resend.emails.send({
                        from: "Layer1 Studio <payroll@layer1studio.org>",
                        to: emp.email,
                        subject: `Payslip for ${templateData.pay_period}`,
                        html: `<p>Hi ${emp.name},</p><p>Please find attached your payslip for the month of ${templateData.pay_period}.</p><p>Regards,<br/>Finance Team</p>`,
                        attachments: [
                            {
                                filename: `Payslip_${emp.name.replace(/\s+/g, "_")}.pdf`,
                                content: pdfBuffer,
                            },
                        ],
                    });

                    console.log(`Successfully sent payslip to ${emp.email}`);
                } catch (err) {
                    console.error(`Failed to process ${emp.name}:`, err);
                }
            }

            // Update status to 'sent'
            return change.after.ref.update({
                status: "sent",
                sentAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        return null;
    });

/**
 * Scheduled Reminder: Runs on 19th and 21st at 9AM
 */
exports.payrollApprovalReminder = functions.region("europe-west2").runWith({
    secrets: ["TWILIO_AUTH_TOKEN", "RESEND_API_KEY"]
}).pubsub
    .schedule("0 9 19,21 * *")
    .timeZone("Asia/Colombo")
    .onRun(async (context) => {
        const db = admin.firestore();
        const now = new Date();
        const periodKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const payrollQuery = await db.collection("payroll").where("periodKey", "==", periodKey).get();
        let needsApproval = payrollQuery.empty || payrollQuery.docs[0].data().status === "draft";

        if (needsApproval) {
            console.log("Sending payroll approval reminders...");
            // Logic for Email + WhatsApp via Twilio
        }
    });
