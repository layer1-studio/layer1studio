import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const createPayslipPDF = async (empData, periodKey, payDayStr) => {
    // 1. Create a hidden container for the template
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.minHeight = '297mm';
    container.style.background = 'white';
    container.style.color = '#0a0c10';
    container.style.fontFamily = "'Outfit', sans-serif";
    container.style.padding = '12mm 15mm';
    container.style.boxSizing = 'border-box';

    // Basic Styles for the HTML
    const formatCurrency = (val) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', currencyDisplay: 'symbol' }).format(val || 0).replace('LKR', 'Rs.');

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <img src="${window.location.origin}/assets/logo.png" alt="logo" style="height: 60px; margin-bottom: 8px;" crossorigin="anonymous">
                <div style="padding: 4px 12px; background: #79c5e3; color: white; border-radius: 4px; font-weight: 600; font-size: 9pt; text-transform: uppercase; margin-bottom: 10px;">Payslip</div>
            </div>
            <div style="text-align: right; font-size: 9.5pt; color: #64748b;">
                <h1 style="font-size: 16pt; font-weight: 700; color: #0a0c10; margin-bottom: 5px;">layer1.studio</h1>
                <p>London • Colombo</p>
                <p>studio.layer1@gmail.com</p>
                <p>Period: ${periodKey}</p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
            <div>
                <h3 style="text-transform: uppercase; font-size: 8.5pt; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">Employee Details</h3>
                <p><strong>${empData.name}</strong></p>
                <p>${empData.designation}</p>
                <p>ID: ${empData.employeeId}</p>
            </div>
            <div style="text-align: right;">
                <h3 style="text-transform: uppercase; font-size: 8.5pt; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">Pay Date</h3>
                <p>${payDayStr}</p>
                <h3 style="text-transform: uppercase; font-size: 8.5pt; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; margin-top: 8px;">Tax Code</h3>
                <p>${empData.taxCode || '1257L'}</p>
            </div>
        </div>

        <div style="display: flex; gap: 20px; width: 100%;">
            <div style="flex: 1;">
                <h3 style="font-size: 10pt; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; margin-bottom: 10px; padding-bottom: 4px;">Earnings</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Basic Salary</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.baseSalary)}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Bonus</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.bonus)}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Overtime</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.overtime)}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Allowances</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.allowances)}</td></tr>
                </table>
            </div>
            <div style="flex: 1;">
                <h3 style="font-size: 10pt; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; margin-bottom: 10px; padding-bottom: 4px;">Deductions</h3>
                 <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Tax</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.taxDeduction)}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Pension</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.pensionDeduction)}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Other</td><td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formatCurrency(empData.otherDeductions)}</td></tr>
                </table>
            </div>
        </div>

        <div style="margin-top: 20px; border-top: 2px solid #e2e8f0; padding-top: 15px;">
            <table style="width: 50%; margin-left: auto; border-collapse: collapse;">
                <tr><td style="padding: 6px; text-align: right; color: #64748b;">Total Earnings</td><td style="padding: 6px; text-align: right; font-weight: bold;">${formatCurrency(empData.totalEarnings)}</td></tr>
                <tr><td style="padding: 6px; text-align: right; color: #64748b;">Total Deductions</td><td style="padding: 6px; text-align: right; font-weight: bold;">${formatCurrency(empData.totalDeductions)}</td></tr>
                <tr>
                    <td style="padding: 10px; text-align: right; font-size: 14pt; font-weight: bold;">Net Pay</td>
                    <td style="padding: 10px; text-align: right; font-size: 14pt; font-weight: bold; background: #f1f5f9; color: #79c5e3;">${formatCurrency(empData.netPay)}</td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 40px; background: #f1f5f9; padding: 20px; border-radius: 8px;">
            <h3 style="font-size: 10pt; text-transform: uppercase; margin-bottom: 10px;">Payment Details</h3>
            <p style="margin-bottom: 4px;"><strong>Bank:</strong> ${empData.bankName || '-'}</p>
            <p style="margin-bottom: 4px;"><strong>Account Number:</strong> ${empData.accountNumber || '-'}</p>
            <p style="margin-bottom: 4px;"><strong>Sort Code:</strong> ${empData.sortCode || '-'}</p>
        </div>

        <div style="position: absolute; bottom: 12mm; left: 15mm; right: 15mm; border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; font-size: 8.5pt; color: #64748b;">
            <p>layer1.studio</p>
            <p>Confidential</p>
            <p>© ${new Date().getFullYear()} layer1.studio</p>
        </div>
    `;

    document.body.appendChild(container);

    // 2. Render to canvas
    const canvas = await html2canvas(container, {
        scale: 2, // higher resolution
        useCORS: true,
        logging: false
    });

    // 3. Cleanup DOM
    document.body.removeChild(container);

    // 4. Convert to PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // A4 dimensions are 210 x 297 mm
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

    return pdf;
};

export const generatePayslipPDFBase64 = async (empData, periodKey, payDayStr) => {
    const pdf = await createPayslipPDF(empData, periodKey, payDayStr);
    const dataUri = pdf.output('datauristring');
    const base64String = dataUri.split(',')[1];
    return base64String;
};

export const generatePayslipPDF = async (empData, periodKey, payDayStr) => {
    const pdf = await createPayslipPDF(empData, periodKey, payDayStr);
    pdf.save(`Payslip_${periodKey}_${empData.name.replace(/\s+/g, '_')}.pdf`);
};
