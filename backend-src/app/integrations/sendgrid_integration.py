from typing import Dict, List
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from app.core.config import settings

class SendGridIntegration:
    def __init__(self):
        self.client = SendGridAPIClient(settings.SENDGRID_API_KEY)

    async def send_email(self, email_data: Dict) -> Dict:
        """
        Send an email using SendGrid
        """
        try:
            message = Mail(
                from_email=email_data.get('from_email'),
                to_emails=email_data.get('to_email'),
                subject=email_data.get('subject'),
                html_content=email_data.get('content')
            )
            
            response = self.client.send(message)
            
            return {
                'status': 'success',
                'status_code': response.status_code,
                'message': 'Email sent successfully'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def create_marketing_campaign(self, campaign_data: Dict) -> Dict:
        """
        Create a marketing campaign using SendGrid
        """
        try:
            # Create campaign
            campaign = {
                "title": campaign_data.get('title'),
                "subject": campaign_data.get('subject'),
                "sender_id": campaign_data.get('sender_id'),
                "list_ids": campaign_data.get('list_ids', []),
                "html_content": campaign_data.get('content')
            }
            
            response = self.client.client.marketing.campaigns.post(request_body=campaign)
            
            return {
                'status': 'success',
                'campaign_id': response.id,
                'message': 'Campaign created successfully'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def get_email_statistics(self, days: int = 30) -> Dict:
        """
        Get email statistics for the specified number of days
        """
        try:
            query_params = {
                'aggregated_by': 'day',
                'limit': days,
                'offset': 0,
                'start_date': f'{days}daysAgo'
            }
            
            response = self.client.client.stats.get(query_params=query_params)
            
            return {
                'status': 'success',
                'statistics': response.stats
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def create_contact_list(self, list_name: str, contacts: List[Dict]) -> Dict:
        """
        Create a contact list in SendGrid
        """
        try:
            # Create list
            list_response = self.client.client.marketing.lists.post(
                request_body={'name': list_name}
            )
            
            # Add contacts to list
            contacts_data = {
                "list_ids": [list_response.id],
                "contacts": contacts
            }
            
            contact_response = self.client.client.marketing.contacts.put(
                request_body=contacts_data
            )
            
            return {
                'status': 'success',
                'list_id': list_response.id,
                'job_id': contact_response.job_id
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
