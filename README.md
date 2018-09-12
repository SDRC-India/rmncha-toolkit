#installation 

Checkout form - http://192.168.1.5/svn/si-rmncha/trunk/mobile-master


Post checkout run npm install within root folder of project from cmd and a node modules folder will
be created

Install pouchdb-server and then run the command pouchdb-server  -p 5984

First running for the system-
 1. in  @class app.compomnets.ts @method initializeAppWork() 

    write following code after @code  let dbSetUpJob = await this.pouchdbService.setDB();

     await this.pouchdbService.writeToDatabase();
      await this.pouchdbService.getDataFromServer()
      await this.pouchdbService.makeMapData()
      await this.pouchdbService.writeDataToJsonFile();

2. After completion of the above process there will be about 830 or more json files in your system download folder.Copy all the downloaded file to assets/data/


3. After completion of step 2 comment all the codes which we had written in step 1. @class app.compomnets.ts @method initializeAppWork()

4. Run the project and you are good to go

# generate apk or ipa file

5. run the command pouchdb-server  -p 5984 in cmd for the folder where you had created the database

6. then open cmd in project folder and run the command @code node dump.js

7. After completion of step 6 one file 'si-rmncha' will be created in root folder of the project

8. move the file from the si-rmncha to www folder

9. No you are ready for generating the apk and ipa file