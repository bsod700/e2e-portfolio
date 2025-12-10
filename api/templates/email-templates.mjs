/**
 * Parse message to extract project description and project types
 * @param {string} message - The message string
 * @returns {Object} Parsed data with projectDescription and projectType
 */
function parseMessage(message) {
  if (!message) return { projectDescription: '', projectType: '' };
  
  const projectDescMatch = message.match(/Project Description:\s*(.+?)(?:\n\n|$)/i);
  const projectTypeMatch = message.match(/Project Type\(s\):\s*(.+?)(?:\n\n|$)/i);
  
  return {
    projectDescription: projectDescMatch ? projectDescMatch[1].trim() : '',
    projectType: projectTypeMatch ? projectTypeMatch[1].trim() : ''
  };
}

/**
 * Truncate text with ellipsis if exceeds max length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Client Confirmation Email Template
 * Sent to the client who submitted the contact form
 * @param {Object} data - Template data
 * @param {string} data.name - Client name
 * @param {string} data.email - Client email
 * @param {string} data.phone - Client phone
 * @param {string} data.message - Client message
 * @returns {string} HTML email template
 */
export function clientConfirmationTemplate(data) {
  const parsed = parseMessage(data.message || '');
  const projectDescription = parsed.projectDescription || data.projectDescription || '';
  const projectType = parsed.projectType || data.projectType || '';
  const calenderUrl = "https://calendly.com/gt-guytagger/intro-chat-with-guy";
  const url = "https://www.guytagger.com";
  const baseUrl = "https://e2e-portfolio.vercel.app"; // Use Vercel deployment URL for all assets
  
  // Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  const safeName = escapeHtml(truncateText(data.name || '[Name]', 75));
  const safeEmail = escapeHtml(data.email || '');
  const safePhone = escapeHtml(data.phone || '');
  const safeProjectDescription = escapeHtml(truncateText(projectDescription, 200));
  const safeProjectType = escapeHtml(projectType);
  
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Thank You for Contacting Us</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    /* Prevent dark mode inversion for icons */
    img[src*="icons/"] {
      filter: none !important;
      -webkit-filter: none !important;
      color-scheme: light;
      mix-blend-mode: normal !important;
    }
    /* Client-specific styles */
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
      line-height: 100%;
    }
    /* Prevent iOS blue links */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    /* Mobile styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
      }
      .content-cell {
        padding: 20px !important;
      }
      .header-title {
        font-size: 26px !important;
        letter-spacing: -1px !important;
      }
      .logo-img {
        width: 60px !important;
        height: 56px !important;
      }
      .text-large {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      .text-medium {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      .step-icon-cell {
        width: 30px !important;
      }
      .step-icon-img {
        width: 25px !important;
        height: 25px !important;
      }
      .button-cell {
        padding: 10px 0 !important;
      }
      /* Target all paragraph elements for mobile */
      p {
        font-size: 16px !important;
      }
      /* Greeting text */
      td p:first-child {
        font-size: 18px !important;
      }
      /* Step titles */
      .step-title {
        font-size: 16px !important;
      }
      /* Step descriptions */
      .step-description {
        font-size: 14px !important;
      }
      /* CTA button text - make full width on mobile */
      a[style*="background-color: #961416"],
      a[style*="background-color: #141F96"] {
        font-size: 14px !important;
        padding: 12px 16px !important;
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      /* Button container cells - full width on mobile */
      .button-cell {
        padding: 10px 0 !important;
        width: 100% !important;
      }
      .button-cell td {
        width: 100% !important;
        padding: 0 !important;
        text-align: center !important;
      }
      /* Call button mobile container */
      .call-button-mobile {
        width: 100% !important;
      }
      .call-button-mobile a {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      /* Signature and contact links */
      .signature-text {
        font-size: 16px !important;
      }
      .contact-link {
        font-size: 16px !important;
      }
      /* Contact links table - stack vertically on mobile */
      .contact-links-table {
        width: 100% !important;
      }
      .contact-links-table tr {
        display: block !important;
        width: 100% !important;
      }
      .contact-link-cell {
        width: 100% !important;
        display: block !important;
        text-align: left !important;
        padding: 8px 0 !important;
      }
      .contact-link-cell:first-child {
        padding-top: 0 !important;
      }
      /* Footer */
      .footer-text {
        font-size: 11px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #f4f4f5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Thank you for contacting Guy Tagger. We're excited to work with you!
  </div>
  
  <!-- Main email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 24px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #c7c7c7; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td class="header-cell" style="background-color: #141313; padding: 32px 16px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <img src="${baseUrl}/assets/images/logo-symbol.png" alt="Guy Tagger Logo" width="88" height="81" class="logo-img" style="display: block; width: 88px; height: 81px; max-width: 100%; height: auto;">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 class="header-title" style="margin: 0; color: #fcfcfc; font-size: 34px; font-weight: 500; font-family: Arial, Helvetica, sans-serif; letter-spacing: -1.36px;">Great to meet you!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding: 24px 24px 48px; color: #141313;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #141313; font-family: Arial, Helvetica, sans-serif;">Dear ${safeName}</p>
              
              <!-- Intro text -->
              <p class="text-large" style="margin: 0 0 8px 0; font-size: 18px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">Thank you so much for getting in touch through my portfolio website! I'm excited to hear that you're interested in working together.</p>
              <p class="text-large" style="margin: 0 0 24px 0; font-size: 18px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">Here are the details we received:</p>
              
              <!-- Details Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    ${data.name ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 16px 0; border-top: none; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Name:</span> <span style="font-weight: 300; font-style: italic;">${safeName}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${data.email ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Email:</span> <span style="font-weight: 300; font-style: italic; color: #141313 !important; text-decoration: none !important;">${safeEmail}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${data.phone ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Phone:</span> <span style="font-weight: 300; font-style: italic;">${safePhone}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${projectDescription ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Project Description:</span> <span style="font-weight: 300; font-style: italic;">${safeProjectDescription}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${projectType ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Project Type(s):</span> <span style="font-weight: 300; font-style: italic;">${safeProjectType}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <!-- Process intro -->
              <p class="text-large" style="margin: 24px 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;">I'm thrilled about the opportunity to collaborate with you. Here's how we can make it happen:</p>
              
              <!-- Process Steps -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="step-icon-cell" width="40" valign="top" style="padding-right: 16px; vertical-align: top;">
                          <img src="${baseUrl}/assets/images/icons/circle-chat-bubbles.png" alt="Chat Icon" width="40" height="40" class="step-icon-img" style="display: block; width: 40px; height: 40px;">
                        </td>
                        <td valign="top" style="vertical-align: top;">
                          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #141313; font-family: Arial, Helvetica, sans-serif;">Let's Chat!</p>
                          <p class="text-medium" style="margin: 0; font-size: 16px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">We'll start with an initial consultation to discuss your needs, understand your vision, and map out the project.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 16px; line-height: 16px;">&nbsp;</td></tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="step-icon-cell" width="40" valign="top" style="padding-right: 16px; vertical-align: top;">
                          <img src="${baseUrl}/assets/images/icons/circle-document.png" alt="Proposal Icon" width="40" height="40" class="step-icon-img" style="display: block; width: 40px; height: 40px;">
                        </td>
                        <td valign="top" style="vertical-align: top;">
                          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #141313; font-family: Arial, Helvetica, sans-serif;">Proposal Time:</p>
                          <p class="text-medium" style="margin: 0; font-size: 16px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">After our chat, I'll send you a detailed proposal and quote tailored to your specific requirements.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 16px; line-height: 16px;">&nbsp;</td></tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="step-icon-cell" width="40" valign="top" style="padding-right: 16px; vertical-align: top;">
                          <img src="${baseUrl}/assets/images/icons/circle-verify.png" alt="Verify Icon" width="40" height="40" class="step-icon-img" style="display: block; width: 40px; height: 40px;">
                        </td>
                        <td valign="top" style="vertical-align: top;">
                          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #141313; font-family: Arial, Helvetica, sans-serif;">Getting to Work:</p>
                          <p class="text-medium" style="margin: 0; font-size: 16px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">Once the proposal is approved, I'll dive into the project, keeping you updated every step of the way.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 16px; line-height: 16px;">&nbsp;</td></tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="step-icon-cell" width="40" valign="top" style="padding-right: 16px; vertical-align: top;">
                          <img src="${baseUrl}/assets/images/icons/circle-like.png" alt="Like Icon" width="40" height="40" class="step-icon-img" style="display: block; width: 40px; height: 40px;">
                        </td>
                        <td valign="top" style="vertical-align: top;">
                          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #141313; font-family: Arial, Helvetica, sans-serif;">Your Feedback Matters:</p>
                          <p class="text-medium" style="margin: 0; font-size: 16px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">I'll regularly seek your input to make sure everything aligns with your expectations.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 16px; line-height: 16px;">&nbsp;</td></tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="step-icon-cell" width="40" valign="top" style="padding-right: 16px; vertical-align: top;">
                          <img src="${baseUrl}/assets/images/icons/circle-happy.png" alt="Happy Icon" width="40" height="40" class="step-icon-img" style="display: block; width: 40px; height: 40px;">
                        </td>
                        <td valign="top" style="vertical-align: top;">
                          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #141313; font-family: Arial, Helvetica, sans-serif;">Final Touches:</p>
                          <p class="text-medium" style="margin: 0; font-size: 16px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">When you are happy with the results, I'll deliver the final product, ready to impress!</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Text -->
              <p class="text-large" style="margin: 24px 0 16px 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;">Ready to start? Schedule a free consultation using the link below:</p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="button-cell">
                <tr>
                  <td align="left" style="padding: 12px 0;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${calenderUrl}" style="height:44px;v-text-anchor:middle;width:250px;" arcsize="8%" stroke="f" fillcolor="#961416">
                      <w:anchorlock/>
                      <center style="color:#fcfcfc;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;">Schedule a Call with Me</center>
                    </v:roundrect>
                    <![endif]-->
                    <a href="${calenderUrl}" style="display: inline-block; background-color: #961416; color: #fcfcfc !important; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; font-family: Arial, Helvetica, sans-serif; border: 0.5px solid #df563e;">
                      <span style="color: #fcfcfc;">Schedule a Call with Me</span>
                      <img src="${baseUrl}/assets/images/icons/calendar-add.png" alt="Calendar Icon" width="25" height="25" style="vertical-align: middle; margin-left: 8px; display: inline-block; filter: none !important; -webkit-filter: none !important; color-scheme: light; mix-blend-mode: normal !important;">
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Closing -->
              <p class="text-large" style="margin: 48px 0 24px 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;">Looking forward to creating something awesome together!</p>
              
              <!-- Signature -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 48px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;">Best,</p>
                    <p style="margin: 0 0 24px 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;">Guy Tagger</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="contact-links-table">
                      <tr>
                        <td width="50%" align="left" class="contact-link-cell">
                          <a href="https://guytagger.com" style="color: #961416 !important; text-decoration: none !important; font-size: 18px; font-family: Arial, Helvetica, sans-serif;">guytagger.com</a>
                        </td>
                        <td width="50%" align="right" class="contact-link-cell">
                          <a href="mailto:gt@guytagger.com" style="color: #961416 !important; text-decoration: none !important; font-size: 18px; font-family: Arial, Helvetica, sans-serif;">gt@guytagger.com</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Social Icons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom: 48px;">
                <tr>
                  <td style="padding: 0 12px;">
                    <a href="https://www.linkedin.com/in/guytagger/" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                      <img src="${baseUrl}/assets/images/icons/linkedin-gray.png" alt="LinkedIn" width="25" height="25" style="display: block;">
                    </a>
                  </td>
                  <td style="padding: 0 12px;">
                    <a href="https://github.com/bsod700" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                      <img src="${baseUrl}/assets/images/icons/github-gray.png" alt="GitHub" width="25" height="25" style="display: block;">
                    </a>
                  </td>
                  <td style="padding: 0 12px;">
                    <a href="https://slack.com/app_redirect?channel=U0943JCBDPG" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                      <img src="${baseUrl}/assets/images/icons/slack-gray.png" alt="Slack" width="25" height="25" style="display: block;">
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 52px;">
                    <p style="margin: 0; font-size: 12px; color: #141313; font-family: Arial, Helvetica, sans-serif;">© 2025 Guy Tagger Portfolio. All rights reserved.</p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Admin Notification Email Template
 * Sent to gt@guytagger.com when someone submits the contact form
 * @param {Object} data - Template data
 * @param {string} data.name - Client name
 * @param {string} data.email - Client email
 * @param {string} data.phone - Client phone
 * @param {string} data.message - Client message
 * @param {string} data.submittedAt - Submission timestamp
 * @returns {string} HTML email template
 */
export function adminNotificationTemplate(data) {
  const parsed = parseMessage(data.message || '');
  const projectDescription = parsed.projectDescription || data.projectDescription || '';
  const projectType = parsed.projectType || data.projectType || '';
  const calenderUrl = "https://calendly.com/gt-guytagger/intro-chat-with-guy";
  const url = "https://www.guytagger.com";
  const baseUrl = "https://e2e-portfolio.vercel.app"; // Use Vercel deployment URL for all assets
  
  // Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  const safeName = escapeHtml(truncateText(data.name || '', 75));
  const safeEmail = escapeHtml(data.email || '');
  const safePhone = escapeHtml(data.phone || '');
  const safeProjectDescription = escapeHtml(truncateText(projectDescription, 200));
  const safeProjectType = escapeHtml(projectType);
  const safeSubmittedAt = escapeHtml(data.submittedAt || new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }));
  
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>New Contact Form Submission</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    /* Prevent dark mode inversion for icons */
    img[src*="icons/"] {
      filter: none !important;
      -webkit-filter: none !important;
      color-scheme: light;
      mix-blend-mode: normal !important;
    }
    /* Client-specific styles */
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
      line-height: 100%;
    }
    /* Prevent iOS blue links */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    /* Call button - hidden by default, shown on mobile */
    .call-button-mobile {
      display: none !important;
    }
    /* Mobile styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
      }
      .content-cell {
        padding: 20px !important;
      }
      .header-title {
        font-size: 26px !important;
        letter-spacing: -1px !important;
      }
      .logo-img {
        width: 60px !important;
        height: 56px !important;
      }
      .text-large {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      .text-medium {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      .call-button-mobile {
        display: block !important;
        width: 100% !important;
      }
      .call-button-mobile a {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      /* Target all paragraph elements for mobile */
      p {
        font-size: 16px !important;
      }
      /* Greeting text */
      td p:first-child {
        font-size: 18px !important;
      }
      /* Action buttons - make full width on mobile */
      a[style*="background-color: #961416"],
      a[style*="background-color: #141F96"] {
        font-size: 14px !important;
        padding: 12px 16px !important;
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      /* Button container cells - full width on mobile */
      table[role="presentation"][style*="text-align: center"] {
        width: 100% !important;
      }
      table[role="presentation"][style*="text-align: center"] td {
        width: 100% !important;
        padding: 0 0 16px 0 !important;
        text-align: center !important;
      }
      table[role="presentation"][style*="text-align: center"] td:last-child {
        padding-bottom: 0 !important;
      }
      /* Pro tip text */
      .pro-tip {
        font-size: 14px !important;
      }
      /* Timestamp */
      .timestamp {
        font-size: 12px !important;
      }
      /* Contact links table - stack vertically on mobile */
      .contact-links-table {
        width: 100% !important;
      }
      .contact-links-table tr {
        display: block !important;
        width: 100% !important;
      }
      .contact-link-cell {
        width: 100% !important;
        display: block !important;
        text-align: left !important;
        padding: 8px 0 !important;
      }
      .contact-link-cell:first-child {
        padding-top: 0 !important;
      }
      /* Footer */
      .footer-text {
        font-size: 11px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #f4f4f5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    New contact form submission from ${safeName || safeEmail || 'portfolio website'}
  </div>
  
  <!-- Main email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 24px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #c7c7c7; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td class="header-cell" style="background-color: #141313; padding: 32px 16px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <img src="${baseUrl}/assets/images/logo-symbol.png" alt="Guy Tagger Logo" width="88" height="81" class="logo-img" style="display: block; width: 88px; height: 81px; max-width: 100%; height: auto;">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 class="header-title" style="margin: 0; color: #fcfcfc; font-size: 34px; font-weight: 500; font-family: Arial, Helvetica, sans-serif; letter-spacing: -1.36px;">New Lead Alert!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding: 24px 24px 48px; color: #141313;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #141313; font-family: Arial, Helvetica, sans-serif;">Hey Guy</p>
              
              <!-- Intro text -->
              <p class="text-large" style="margin: 0 0 8px 0; font-size: 18px; line-height: 1.6; color: #141313; font-family: Arial, Helvetica, sans-serif;">You have a new opportunity waiting! Here are the details:</p>
              <p class="text-large" style="margin: 0 0 24px 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;"><strong>Contact Information:</strong></p>
              
              <!-- Details Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    ${data.name ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 16px 0; border-top: none; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Name:</span> <span style="font-weight: 300; font-style: italic;">${safeName}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${data.email ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Email:</span> <span style="font-weight: 300; font-style: italic; text-decoration: none !important; color: #141313 !important;">${safeEmail}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${data.phone ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Phone:</span> <span style="font-weight: 300; font-style: italic;">${safePhone}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${projectDescription ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Project Description:</span> <span style="font-weight: 300; font-style: italic;">${safeProjectDescription}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    ${projectType ? `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-top: 1px solid #d5d5d5; font-size: 14px; color: #141313; font-family: Arial, Helvetica, sans-serif;">
                          <span style="font-weight: 500;">Project Type(s):</span> <span style="font-weight: 300; font-style: italic;">${safeProjectType}</span>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <!-- Source Info -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <p class="text-large" style="margin: 0; font-size: 18px; color: #141313; font-family: Arial, Helvetica, sans-serif;"><strong>Source</strong>: Portfolio Website</p>
                  </td>
                </tr>
              </table>
              
              <!-- Action Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; text-align: center;">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    ${data.phone ? `
                    <!-- Mobile Call Button -->
                    <div class="call-button-mobile">
                      <a href="tel:${safePhone}" style="display: inline-block; background-color: #141F96; color: #fcfcfc !important; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; font-family: Arial, Helvetica, sans-serif; border: 0.5px solid #3b82f6; margin-bottom: 16px;">
                        <span style="color: #fcfcfc;">Call</span>
                        <img src="${baseUrl}/assets/images/icons/phone.png" alt="Phone Icon" width="25" height="25" style="vertical-align: middle; margin-left: 8px; display: inline-block; filter: none !important; -webkit-filter: none !important; color-scheme: light; mix-blend-mode: normal !important;">
                      </a>
                    </div>
                    ` : ''}
                    ${data.email ? `
                    <a href="mailto:${safeEmail}?subject=Re: Your inquiry" style="display: inline-block; background-color: #961416; color: #fcfcfc !important; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; font-family: Arial, Helvetica, sans-serif; border: 0.5px solid #df563e;">
                      <span style="color: #fcfcfc;">Reply via Email</span>
                      <img src="${baseUrl}/assets/images/icons/email.png" alt="Email Icon" width="25" height="25" style="vertical-align: middle; margin-left: 8px; display: inline-block; filter: none !important; -webkit-filter: none !important; color-scheme: light; mix-blend-mode: normal !important;">
                    </a>
                    ` : ''}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 24px;">
                    <p style="margin: 0; font-size: 16px; font-style: italic; color: rgba(20, 19, 19, 0.53); font-family: Arial, Helvetica, sans-serif;">Pro Tip: Speed to lead wins deals. Call them within 5 minutes!</p>
                  </td>
                </tr>
              </table>
              
              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-top: 1px solid #e3e3e3;">
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="margin: 0; text-align: center; font-size: 14px; color: rgba(20, 19, 19, 0.53); font-family: Arial, Helvetica, sans-serif;">📅 Submitted on ${safeSubmittedAt}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 48px;">
                    <p style="margin: 0; font-size: 12px; color: #141313; font-family: Arial, Helvetica, sans-serif;">© 2025 Guy Tagger Portfolio. All rights reserved.</p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

