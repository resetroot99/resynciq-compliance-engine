# ComplianceIQ

ComplianceIQ is a modern web application designed to streamline the analysis and management of estimates for compliance, repair, and related services. The app integrates several advanced features, including OCR data extraction, AI-based predictive modeling, and compliance validation. With a sleek, modern UI (inspired by sites like [RepairLogic](https://oeconnection.com/products/repairlogic/)), the application ensures a seamless user experience—from logging in and uploading estimates to reviewing detailed analyses and compliance insights.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture & Services](#architecture--services)
- [Project Structure](#project-structure)
- [User Flow](#user-flow)
- [Next Steps](#next-steps)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ComplianceIQ is built to help users:
- Upload and store estimates (PDF/EMS files) using a modern, intuitive interface.
- Extract data using OCR, validate the extracted data, and correct errors automatically.
- Perform AI/ML analysis to evaluate labor rates, parts, and operations.
- Execute compliance checks with actionable recommendations.
- Review all submitted estimates with detailed breakdowns and take final actions (approve or reject).

The app is structured as a single-page application using modern JavaScript and CSS techniques, ensuring responsiveness and smooth transitions between sections.

---

## Features

- **Modern Login Page:**  
  A clean, responsive login page that welcomes users and directs them into the dashboard.

- **Dashboard:**  
  A modern, card-based layout replacing the old terminal style. Contains:
  - **Estimate Upload:** Drag-and-drop or file select interface.
  - **Queue Management:** A dynamic review queue that lists all uploaded estimates.
  - **Detail View:** Detailed insight into each estimate including labor, parts, and operations.
  - **AI Analysis:** In-depth analysis for optimizing and validating estimates.
  - **Compliance Checks:** Ensure all estimates meet industry and regulatory standards.
  - **Auto-Correction & Learning Feedback:** Recommendations and corrections are logged for continuous improvement.

- **File Storage Integration:**  
  Uploaded files are processed (OCR, analysis) and then stored in the portal via our `EstimateStorageService`.

- **Notifications & Error Handling:**  
  Modern notifications alert users to successes, warnings, or errors across the application.

- **Hidden Signature:**  
  A hidden ASCII art signature is stored in `hidden-signature.txt` as an easter egg.

---

## Architecture & Services

ComplianceIQ is organized as a front-end application that interacts with backend APIs hosted at `CONFIG.API_BASE_URL`. Key services include:

- **OCRService:** Extracts data from uploaded PDF/EMS files.
- **PredictiveModelService:** Performs AI-led analysis to predict approval probability and assess individual estimate components.
- **ValidationService:** Validates the extracted data (labor, parts, operations) and provides error/warning messages.
- **EstimateStorageService:** Sends file uploads along with metadata to the backend for persistent storage.
- **QueueService:** Manages and refreshes the review queue.
- **ErrorHandler & NotificationService:** Handle errors and user notifications throughout the application.
- **UIState & DashboardController:** Manage routing, state updates, and the overall application flow.
- **Auto-Correction and Learning Feedback:** Provides mechanisms for the application to learn from user actions and correct errors.

---

## Project Structure

```
ComplianceIQ/
├── config.js
├── utils.js
├── error-handler.js
├── validation-service.js
├── ocr-service.js
├── predictive-model.js
├── compliance-service.js
├── auto-correction-impl.js
├── estimate-processor.js
├── ui-state.js
├── queue-service.js
├── learning-feedback-service.js
├── real-time-validation.js
├── services.js
├── feedback.js
├── template-service.js
├── estimate-detail-service.js
├── dashboard.js
├── estimate-workflow.js
├── dashboard-controller.js
├── notification-service.js
├── estimate-storage-service.js
├── login.html
├── login.js
├── dashboard.html
├── dashboard.css
└── hidden-signature.txt
```

---

## User Flow

1. **Login:**  
   - The user accesses `login.html`, enters their credentials, and upon successful authentication, is redirected to the dashboard.

2. **Dashboard Navigation:**  
   - The user navigates between sections using the sidebar (Upload, AI Analysis, Compliance, Review Queue, Estimate Detail).  
   - Modern transitions display content in a card-based layout.

3. **Estimate Upload & Processing:**  
   - Users can drag and drop a file or select a file to upload.  
   - The uploaded file is processed using the OCRService to extract data, followed by AI analysis via PredictiveModelService.  
   - Validation is carried out using the ValidationService.  
   - Once validated, the file and its metadata are stored using EstimateStorageService, and the review queue is updated.

4. **Review & Final Actions:**  
   - The review queue lists all submitted estimates.
   - Detailed views allow users to scrutinize labor, parts, operations, and review recommendations.
   - The user finalizes decisions (approve/reject) using action buttons, and the system updates the backend accordingly.

5. **Notifications & Updates:**  
   - Real-time notifications provide feedback and status updates.
   - Errors and issues are managed centrally via the ErrorHandler.

---

## Next Steps

While ComplianceIQ is feature-complete for its initial release, here are some planned enhancements for future updates:

- **Backend Authentication Integration:**  
  Integrate a robust, secure authentication system on the backend.

- **Enhanced OCR Accuracy:**  
  Improve OCR extraction through advanced training datasets and integration with third-party OCR engines.

- **Cloud Storage Integration:**  
  Transition file storage to a scalable cloud solution (e.g., AWS S3, Google Cloud Storage).

- **Expanded Compliance Framework:**  
  Add additional industry-specific compliance checks and customizable parameters.

- **Improved Auto-Correction:**  
  Expand the auto-correction logic with machine learning improvements and advanced feedback loops.

- **User Personalization:**  
  Introduce user preferences (e.g., dark mode, custom dashboards) for a more personalized experience.

- **Analytics Dashboard:**  
  Build a dashboard to track usage, processing times, success rates, and compliance metrics for continuous improvement.

- **Documentation & Help:**  
  Expand help and documentation sections within the app to assist new users.

---

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://your.repo.url/ComplianceIQ.git
   cd ComplianceIQ
   ```

2. **Install Dependencies:**  
   *(Depending on your project setup – if using Node.js for a build tool, run `npm install` or `yarn install`.)*

3. **Configure the Project:**  
   - Update `config.js` with the appropriate API endpoints and settings.
   - Set up the backend services to accept file uploads, authentication, and analysis requests.

4. **Run the Application:**  
   - Use your local web server to host static files (e.g., `live-server` or similar tools).  
   - Ensure the backend service endpoints are running and accessible.

5. **Push Changes:**

   ```bash
   git add .
   git commit -m "Setup ComplianceIQ with modern UI and full functionality"
   git push origin main
   ```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements or bug fixes. Ensure you follow the coding guidelines outlined in the documentation.

---

## License

This project is licensed under the [MIT License](LICENSE).

**Proprietary Notice:** ComplianceIQ is a proprietary concept for The Crash Co. by Ali J.

---

*Hidden within the repository is a signature file (`