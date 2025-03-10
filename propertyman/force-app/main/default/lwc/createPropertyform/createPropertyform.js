import { LightningElement,wire,track} from 'lwc';
import { getPicklistValuesByRecordType,getObjectInfo } from "lightning/uiObjectInfoApi";
import PROPERTY_OBJECT from '@salesforce/schema/Property__c'; 

import COUNTRY_FIELD from '@salesforce/schema/Property__c.Country__c';
import STATE_FIELD from '@salesforce/schema/Property__c.State__c';
import CITY_FIELD from '@salesforce/schema/Property__c.City__c'; 

import FURTNSHING_STATUS_FIELD from '@salesforce/schema/Property__c.Furnishing_Status__c';
import STATUS_FIELD from '@salesforce/schema/Property__c.Status__c';
import TYPE_FIELD from '@salesforce/schema/Property__c.Type__c';

import getDocPreview from '@salesforce/apex/filecontroller.getDocPreview';
import removedoc from '@salesforce/apex/filecontroller.removefiles';
import createProperty from '@salesforce/apex/Propertycontroller.createProperty';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CreatePropertyform extends LightningElement {

    
    errorMessage = '';
    isload = false;
    formData = {
        propertyname: '',
        rent: '',
        FurnishingStatus:'',
        State:'',
        City:'',
        Address:'',
        Status:'',
        Type:'',
        Country:'',
        Description:'',
        PostalCode:''
    };

   defaultRecordTypeId;

   //Picklist options
   COUNTRY_OPTIONS;
   STATE_OPTIONS;
   CITY_OPTIONS;
   FURNISHING_STATUS_OPTIONS;
   STATUS_OPTIONS;
   TYPE_OPTIONS;
   ALL_CITY_OPTIONS;

   @wire(getObjectInfo, { objectApiName: PROPERTY_OBJECT })
   objectInfoHandler({ data, error }) {
        if (data) 
        {
            this.defaultRecordTypeId = data.defaultRecordTypeId;
            console.log('Default Record Type ID:', this.defaultRecordTypeId);
        }
        else if (error) 
        {
            console.error('Error fetching object info:', error);
        }
    }

    @wire(getPicklistValuesByRecordType, {objectApiName: PROPERTY_OBJECT,recordTypeId: '$defaultRecordTypeId'})
    picklistValuesHandler({ data, error }) {
        if (data) 
        {
            this.COUNTRY_OPTIONS = data.picklistFieldValues[COUNTRY_FIELD.fieldApiName].values;
            this.STATE_OPTIONS = data.picklistFieldValues[STATE_FIELD.fieldApiName].values;
            this.CITY_OPTIONS = data.picklistFieldValues[CITY_FIELD.fieldApiName].values;
            this.FURNISHING_STATUS_OPTIONS = data.picklistFieldValues[FURTNSHING_STATUS_FIELD.fieldApiName].values;
            this.STATUS_OPTIONS = data.picklistFieldValues[STATUS_FIELD.fieldApiName].values;
            this.TYPE_OPTIONS = data.picklistFieldValues[TYPE_FIELD.fieldApiName].values;

        } else if (error) {
            console.error('Error fetching picklist values:', error);
        }
    }


    // Files 

    fileUploadedIds = [];

    uploadedfilesInfo = [];

    get acceptedFormats() {
        return ['.jpg', '.png','.pdf'];
    }

    handleUploadFinished(event) 
    {
        const uploadedFiles = event.detail.files;
        // alert('No. of files uploaded : ' + uploadedFiles[0].documentId);
        this.fileUploadedIds = [...this.fileUploadedIds, uploadedFiles[0].documentId];
        this.getDocumentInfo();
    }

    getDocumentInfo()
    {
        getDocPreview({contentdocumentIds: this.fileUploadedIds})
         .then(result => {
             this.uploadedfilesInfo = [...result]
             console.log(JSON.stringify(result));
         })
         .catch(error => {
             console.log(error);
         });
    }

    removefiles(event)
    {
        const docId = event.target.closest('.remove').dataset.value;

        this.isload = true;

        removedoc({docId : docId}).then(result => {
           if(result == 'sucesss')
           {
              this.fileUploadedIds = this.fileUploadedIds.filter(item => item !== docId);
              this.uploadedfilesInfo = this.uploadedfilesInfo.filter(item => item.Id !== docId);
           }
        })
        .catch(error => {
            console.log(error);
        })
        this.isload = false;
    }

    // Input changes
    handlePropertyChange(event){
        this.formData.propertyname = event.target.value;
    }
    handleRentChange(event){
        this.formData.rent = event.target.value;
    }
    handleFurnishingStatusChange(event){
        this.formData.FurnishingStatus = event.target.value;
    }
    handleTypeChange(event){
        this.formData.Type = event.target.value;
    }
    handleStatusChange(event){
        this.formData.Status = event.target.value;
    }
    handleCountryChange(event){
        this.formData.Country = event.target.value;
    }
    handleStateChange(event){
        this.formData.State = event.target.value;
    }
    handleCityChange(event){
        this.formData.City = event.target.value;
    }
    handleAddressChange(event){
        this.formData.Address = event.target.value;
    }
    handleDescriptionChange(event)
    {
        this.formData.Description = event.target.value;
    }
    handlePostalCodeChange(event){
        this.formData.PostalCode = event.target.value;
    }

    createProperty(){

        

        const propertyDetails = [
            "propertyname",
            "rent",
            "FurnishingStatus",
            "Type",
            "Status",
            'Description',
            "Address",
            "City",
            "Country",
            "State",
            "PostalCode"
        ];

        for(let i = 0;i<propertyDetails.length;i++)
        {
            if(this.formData[propertyDetails[i]] == '')
            {
                this.errorMessage ='* '+ propertyDetails[i]+ ' should not be empty';
                return
            }
        }
        if(this.fileUploadedIds.length == 0)
        {
            this.errorMessage = '* Please upload atleast one file';
            return;
        }

        this.errorMessage = '';

        createProperty({propertyDetails:JSON.stringify(this.formData),propertyImgIds:this.fileUploadedIds}).then(result => {

            if(result == 'success')
            {
               this.showSuccessToast();
            }
            else if(result == 'error')
            {
                alert('error');
            }
            // this.isload = false;
            
        }).catch(error => {
            console.log(error);
            // this.isload = false;
        }).finally(() => {
            this.isload = false; // Hide the spinner AFTER response is received
        });

    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'Your record has been saved successfully.',
            variant: 'success', // success, error, warning, info
            mode: 'dismissable' // dismissable, sticky, pester
        });
        this.dispatchEvent(event);
    }

}