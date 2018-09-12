import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, AlertController, ToastController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { UtilServiceProvider } from "../providers/util-service/util-service";
import { PouchdbServiceProvider } from "../providers/pouchdb-service/pouchdb-service";
import { ConstantServiceProvider } from "../providers/constant-service/constant-service";
import { SyncServiceProvider } from "../providers/sync-service/sync-service";
import { HeaderColor } from "@ionic-native/header-color";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = "HomePage";

  customViewTypeSelection: CustomViewTypeSelection;

  pages: Array<{ title: string; component: any }>;

  public counter = 0;

  alert = this.alertController.create({
    enableBackdropDismiss: false,
    buttons: ["OK"]
  });

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private pouchdbService: PouchdbServiceProvider,
    private utilService: UtilServiceProvider,
    private syncService: SyncServiceProvider,
    private constantService: ConstantServiceProvider,
    private alertController: AlertController,
    private headerColor: HeaderColor,
    public toastCtrl: ToastController,
    public fileOpener: FileOpener,
    private file: File
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: "HomePage" },
      { title: "About Us", component: "AboutUsPage" },
      { title: "How to use", component: "" },
      { title: "Geographical Profile", component: "GeographicProfileViewPage" },
      { title: "Thematic Profile", component: "ThematicProfileViewPage" },
      { title: "Snapshot Profile", component: "SnapshotViewPage" },
      {
        title: "Aspirational Districts",
        component: "NitiAyogIndicatorViewPage"
      },
      { title: "Comparative Profile ", component: "ComparisonViewPage" },
      { title: "Data Repository", component: "DataRepositoryPage" },
      { title: "Factsheet ", component: "FactsheetPage" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // let stop status bar overlay webview
      this.headerColor.tint("#2989d8");
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      this.statusBar.backgroundColorByHexString("#208bf7");
      this.splashScreen.hide();

      this.initializeAppWork();

      this.platform.registerBackButtonAction(() => {
        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => {
            this.counter = 0;
          }, 3000);
        } else {
          this.platform.exitApp();
        }
      }, 0);
    });
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Press again to exit",
      duration: 3000,
      cssClass: "exit-toast"
    });
    toast.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component.length) this.nav.setRoot(page.component);
    else this.openFile();
    // console.log(this.nav.getActive());
  }

  ionViewDidEnter() {
    this.counter = 0;
  }

  /**
   * This method will sync data with the server
   * @since 1.0.0
   * @author Ratikanta
   *
   * @memberof MyApp
   */
  sync() {
    // this.utilService.showErrorToast(this.constantService.getConstantObject().underConstruction)
    this.syncService.sync();
  }

  /**
   * This method will open about us page
   * @since 1.0.0
   * @author Ratikanta
   * @memberof MyApp
   */
  openAboutUsPage() {
    this.nav.setRoot("AboutUsPage");
  }

  /**
   * This method is going to do all the app initialization work
   * @author Ratikanta
   * @since 1.0.0   *
   * @memberof MyApp
   */
  async initializeAppWork() {
    this.utilService.showLoader(
      this.constantService.getConstantObject().message_settingUpDatabase
    );
    this.utilService.setDefaults();
    let dbSetUpJob = await this.pouchdbService.setDB();


    if (dbSetUpJob) {
      await this.pouchdbService.setDefaultArea();
      this.utilService.stopLoader();
    } else {
      this.utilService.stopLoader();
      let appFull = this.alertController.create({
        enableBackdropDismiss: false,
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });

      appFull.setTitle("Erorr");
      appFull.setMessage(this.constantService.getConstantObject().memoryFull);
      appFull.present();
    }

    //temp code starts
    // await this.pouchdbService.writeDataToJsonFile();
    // console.log(await this.pouchdbService.compactDb());
    // await this.pouchdbService.writeToDatabase()
    //  await this.pouchdbService.createIndexes()
    //temp code ends
  }

  openFile() {
    if (this.platform.is("cordova")) {
      this.fileOpener
        .open(
          this.file.dataDirectory +
            this.constantService.getConstantObject().userGuidePath,
          "application/pdf"
        )
        .then(() => console.log("File is opened"))
        .catch(e => console.log("Error opening file", e));
    } else {
      window.open('assets/doc/'+this.constantService.getConstantObject().userGuidePath);
    }
  }
}
