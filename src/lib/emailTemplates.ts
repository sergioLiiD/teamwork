import { config } from '../config';

export const getInviteEmailTemplate = (inviteUrl: string, workflowTitle: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .email-wrapper {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <h2>You've Been Invited!</h2>
    <p>You've been invited to join the workflow: <strong>${workflowTitle}</strong></p>
    <p>Click the button below to get started:</p>
    <a href="${inviteUrl}" class="button">Join Workflow</a>
    <p>Or copy and paste this link into your browser:</p>
    <p>${inviteUrl}</p>
    <div class="footer">
      <p>This invitation was sent from ${config.APP_NAME}</p>
      <p>If you didn't expect this invitation, you can ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const getNotificationEmailTemplate = (notification: {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .email-wrapper {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <h2>${notification.title}</h2>
    <p>${notification.message}</p>
    ${notification.actionUrl ? `
      <a href="${notification.actionUrl}" class="button">
        ${notification.actionText || 'View Details'}
      </a>
    ` : ''}
    <div class="footer">
      <p>This notification was sent from ${config.APP_NAME}</p>
      <p>You can manage your notification preferences in your account settings.</p>
    </div>
  </div>
</body>
</html>
`;