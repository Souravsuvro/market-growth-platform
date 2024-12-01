from typing import Dict, List
import hubspot
from hubspot.crm.contacts import ApiException
from app.core.config import settings

class HubSpotIntegration:
    def __init__(self):
        self.client = hubspot.Client.create(api_key=settings.HUBSPOT_API_KEY)

    async def get_contacts(self, limit: int = 100) -> Dict:
        """
        Retrieve contacts from HubSpot
        """
        try:
            response = self.client.crm.contacts.basic_api.get_page(
                limit=limit,
                properties=["firstname", "lastname", "email", "company", "lifecycle_stage"]
            )
            
            contacts = []
            for contact in response.results:
                contacts.append({
                    'id': contact.id,
                    'firstname': contact.properties.get('firstname'),
                    'lastname': contact.properties.get('lastname'),
                    'email': contact.properties.get('email'),
                    'company': contact.properties.get('company'),
                    'lifecycle_stage': contact.properties.get('lifecycle_stage')
                })
            
            return {
                'status': 'success',
                'contacts': contacts,
                'total': len(contacts)
            }
        except ApiException as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def get_deals(self, limit: int = 100) -> Dict:
        """
        Retrieve deals from HubSpot
        """
        try:
            response = self.client.crm.deals.basic_api.get_page(
                limit=limit,
                properties=["dealname", "amount", "dealstage", "closedate"]
            )
            
            deals = []
            for deal in response.results:
                deals.append({
                    'id': deal.id,
                    'name': deal.properties.get('dealname'),
                    'amount': deal.properties.get('amount'),
                    'stage': deal.properties.get('dealstage'),
                    'close_date': deal.properties.get('closedate')
                })
            
            return {
                'status': 'success',
                'deals': deals,
                'total': len(deals)
            }
        except ApiException as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def create_contact(self, contact_data: Dict) -> Dict:
        """
        Create a new contact in HubSpot
        """
        try:
            properties = {
                "email": contact_data.get('email'),
                "firstname": contact_data.get('firstname'),
                "lastname": contact_data.get('lastname'),
                "company": contact_data.get('company')
            }
            
            response = self.client.crm.contacts.basic_api.create(
                simple_public_object_input={"properties": properties}
            )
            
            return {
                'status': 'success',
                'contact_id': response.id,
                'properties': response.properties
            }
        except ApiException as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def get_analytics(self) -> Dict:
        """
        Get analytics data from HubSpot
        """
        try:
            # Get various analytics metrics
            contacts_response = self.client.crm.contacts.basic_api.get_page(limit=1)
            deals_response = self.client.crm.deals.basic_api.get_page(limit=1)
            
            analytics = {
                'total_contacts': contacts_response.total,
                'total_deals': deals_response.total
            }
            
            return {
                'status': 'success',
                'analytics': analytics
            }
        except ApiException as e:
            return {
                'status': 'error',
                'message': str(e)
            }
