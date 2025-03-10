public with sharing class filecontroller {
    
    @AuraEnabled
    public static List<FileWrapper> getDocPreview(List<id> contentdocumentIds){

        Set<Id> contentDocIdSet = new Set<Id>(contentdocumentIds);

        List<ContentVersion> contentVersionList = [SELECT Id, FileType,ContentDocument.Title,ContentDocumentId,ContentDocument.LatestPublishedVersion.VersionDataUrl
            FROM ContentVersion
            WHERE ContentDocumentId IN : contentDocIdSet AND IsLatest = true];

        List<FileWrapper> fileWrapList = new List<FileWrapper>();

        for(ContentVersion cv : contentVersionList)
        {
            FileWrapper fileWrap = new FileWrapper();
            fileWrap.Id = cv.ContentDocumentId;
            fileWrap.URL = cv.ContentDocument.LatestPublishedVersion.VersionDataUrl;
            fileWrap.fileName = cv.ContentDocument.Title+'.'+cv.FileType.toLowerCase();
            fileWrapList.add(fileWrap);
        }

        return fileWrapList;
    }


    @AuraEnabled
    public static string removefiles(String docId)
    {
        try {
            
            ContentDocument doc = [SELECT Id FROM ContentDocument WHERE Id = :docId];
            delete doc;
        } 
        catch (Exception e) 
        {
            return 'error';
        }
        return 'sucesss';
    }


    public class FileWrapper{
        @AuraEnabled
        public string URL;
        @AuraEnabled
        public string Id;
        @AuraEnabled
        public string fileName;
    }
}