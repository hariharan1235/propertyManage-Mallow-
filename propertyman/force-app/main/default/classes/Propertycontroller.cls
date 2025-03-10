public with sharing class Propertycontroller 
{
    @AuraEnabled
    public static string createProperty(String propertyDetails,List<Id> propertyImgIds)
    {
        try 
        {
            Map<String, Object> propertyData = (Map<String, Object>) JSON.deserializeUntyped(propertyDetails);
            Property__c property = new Property__c();

            property.Property_Name__c = (String)propertyData.get('propertyname');
            property.Rent__c = Integer.valueOf((String)propertyData.get('rent'));
            property.Furnishing_Status__c = (String)propertyData.get('FurnishingStatus');
            property.Type__c = (String)propertyData.get('Type');
            property.Status__c = (String)propertyData.get('Status');
            property.Description__c = (String)propertyData.get('Description');
            property.Address__c = (String)propertyData.get('Address');
            property.City__c = (String)propertyData.get('City');
            property.Country__c = (String)propertyData.get('Country');
            property.State__c = (String)propertyData.get('State');
            property.Postal_Code__c = (String)propertyData.get('PostalCode');

            insert property;

            List<ContentDocumentLink> links = new List<ContentDocumentLink>();

            for (Id docId : propertyImgIds) 
            {
                ContentDocumentLink link = new ContentDocumentLink();
                link.ContentDocumentId = docId;
                link.LinkedEntityId = property.id; 
                link.ShareType = 'V';  
                link.Visibility = 'AllUsers'; 

                links.add(link); 
            }
            
            insert links;
            
            String wholeAddress = property.Address__c+', '+property.City__c+', '+property.State__c+' '+property.Postal_Code__c+' '+property.Country__c;
        
            System.enqueueJob(new UpdateGeocodeQueueable(property.Id, wholeAddress));
     
            return 'success';
       } 
       catch (Exception e) 
       {
           return 'error';
       }
    }
    
    @AuraEnabled
    public static List<Property__c> getProperties(String filterInfo)
    {
        Map<String, Object> propertyData = (Map<String, Object>) JSON.deserializeUntyped(filterInfo);
        
        String status = (String) propertyData.get('Availability_Status');
        String rent = (String) propertyData.get('maximum_price');
        String furnishingStatus = (String) propertyData.get('Furnishing_Status');
        String distance = (String) propertyData.get('distance');
        Integer price;
        Integer maxDistance;
        // Write dynamic conditions
        String query = 'SELECT Id,Property_Name__c,State__c,Address__c,GeoLocation__c,City__c,Country__c,Furnishing_Status__c,Rent__c,Status__c,Postal_Code__c,Description__c FROM Property__c';
        String whereCondition = '';
        User currentUser = [SELECT location__c FROM User WHERE Id = :UserInfo.getUserId()];
        Location userGeo = currentUser.Location__c;
        if(status != '')
        {
            whereCondition = 'Status__c = \''+status+'\'';
        }
        if(rent != '')
        {
            if (whereCondition != '')
            { 
        		whereCondition += ' AND ';
    		}
            price = Integer.valueOf(rent);
            whereCondition += 'Rent__c <= '+price+'';
        }
        
        if(furnishingStatus != '')
        {
            if (whereCondition != '') 
            { 
        		whereCondition += ' AND ';
    		}
            whereCondition += 'Furnishing_Status__c = \''+furnishingStatus+'\'';
        }
        if(distance != '')
        {
            if (whereCondition != '') 
            { 
        		whereCondition += ' AND ';
    		}
            
            maxDistance = Integer.valueOf(distance);
            
            whereCondition += 'DISTANCE(GeoLocation__c, :userGeo, \'km\') < :maxDistance';
        }
        
        if(whereCondition != '')
        {
            query += ' WHERE '+whereCondition; 
        }
        
        List<Property__c> properties = Database.query(query);
        
        return properties;
        
    }
    
}