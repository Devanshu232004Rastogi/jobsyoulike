export const RejectedTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-wrapper {
            max-width: 650px;
            margin: 20px auto;
            background-color: #ffffff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            padding: 30px;
            text-align: center;
        }
        .email-header img {
            max-width: 220px;
            height: auto;
        }
        .email-body {
            padding: 40px 30px;
        }
        .container {
            border-left: 4px solid #f44336;
            padding-left: 20px;
            margin-bottom: 30px;
        }
        h2 {
            color: #f44336;
            margin-top: 0;
            font-size: 22px;
            font-weight: 600;
        }
        p {
            margin-bottom: 16px;
            color: #555;
            font-size: 15px;
        }
        .highlight {
            background-color: #ffebee;
            padding: 15px 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
        }
        .signature p {
            margin-bottom: 5px;
        }
        .team-name {
            font-weight: bold;
            color: #f44336;
            font-size: 16px;
        }
        .email-footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #888;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #f44336;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <img src="https://drive.google.com/thumbnail?id=1PtdkRTPEKmLGbjrW-cE9uUWr4VrXNqy-&sz=w1000" alt="JobsYouLike Logo">
        </div>
        
        <div class="email-body">
            <div class="container">
                <h2>Dear {{name}},</h2>
                
                <p>We appreciate the time and effort you put into your application.</p>
                
                <div class="highlight">
                    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
                </div>
                
                <p>We encourage you to:</p>
                <ul>
                    <li>Continue developing your skills</li>
                    <li>Keep an eye on our future opportunities</li>
                    <li>Stay positive and persistent in your job search</li>
                </ul>
                
                <p>We genuinely appreciate your interest in our organization.</p>
                
                <div class="signature">
                    <p>Best regards,</p>
                    <p class="team-name">Hiring Team at JobsYouLike</p>
                    <p>Your Career Partner</p>
                </div>
            </div>
        </div>
        
        <div class="email-footer">
            <p>© 2025 JobsYouLike. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@jobsyoulike.com</p>
            <div class="social-links">
                <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">LinkedIn</a> | <a href="#">Instagram</a>
            </div>
        </div>
    </div>
</body>
</html>`;