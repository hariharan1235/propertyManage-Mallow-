import { LightningElement } from 'lwc';
import jsPDFLibrary from '@salesforce/resourceUrl/jsPDFLibrary';
import { loadScript } from 'lightning/platformResourceLoader';

export default class CreatePdf extends LightningElement {
    jsPDFInitialized = false; 
    renderedCallback()
    {
            if(!this.jsPDFInitialized){
            this.jsPDFInitialized = true;
            loadScript(this, jsPDFLibrary).then(() => {
                console.log('jsPDF library loaded successfully');
            }).catch((error) => {
                console.log('Error loading jsPDF library', error);
            });
        }
    }
    generatePDF() 
    {
        if(this.jsPDFInitialized)
        {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Rental Agreement', 10, 10);

        // Content
            doc.setFontSize(12);
            doc.text('Terms: The tenant agrees to adhere to all terms outlined in this agreement.', 10, 20);
            doc.text('Agreed Monthly Rent: $1,200', 10, 30);
            doc.text('Start Date: March 15, 2025', 10, 40);
            doc.text('End Date: March 15, 2026', 10, 50);

        // Save the PDF
            doc.save('rental_agreement.pdf');
            
            const pdfBlob = doc.output('blob');

            this.uploadToSalesforce(pdfBlob);
        }
     }
}