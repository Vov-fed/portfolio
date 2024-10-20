<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form fields
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['mail']), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['question']));

    // Validate input
    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        echo "Invalid input. Please fill in all fields and use a valid email.";
        exit;
    }

    // Email configuration
    $to = 'fedorukvladimir94@gmail.com';
    $subject = 'New Contact Form Message';
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Email content
    $body = "You have received a new message from the contact form on your website.\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Message:\n$message\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "Your message was sent successfully!";
    } else {
        echo "There was an issue sending your message. Please try again later.";
    }
} else {
    echo "Form submission error.";
}
?>