import { customAlphabet } from 'nanoid';

// Create a URL-safe token generator
const generateToken = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 32);

export const createInviteToken = () => generateToken();

export const formatEmailBody = (inviteUrl: string, workflowTitle: string) => `
You've been invited to join the "${workflowTitle}" workflow.

Click the following link to access your workflow:
${inviteUrl}

This link is unique to you and should not be shared.
`;

export const sendInviteEmail = async (email: string, inviteUrl: string, workflowTitle: string) => {
  // For demo purposes, we'll just log the email
  console.log('Sending invite email to:', email);
  console.log('Invite URL:', inviteUrl);
  console.log('Email body:', formatEmailBody(inviteUrl, workflowTitle));
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};