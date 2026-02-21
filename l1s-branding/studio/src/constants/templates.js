import invoiceHtml from '../templates/invoice.html?raw';
import quoteHtml from '../templates/quote.html?raw';
import letterHtml from '../templates/letter.html?raw';
import ndaHtml from '../templates/nda.html?raw';
import receiptHtml from '../templates/receipt.html?raw';
import serviceLetterHtml from '../templates/service_letter.html?raw';
import sowHtml from '../templates/sow.html?raw';
import appointmentHtml from '../templates/appointment.html?raw';
import payslipHtml from '../templates/payslip.html?raw';
import stylesCss from '../templates/styles.css?raw';

export const TEMPLATES_CONFIG = {
    invoice: {
        name: 'Invoice',
        html: invoiceHtml,
        css: stylesCss,
        fields: [
            { id: 'invoice_number', label: 'Invoice #', type: 'text' },
            { id: 'date', label: 'Billing Date', type: 'text' },
            { id: 'due_date', label: 'Due Date', type: 'text' },
            { id: 'client.name', label: 'Client Name', type: 'text' },
            { id: 'client.address', label: 'Client Address', type: 'textarea' },
            { id: 'client.email', label: 'Client Email', type: 'text' },
            {
                id: 'items', label: 'Service Items', type: 'list', fields: [
                    { id: 'description', label: 'Description', type: 'text' },
                    { id: 'amount', label: 'Amount', type: 'text' }
                ]
            },
            { id: 'tax', label: 'Tax %', type: 'text' },
            { id: 'subtotal', label: 'Subtotal (Auto)', type: 'text' },
            { id: 'total', label: 'Total (Auto)', type: 'text' },
            { id: 'bank.name', label: 'Bank Name', type: 'text' },
            { id: 'bank.account_name', label: 'Account Name', type: 'text' },
            { id: 'bank.sort_code', label: 'Sort Code', type: 'text' },
            { id: 'bank.account_number', label: 'Account Number', type: 'text' },
            { id: 'bank.iban', label: 'IBAN', type: 'text' },
            { id: 'bank.swift', label: 'SWIFT/BIC', type: 'text' },
            { id: 'payment_terms', label: 'Notes', type: 'textarea' },
        ],
        initialData: {
            invoice_number: 'L1-INV-2026-001',
            date: 'February 6, 2026',
            due_date: 'February 20, 2026',
            client: { name: 'Acme Corp', address: '123 Business Way,\nTech City, UK', email: 'billing@acme.com' },
            items: [
                { description: 'Web Application Design & Dev', amount: '$4,500' },
                { description: 'Brand Identity System', amount: '$1,200' },
                { description: 'Loyalty Discount', amount: '-$500' }
            ],
            tax: '20',
            subtotal: '$5,200.00',
            tax_amount: '$1,040.00',
            total: '$6,240.00',
            bank: {
                name: 'Monzo Bank',
                account_name: 'LAYER1 STUDIO LTD',
                sort_code: '00-11-22',
                account_number: '12345678',
                iban: 'GB82 MONZ 1234 5678 9012 34',
                swift: 'MONZGB21'
            },
            payment_terms: 'Payment due within 14 days via Bank Transfer.'
        }
    },
    letter: {
        name: 'Formal Letter',
        html: letterHtml,
        css: stylesCss,
        fields: [
            { id: 'our_ref', label: 'Our Reference', type: 'text' },
            { id: 'your_ref', label: 'Your Reference', type: 'text' },
            { id: 'recipient_name', label: 'Recipient Name', type: 'text' },
            { id: 'recipient_title', label: 'Recipient Title', type: 'text' },
            { id: 'recipient_address', label: 'Recipient Address', type: 'textarea' },
            { id: 'date', label: 'Date', type: 'text' },
            { id: 'subject', label: 'Subject Line', type: 'text' },
            { id: 'salutation', label: 'Salutation', type: 'text' },
            { id: 'body', label: 'Letter Body', type: 'textarea' },
            { id: 'closing', label: 'Closing', type: 'text' },
            { id: 'signatory.name', label: 'Signatory Name', type: 'text' },
            { id: 'signatory.title', label: 'Signatory Title', type: 'text' },
        ],
        initialData: {
            our_ref: 'L1/2026/RC-04',
            your_ref: 'ACME/CORP/77',
            recipient_name: 'John Doe',
            recipient_title: 'Operations Director',
            recipient_address: '456 Commercial Rd,\nLondon, UK',
            date: 'February 6, 2026',
            subject: 'Project Commencement Notice',
            salutation: 'Dear Mr. Doe',
            body: 'We are pleased to inform you that we are ready to begin Phase 1 of your project. Our team has finalized the initial research and is moving into the design stage.',
            closing: 'Sincerely',
            sender_name: 'Rachel Cooray',
            sender_title: 'Founder, layer1.studio',
            signatory: { name: 'Rachel Cooray', title: 'Founder' }
        }
    },
    quote: {
        name: 'Project Quote',
        html: quoteHtml,
        css: stylesCss,
        fields: [
            { id: 'quote_number', label: 'Quote #', type: 'text' },
            { id: 'date', label: 'Date', type: 'text' },
            { id: 'valid_until', label: 'Valid Until', type: 'text' },
            { id: 'client.name', label: 'Client Name', type: 'text' },
            { id: 'project.name', label: 'Project Name', type: 'text' },
            { id: 'project.timeline', label: 'Estimated Timeline', type: 'text' },
            {
                id: 'items', label: 'Service Items', type: 'list', fields: [
                    { id: 'description', label: 'Description', type: 'text' },
                    { id: 'amount', label: 'Amount', type: 'text' }
                ]
            },
            { id: 'total', label: 'Total Estimate (Auto)', type: 'text' },
            { id: 'notes', label: 'Notes & Conditions', type: 'textarea' },
        ],
        initialData: {
            quote_number: 'L1-QT-2026-042',
            date: 'February 6, 2026',
            valid_until: 'March 6, 2026',
            client: { name: 'Vanguard Systems' },
            project: { name: 'E-commerce Redesign', timeline: '8-10 Weeks' },
            items: [
                { description: 'Initial Discovery & Wireframing', amount: '$3,800' },
                { description: 'Visual Design & Prototyping', amount: '$4,000' }
            ],
            total: '$7,800.00',
            notes: 'This estimate is based on the initial requirements discussed.'
        }
    },
    nda: {
        name: 'NDA',
        html: ndaHtml,
        css: stylesCss,
        fields: [
            { id: 'disclosing_party', label: 'Disclosing Party', type: 'text' },
            { id: 'receiving_party', label: 'Receiving Party', type: 'text' },
            { id: 'date', label: 'Effective Date', type: 'text' },
            { id: 'term', label: 'Confidentiality Term', type: 'text' },
            { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea' },
            { id: 'state_law', label: 'Governing Law', type: 'text' },
        ],
        initialData: {
            disclosing_party: 'layer1.studio',
            receiving_party: 'Acme Corp',
            date: 'February 6, 2026',
            term: '3 Years',
            purpose: 'Evaluation of a potential business relationship.',
            state_law: 'United Kingdom',
        }
    },
    receipt: {
        name: 'Receipt',
        html: receiptHtml,
        css: stylesCss,
        fields: [
            { id: 'receipt_number', label: 'Receipt #', type: 'text' },
            { id: 'date', label: 'Date', type: 'text' },
            { id: 'paid_by', label: 'Paid By', type: 'text' },
            { id: 'amount_paid', label: 'Amount Paid', type: 'text' },
            { id: 'payment_method', label: 'Payment Method', type: 'text' },
            { id: 'transaction_id', label: 'Transaction ID', type: 'text' },
            { id: 'description', label: 'Description', type: 'text' },
        ],
        initialData: {
            receipt_number: 'L1-RCP-2026-003',
            date: 'February 6, 2026',
            paid_by: 'Rachel Cooray',
            amount_paid: '$500.00',
            payment_method: 'Bank Transfer',
            transaction_id: 'TXN-98234-L1',
            description: 'Consultation Fee',
        }
    },
    service_letter: {
        name: 'Service Letter',
        html: serviceLetterHtml,
        css: stylesCss,
        fields: [
            { id: 'employee_name', label: 'Employee Name', type: 'text' },
            { id: 'pronoun', label: 'Pronoun (His/Her/Their)', type: 'text' },
            { id: 'designation', label: 'Designation', type: 'text' },
            { id: 'start_date', label: 'Employment Start', type: 'text' },
            { id: 'end_date', label: 'Employment End', type: 'text' },
            { id: 'contributions', label: 'Major Contributions', type: 'textarea' },
            { id: 'performance', label: 'Performance Summary', type: 'text' },
            { id: 'current_date', label: 'Issue Date', type: 'text' },
            { id: 'signatory.name', label: 'Authorized Signatory', type: 'text' },
            { id: 'signatory.title', label: 'Signatory Title', type: 'text' },
        ],
        initialData: {
            employee_name: 'Alex Rivera',
            pronoun: 'Their',
            designation: 'Lead UI/UX Designer',
            start_date: 'January 10, 2024',
            end_date: 'February 1, 2026',
            contributions: 'the successful delivery of our core mobile application',
            performance: 'Excellent',
            current_date: 'February 6, 2026',
            signatory: { name: 'Rachel Cooray', title: 'Founder' }
        }
    },
    sow: {
        name: 'Statement of Work',
        html: sowHtml,
        css: stylesCss,
        fields: [
            { id: 'project_name', label: 'Project Name', type: 'text' },
            { id: 'client.name', label: 'Client Name', type: 'text' },
            { id: 'sow_reference', label: 'Reference #', type: 'text' },
            { id: 'date', label: 'Date', type: 'text' },
            { id: 'overview', label: 'Project Overview', type: 'textarea' },
            {
                id: 'deliverables', label: 'Deliverables', type: 'list', fields: [
                    { id: 'item', label: 'Item', type: 'text' },
                    { id: 'deadline', label: 'Deadline', type: 'text' }
                ]
            },
            { id: 'out_of_scope', label: 'Out of Scope', type: 'textarea' },
            { id: 'milestones', label: 'Payment Milestones', type: 'textarea' },
        ],
        initialData: {
            project_name: 'Stellar App Development',
            client: { name: 'Stellar Tech' },
            sow_reference: 'L1-SOW-2026-08',
            date: 'February 6, 2026',
            overview: 'This project involves the full design and development of the Stellar SaaS platform.',
            deliverables: [
                { item: 'UI/UX Design System', deadline: 'Week 4' },
                { item: 'Frontend MVP Development', deadline: 'Week 8' }
            ],
            out_of_scope: 'Content marketing and print logistics.',
            milestones: '50% upon signing, 50% upon final delivery.',
        }
    },
    appointment: {
        name: 'Appointment Letter',
        html: appointmentHtml,
        css: stylesCss,
        fields: [
            { id: 'candidate.name', label: 'Candidate Name', type: 'text' },
            { id: 'candidate.email', label: 'Email', type: 'text' },
            { id: 'candidate.address', label: 'Candidate Address', type: 'textarea' },
            { id: 'date', label: 'Offer Date', type: 'text' },
            { id: 'position', label: 'Job Title', type: 'text' },
            { id: 'reference', label: 'Ref #', type: 'text' },
            { id: 'start_date', label: 'Start Date', type: 'text' },
            { id: 'probation_period', label: 'Probation Period', type: 'text' },
            { id: 'reporting_to', label: 'Reports To', type: 'text' },
            { id: 'remuneration', label: 'Salary/Package', type: 'text' },
            { id: 'location', label: 'Location', type: 'text' },
            { id: 'responsibilities', label: 'Job Summary', type: 'textarea' },
            { id: 'benefits', label: 'Benefits', type: 'textarea' },
            { id: 'signatory.name', label: 'Authorized Signatory', type: 'text' },
            { id: 'signatory.title', label: 'Signatory Title', type: 'text' },
        ],
        initialData: {
            candidate: { name: 'Sarah Parker', email: 'sarah.p@example.com', address: '789 Oak Lane, London' },
            date: 'February 6, 2026',
            position: 'Senior AI Engineer',
            reference: 'L1-HR-2026-15',
            start_date: 'March 15, 2026',
            probation_period: '6 Months',
            reporting_to: 'Chief Technology Officer',
            remuneration: '£85,000 per annum',
            location: 'London / Remote',
            responsibilities: 'You will lead our AI research initiatives.',
            benefits: 'Private healthcare and 30 days holiday.',
            signatory: { name: 'Rachel Cooray', title: 'Founder' }
        }
    },
    payslip: {
        name: 'Payslip',
        html: payslipHtml,
        css: stylesCss,
        fields: [
            { id: 'employee.name', label: 'Employee Name', type: 'text' },
            { id: 'employee.id', label: 'Employee ID', type: 'text' },
            { id: 'employee.designation', label: 'Designation', type: 'text' },
            { id: 'pay_period', label: 'Pay Period', type: 'text' },
            { id: 'pay_date', label: 'Pay Date', type: 'text' },
            { id: 'tax_code', label: 'Tax Code', type: 'text' },
            {
                id: 'earnings', label: 'Earnings', type: 'list', fields: [
                    { id: 'description', label: 'Description', type: 'text' },
                    { id: 'amount', label: 'Amount', type: 'text' }
                ]
            },
            {
                id: 'deductions', label: 'Deductions', type: 'list', fields: [
                    { id: 'description', label: 'Description', type: 'text' },
                    { id: 'amount', label: 'Amount', type: 'text' }
                ]
            },
            { id: 'total_earnings', label: 'Total Earnings', type: 'text' },
            { id: 'total_deductions', label: 'Total Deductions', type: 'text' },
            { id: 'net_pay', label: 'Net Pay', type: 'text' },
            { id: 'bank.name', label: 'Bank Name', type: 'text' },
            { id: 'bank.account_number', label: 'Account Number', type: 'text' },
            { id: 'bank.sort_code', label: 'Sort Code', type: 'text' },
        ],
        initialData: {
            employee: { name: 'Sarah Parker', id: 'L1-EMP-042', designation: 'Senior AI Engineer' },
            pay_period: 'February 2026',
            pay_date: 'February 28, 2026',
            tax_code: '1257L',
            earnings: [
                { description: 'Basic Salary', amount: '£7,083.33' },
                { description: 'Performance Bonus', amount: '£500.00' }
            ],
            deductions: [
                { description: 'Income Tax', amount: '£1,450.20' },
                { description: 'National Insurance', amount: '£480.00' },
                { description: 'Pension', amount: '£354.17' }
            ],
            total_earnings: '£7,583.33',
            total_deductions: '£2,284.37',
            net_pay: '£5,298.96',
            bank: {
                name: 'Lloyds Bank',
                account_number: '****5678',
                sort_code: '30-94-55'
            }
        }
    }
};
