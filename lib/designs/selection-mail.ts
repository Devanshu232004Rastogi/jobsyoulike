export const SelectedTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next Round Invitation</title>
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
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
            border-left: 4px solid #4CAF50;
            padding-left: 20px;
            margin-bottom: 30px;
        }
        h2 {
            color: #4CAF50;
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
            background-color: #e8f5e9;
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
            color: #4CAF50;
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
            color: #4CAF50;
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
                <h2>Congratulations, {{name}}!</h2>
                
                <p>We are excited to inform you that you have been selected to proceed to the next round of our interview process.</p>
                
                <div class="highlight">
                    <p>Your impressive profile has caught our attention, and we believe you could be a great fit for our team.</p>
                </div>
                
                <p>Next Steps:</p>
                <ul>
                    <li>A representative will contact you shortly to schedule your interview</li>
                    <li>Please prepare to discuss your experience and skills</li>
                    <li>Have any relevant work samples ready</li>
                </ul>
                
                <p>We look forward to getting to know you better and exploring how your skills align with our organization.</p>
                
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