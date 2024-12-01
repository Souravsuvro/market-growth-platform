from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.core.config import settings

def send_verification_email(email: str, token: str, is_password_reset: bool = False) -> None:
    """Send verification email using SendGrid."""
    
    if is_password_reset:
        subject = "Reset Your Password"
        link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        content = f"""
        Hello,
        
        You have requested to reset your password. Click the link below to set a new password:
        
        {link}
        
        This link will expire in {settings.EMAIL_TOKEN_EXPIRE_HOURS} hours.
        
        If you did not request this, please ignore this email.
        """
    else:
        subject = "Verify Your Email"
        link = f"{settings.FRONTEND_URL}/email-verification?token={token}"
        content = f"""
        Hello,
        
        Thank you for registering. Please click the link below to verify your email:
        
        {link}
        
        This link will expire in {settings.EMAIL_TOKEN_EXPIRE_HOURS} hours.
        """
    
    message = Mail(
        from_email=settings.SENDGRID_FROM_EMAIL,
        to_emails=email,
        subject=subject,
        plain_text_content=content
    )
    
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # In production, you should log this error properly
