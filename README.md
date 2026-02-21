# layer1.studio - Team Portal

This repository contains the internal management platform for **layer1.studio**, designed to handle employee onboarding, profiles, and automated monthly payroll via a secure Finance Portal.

## 🚀 Key Features

*   **Employee Directory**: Track roles, base salaries, tax codes, and CV drive links for all team members.
*   **Automated Payroll**: One-click generation of monthly payroll runs.
*   **Frontend-only PDF Engine**: Securely generates professional A4 payslips directly in the manager's browser using `jsPDF` and `html2canvas` — avoiding expensive cloud computing costs.
*   **Zero-Cost Delivery**: Integrates with **EmailJS** for instant, free delivery of payslips to employees.
*   **Historical Accuracy**: Supports manual adjustments to retroactively record past payments while preventing duplicates.
*   **Dual Dashboards**: Segregated portals for Management (Finance) and Employees (Self-Service).
* 
## ⚙️ How to Run Locally

1. Clone the repository natively or open it via GitHub.
2. Install dependencies: `npm install`
3. Add the required `.env` file (containing your `VITE_EMAILJS_*` keys).
4. Run the local dev server: `npm run dev`

---

## 🔮 What's Next (To-Do List)

> [!NOTE] 
> This section outlines the immediate next steps to make the platform fully production-ready.

**1. Create the EmailJS Account & Template**
*   [ ] Open an account at [EmailJS](https://www.emailjs.com/) and connect an email service. Use l
*   [ ] Create a new Email Template.
*   [ ] Set the **To Email** field to `{{to_email}}`.
*   [ ] Attach your dynamic Base64 PDF by placing `{{attachment}}` in the template attachment settings.
*   [ ] Add the `VITE_EMAILJS_SERVICE_ID`, `TEMPLATE_ID`, and `PUBLIC_KEY` into the `.env` file for the frontend app.

**2. Roll Out Employee Dashboards**
*   [ ] Ensure `EmployeeLogin.jsx` and `EmployeeDashboard.jsx` are fully styled and integrated.
*   [ ] Verify Employee Portal routing limits an employee to only viewing their own payslips based on their authenticated Firebase UID.

**3. Test Drive with a Simulated Month**
*   [ ] Manually execute one full "Draft -> Approved -> Authorized" cycle using a test email address.
*   [ ] Verify that the generated PDF opens correctly on mobile devices and email clients.
*   [ ] Verify the transaction populates the history lists correctly.

**4. Enhance Security Rules (Firestore)**
*   [ ] Write explicit Firestore Security Rules restricting `/financeConfig` to admin logic only.
*   [ ] Lock down the `/employees/{id}` paths globally except for the respective authenticated users and authenticated finance managers.
