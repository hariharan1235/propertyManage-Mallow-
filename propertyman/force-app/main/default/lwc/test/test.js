import { LightningElement } from 'lwc';
export default class Test extends LightningElement {

    previewURL = '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId=068NS00000Ku17ZYAR';

    
    // mapMarkers = [
    //     {
    //         location: {
    //             // Location Information
    //             City: 'Karur',
    //             Country: 'INDIA',
    //             PostalCode: '639007',
    //             State: 'TAMILNADU',
    //             Street: 'Bharathidasan nagar',
    //         },

    //         // For onmarkerselect
    //         value: 'SF1',

    //         // Extra info for tile in list & info window
    //         icon: 'standard:account',
    //         title: 'Julies Kitchen', // e.g. Account.Name
    //         description: 'This is a long description',
    //     },
    //     {
    //         location: {
    //             // Location Information
    //             City: 'Karur',
    //             Country: 'INDIA',
    //             PostalCode: '639007',
    //             State: 'TAMILNADU',
    //             Street: 'Bharathidasan nagar',
    //         },

    //         // For onmarkerselect
    //         value: 'SF2',

    //         // Extra info for tile in list
    //         icon: 'standard:account',
    //         title: 'Tender Greens', // e.g. Account.Name
    //     },
    // ];

    // selectedMarkerValue = 'SF1';

    // handleMarkerSelect(event) {
    //     this.selectedMarkerValue = event.target.selectedMarkerValue;
    // }


    fileUploaded = [];

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles[0].documentId);
         this.fileUploaded = [...this.fileUploaded, uploadedFiles[0].documentId];
    }

}