# layer1.studio Branding Templates

A collection of professional business document templates for **layer1.studio**.

### 🎨 [Launch Branding Studio](https://layer1-studio.github.io/l1s-branding-templates/)
*Edit and generate branded PDFs directly in your browser.*

## Templates Included

- **Appointment**: `appointment.html`
- **Invoice**: `invoice.html`
- **Letter**: `letter.html`
- **NDA (Non-Disclosure Agreement)**: `nda.html`
- **Quote**: `quote.html`
- **Receipt**: `receipt.html`
- **Service Letter**: `service_letter.html`
- **SOW (Statement of Work)**: `sow.html`

## Features

- **Responsive Design**: Clean and professional layout across all devices.
- **Brand Consistency**: Unified styling for all business letters and documents.
- **Ease of Use**: Simple HTML/CSS structure for easy customization.

### 1. Cloud Automation (GitHub Actions)

This repository is set up with **GitHub Actions**. Whenever you edit a JSON file in the `data/` folder directly on GitHub:
1.  **GitHub runs the engine** automatically in the cloud.
2.  **It generates the PDFs** for all your templates.
3.  **It commits the new PDFs** back to the `output/` folder in this repo.

*No setup required on your local machine if you edit via the GitHub website!*

### 2. Local Generation (Advanced)

If you prefer to work locally:
1.  **Install dependencies**: `npm install`
2.  **Run the generator**:
    - For one document: `node generate.js invoice`
    - For all documents: `node generate.js --all`

### Available Types
`appointment`, `invoice`, `letter`, `nda`, `quote`, `receipt`, `service_letter`, `sow`.

---
© 2026 layer1.studio
