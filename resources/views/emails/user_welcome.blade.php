<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to PNE Homes</title>
    <style>
        /* Modern email-friendly CSS */
        body {
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #1a1a1a;
            line-height: 1.5;
        }
        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .email-header {
            background-color: #2c3e50;
            padding: 24px;
            text-align: center;
            border-bottom: 4px solid #1a2530;
        }
        .email-body {
            padding: 32px 24px;
            border-bottom: 1px solid #eaeaea;
        }
        .email-footer {
            padding: 24px;
            background-color: #f9fafb;
            font-size: 13px;
            color: #6b7280;
            text-align: center;
        }
        .content-block {
            margin-top: 24px;
            padding: 16px;
            background-color: #f8f9fa;
            border-left: 4px solid #2563eb;
            border-radius: 0 4px 4px 0;
        }
        .content-block p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px;">
                <table class="email-container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- Header with Logo -->
                    <tr>
                        <td class="email-header">
                            <img src="{{ $logoCid }}" width="120" alt="Company Logo" style="display: block; margin: 0 auto 16px;">
                            <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">
                                Welcome to PNE Homes
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td class="email-body">
                            <p style="margin: 0 0 16px; font-size: 16px; color: #1a1a1a;">
                                Hello <strong>{{ $user->name }}</strong>,
                            </p>
                            
                            <div class="content-block">
    <p>Welcome to the PNE Homes family – we're beyond excited to start this amazing journey with you!</p>

    <p>Your dream home is about to come to life, and we couldn't be more thrilled to be by your side. So buckle up – this is where the adventure begins!</p>

    <p>We'll be in touch very soon with your first milestone and all the details to get things rolling. In the meantime, feel free to reach out with any ideas or questions – we're here for it all.</p>

    <p>Let's make something incredible together!</p>

    <p style="margin-top: 16px;">
        🔍 You can view your personalized journey and upcoming milestones on our 
        <a href="https://roadmap.pnehomes.com" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">
            Roadmap Dashboard
        </a>.
    </p>
</div>
                            
                            <p style="margin: 24px 0 0; font-size: 16px; color: #1a1a1a;">
                                Best regards,<br>
                                <strong>The PNE Homes Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="email-footer">
                            © {{ date('Y') }} PNE Homes. All Rights Reserved<br>
                            <small style="opacity: 0.8;">This is an automated message, please do not reply</small>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>