<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $stage->email_subject }}</title>
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
            max-width: 600px;
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
                                {{ $stage->email_subject }}
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
                                {!! $content !!}
                            </div>
                            
                            <p style="margin: 24px 0 0; font-size: 16px; color: #1a1a1a;">
                                Best regards,<br>
                                <strong>PNE Homes Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="email-footer">
                            © {{ date('Y') }} All Rights Reserved<br>
                            <small style="opacity: 0.8;">This is an automated message, please do not reply</small>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>