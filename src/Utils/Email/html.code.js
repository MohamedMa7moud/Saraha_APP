export const template = (code, firstName, subject) =>
  `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
        .header h1 { color: #333333; }
        .content { padding: 20px 0; text-align: center; }
        .otp-code { font-size: 2em; font-weight: bold; color: #007bff; margin: 20px 0; padding: 10px 20px; background-color: #e9f5ff; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; color: #777777; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${subject}</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName} Your verification code is:</p>
            <div class="otp-code"> ${code} </div>
            <p>This code expires in ${10} minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; Saraha_App</p>
        </div>
    </div>
</body>
</html>`;
