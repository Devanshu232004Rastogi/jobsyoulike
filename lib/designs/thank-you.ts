export const ThankYouTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Confirmation</title>
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
            background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
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
            border-left: 4px solid #9d50bb;
            padding-left: 20px;
            margin-bottom: 30px;
        }
        h2 {
            color: #6e48aa;
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
            background-color: #f2eafb;
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
            color: #6e48aa;
            font-size: 16px;
        }
        .email-footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #888;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #6e48aa;
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
                
                <p>Thank you for taking the time to apply through JobsYouLike. We appreciate your interest in joining our partner's team and considering them as a potential employer.</p>
                
                <div class="highlight">
                    <p>Your application has been successfully received and will be carefully reviewed. We understand the effort that goes into applying for a job, and we want to assure you that your application will be given thorough consideration.</p>
                </div>
                
                <p>We will be in touch soon to update you on the status of your application or to schedule any necessary next steps in the hiring process. In the meantime, if you have any questions or need further information, please don't hesitate to reach out to us.</p>
                
                <p>We look forward to potentially connecting you with your dream job and wish you the best of luck in your job search.</p>
                
                
                <div class="signature">
                    <p>Best regards,</p>
                    <p class="team-name">Team JobsYouLike</p>
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
