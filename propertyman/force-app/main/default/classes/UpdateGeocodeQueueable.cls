public class UpdateGeocodeQueueable implements Queueable, Database.AllowsCallouts {
        private Id propertyId;
        private String address;

        public UpdateGeocodeQueueable(Id propertyId, String address) {
            this.propertyId = propertyId;
            this.address = address;
        }

        public void execute(QueueableContext context) {
            try {
                Map<String, Object> options = new Map<String, Object>{
                    'version' => '1',
                    'address' => this.address
                };
                
                // Perform geocoding callout
                Map<String, Object> response = maps.API.Geocode(options);
                Map<String, Object> data = (Map<String, Object>) response.get('data');
                Map<String, Object> position = (Map<String, Object>) data.get('position');
                
                // Update property with coordinates
                Property__c prop = new Property__c(
                    Id = this.propertyId,
                    GeoLocation__latitude__s = (Decimal) position.get('lat'),
                    GeoLocation__longitude__s = (Decimal) position.get('lng')
                );
                update prop;
            } catch (Exception e) {
                // Handle exceptions or log errors
                System.debug('Geocoding error: ' + e.getMessage());
            }
        }
}