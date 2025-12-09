<?php
// Set the content type to JSON
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $postData = file_get_contents('php://input');
    // Decode the JSON data
    $emailData = json_decode($postData, true);

    // Log the received data for debugging purposes
    error_log("Received data: " . print_r($emailData, true));

    // Check if required fields are present
    if (isset($emailData['email']) && isset($emailData['name']) && isset($emailData['looking'])) {
        // Extract the received data
        $email = $emailData['email'];
        $name = $emailData['name'];
        $looking = implode(", ", $emailData['looking']);

        // Construct the path to the HTML email templates
        $userTemplatePath = __DIR__ . '/../assets/email-templates/emailTemplateInline.html';
        $adminTemplatePath = __DIR__ . '/../assets/email-templates/adminEmailTemplate.html';

        // Check if the email template files exist
        if (!file_exists($userTemplatePath)) {
            echo json_encode(['status' => 'error', 'message' => 'User email template not found.']);
            error_log("User email template not found at path: " . $userTemplatePath);
            exit;
        }
        if (!file_exists($adminTemplatePath)) {
            echo json_encode(['status' => 'error', 'message' => 'Admin email template not found.']);
            error_log("Admin email template not found at path: " . $adminTemplatePath);
            exit;
        }

        // Load the HTML email template for the user
        $userTemplate = file_get_contents($userTemplatePath);

        // Check if the user template was successfully loaded
        if ($userTemplate === false) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to load user email template.']);
            error_log("Failed to load user email template from path: " . $userTemplatePath);
            exit;
        }

        // Replace placeholders with actual data in the user template
        $userTemplate = str_replace('{{name}}', $name, $userTemplate);
        $userTemplate = str_replace('{{email}}', $email, $userTemplate);
        $userTemplate = str_replace('{{looking}}', $looking, $userTemplate);

        // Load the HTML email template for the admin
        $adminTemplate = file_get_contents($adminTemplatePath);

        // Check if the admin template was successfully loaded
        if ($adminTemplate === false) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to load admin email template.']);
            error_log("Failed to load admin email template from path: " . $adminTemplatePath);
            exit;
        }

        // Replace placeholders with actual data in the admin template
        $adminTemplate = str_replace('{{name}}', $name, $adminTemplate);
        $adminTemplate = str_replace('{{email}}', $email, $adminTemplate);
        $adminTemplate = str_replace('{{looking}}', $looking, $adminTemplate);

        // Prepare the email headers
        $subject = 'Thank You for Your Request - Guy Tagger\'s Services';
        $headers = 'From: gt@guytagger.com' . "\r\n" .
                   'Reply-To: gt@guytagger.com' . "\r\n" .
                   'X-Mailer: PHP/' . phpversion() . "\r\n" .
                   'Content-Type: text/html; charset=UTF-8';

        // Send the email to the user
        $userMailSent = mail($email, $subject, $userTemplate, $headers);
        
        // Send the email to gt@guytagger.com
        $adminMailSent = mail('gt@guytagger.com', $subject, $adminTemplate, $headers);

        if ($userMailSent && $adminMailSent) {
            echo json_encode(['status' => 'success', 'message' => 'Emails sent successfully.']);
            error_log("Emails sent successfully.");
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to send one or more emails.']);
            error_log("Failed to send one or more emails.");
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input.']);
        error_log("Invalid input: " . print_r($emailData, true));
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
}
?>
