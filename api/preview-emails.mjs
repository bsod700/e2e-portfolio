import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { clientConfirmationTemplate, adminNotificationTemplate } from './templates/email-templates.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample data for client confirmation email
const clientSampleData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  message: 'Project Description: Creating a modern e-commerce website\n\nProject Type(s): Website, AI automation'
};

// Sample data for admin notification email
const adminSampleData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  message: 'Project Description: Creating a modern e-commerce website\n\nProject Type(s): Website, AI automation',
  submittedAt: new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
};

// Generate client confirmation email preview
const clientEmailHTML = clientConfirmationTemplate(clientSampleData);
const clientPreviewPath = join(__dirname, 'preview-client-email.html');
writeFileSync(clientPreviewPath, clientEmailHTML);
console.log('✅ Client confirmation email preview created:', clientPreviewPath);

// Generate admin notification email preview
const adminEmailHTML = adminNotificationTemplate(adminSampleData);
const adminPreviewPath = join(__dirname, 'preview-admin-email.html');
writeFileSync(adminPreviewPath, adminEmailHTML);
console.log('✅ Admin notification email preview created:', adminPreviewPath);

// Generate a combined preview page
const combinedPreviewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Templates Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f4f4f5;
    }
    .preview-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .preview-section {
      margin-bottom: 60px;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .preview-section h2 {
      margin-top: 0;
      color: #141313;
      border-bottom: 2px solid #df563e;
      padding-bottom: 10px;
    }
    .email-frame {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-top: 20px;
    }
    iframe {
      width: 100%;
      border: none;
      display: block;
    }
    .controls {
      margin-bottom: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .controls label {
      display: block;
      margin-bottom: 10px;
      font-weight: 600;
      color: #374151;
    }
    .controls input, .controls textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .controls textarea {
      min-height: 80px;
      resize: vertical;
    }
    .controls button {
      background-color: #df563e;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
    .controls button:hover {
      background-color: #c94a3a;
    }
    .info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .info p {
      margin: 5px 0;
      color: #1e40af;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <h1 style="text-align: center; color: #141313; margin-bottom: 40px;">Email Templates Preview</h1>
    
    <div class="info">
      <p><strong>📧 How to preview:</strong></p>
      <p>1. Open the individual HTML files in your browser</p>
      <p>2. Or use the preview frames below</p>
      <p>3. Adjust the browser window size to see mobile/desktop views</p>
    </div>

    <!-- Client Confirmation Email -->
    <div class="preview-section">
      <h2>Client Confirmation Email</h2>
      <p style="color: #6b7280; margin-bottom: 20px;">Sent to clients who submit the contact form</p>
      <div class="email-frame">
        <iframe src="preview-client-email.html" height="1200" title="Client Confirmation Email"></iframe>
      </div>
      <div style="margin-top: 15px;">
        <a href="preview-client-email.html" target="_blank" style="color: #df563e; text-decoration: none; font-weight: 600;">Open in new tab →</a>
      </div>
    </div>

    <!-- Admin Notification Email -->
    <div class="preview-section">
      <h2>Admin Notification Email</h2>
      <p style="color: #6b7280; margin-bottom: 20px;">Sent to gt@guytagger.com when someone submits the contact form</p>
      <div class="email-frame">
        <iframe src="preview-admin-email.html" height="1000" title="Admin Notification Email"></iframe>
      </div>
      <div style="margin-top: 15px;">
        <a href="preview-admin-email.html" target="_blank" style="color: #df563e; text-decoration: none; font-weight: 600;">Open in new tab →</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

const combinedPreviewPath = join(__dirname, 'preview-emails.html');
writeFileSync(combinedPreviewPath, combinedPreviewHTML);
console.log('✅ Combined preview page created:', combinedPreviewPath);
console.log('\n📧 Preview files generated successfully!');
console.log('\nTo view the previews:');
console.log('1. Open preview-emails.html in your browser (shows both emails)');
console.log('2. Or open preview-client-email.html for client email');
console.log('3. Or open preview-admin-email.html for admin email');
console.log('\n💡 Tip: Resize your browser window to see mobile/desktop responsive views');

