import { LightningElement } from 'lwc';
import getProperty from '@salesforce/apex/Propertycontroller.getProperties';
export default class PropertyListView extends LightningElement {

    properties;
    filter = {
        maximum_price: '',
        Availability_Status: '',
        Furnishing_Status:'',
        distance:'',
    }

    Availability_Status_Options = [
        { label: 'Available', value: 'Available' },
        { label: 'Occupied', value: 'Occupied' }
    ];

    Furnishing_Status_Options = [
        { label: 'Furnished', value: 'Furnished' },
        { label: 'Semi-Furnished', value: 'Semi-Furnished' },
        { label: 'Unfurnished', value: 'Unfurnished' }
    ];


    connectedCallback()
    {
        this.getProperties();
    }

    handleFilter()
    {
        this.getProperties();
    }

    getProperties()
    {
        getProperty({filterInfo:JSON.stringify(this.filter)}).then(result => {
            this.properties = [...result];
        })
        .catch(error => {
            console.log(error);
        })
    }


    handleStatusChange(event)
    {
        this.filter.Availability_Status = event.target.value;
    }
    handleFurnishingStatusChange(event)
    {
        this.filter.Furnishing_Status = event.target.value;
    }
    handlePriceChange(event)
    {
        this.filter.maximum_price = event.target.value;
    }
    handleDistanceChange(event)
    {
        this.filter.distance = event.target.value;
    }

}