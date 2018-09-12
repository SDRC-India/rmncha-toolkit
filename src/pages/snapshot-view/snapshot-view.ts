import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { SnpashotProfile } from "./../../enums/SnaphshotProfile";
import { CustomViewServiceProvider } from "./../../providers/custom-view-service/custom-view-service";
import { ComparisonViewAreaFilterPipe } from "./../../pipes/comparison-view-area-filter/comparison-view-area-filter";
import { AreaLevel } from "./../../enums/areaLevel";
import { ComparisonServiceProvider } from "./../../providers/comparison-service/comparison-service";
import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Platform,
  IonicApp,
  Slides
} from "ionic-angular";
import { SnapshotServiceProvider } from "../../providers/snapshot-service/snapshot-service";
import { ConstantServiceProvider } from "../../providers/constant-service/constant-service";
import { UtilServiceProvider } from "../../providers/util-service/util-service";
import { MessageServiceProvider } from "../../providers/message-service/message-service";
import { Content } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-snapshot-view",
  templateUrl: "snapshot-view.html"
})
export class SnapshotViewPage {
  indicatorList: ISnapshotIndicator[];
  stateIndicatorList: ISnapshotIndicator[];
  districtIndicatorList: ISnapshotIndicator[];

  areaText: string;
  showLegend: boolean = false;
  height: any;
  searchQuery: string = "";
  public unregisterBackButtonAction: any;

  sectors: String[] = [];
  stateSectors: String[] = [];
  districtSectors: String[] = [];

  sectorsSet: Set<String> = new Set();

  area: Area[] = [];
  areaLevels: IAreaLevel[] = [];

  areaLevel: IAreaLevel;
  national: IArea;
  state: IArea;
  district: IArea;
  districtState: IArea;
  selectedType: number;
  selectedSector: ISector;

  selectionList: any[] = [];

  selectedList: any;

  @ViewChild("pageSlider")
  pageSlider: Slides;
  @ViewChild(Content)
  content: Content;

  index = 0;

  sectorList: ISector[];
  profileTypes: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private snapshotService: SnapshotServiceProvider,
    public modalCtrl: ModalController,
    private constantService: ConstantServiceProvider,
    private utilService: UtilServiceProvider,
    private messageService: MessageServiceProvider,
    private platform: Platform,
    private app: IonicApp,
    private comparsionServiceProvider: ComparisonServiceProvider,
    public customViewService: CustomViewServiceProvider,
    private screenOrientation: ScreenOrientation
  ) {
    this.screenOrientation.onChange().subscribe(() => {
      setTimeout(() => {
        this.height = this.platform.height() - 120;
      }, 150);
    });
  }

  /**
   *
   *
   * @memberof MapViewChartComponent
   */
  ngOnDestroy() {
    this.screenOrientation
      .onChange()
      .subscribe()
      .unsubscribe();
  }

  ngOnInit() {
    this.profileTypes = SnpashotProfile;
    this.getSectors();
    this.getAreaLevel();
    this.setDefaultArea();
    this.getArea();
    this.height = this.platform.height() - 120;
  }

  async getSectors() {
    let sectors = await this.customViewService.getSector();
    this.sectorList = sectors.slice(0, 5);

    let selectionType = {
      name: "RMNCH+A Snapshot",
      selectionValue: SnpashotProfile.RMNCHA,
      sectorValue: null
    };
    this.selectionList.push(selectionType);
    this.sectorList.forEach(element => {
      selectionType = {
        name: element.sectorName + " Snapshot",
        selectionValue: SnpashotProfile.ThemeWise,
        sectorValue: element
      };
      this.selectionList.push(selectionType);
    });

    selectionType = {
      name: "HMIS Snapshot",
      selectionValue: SnpashotProfile.HMMIS,
      sectorValue: null
    };
    this.selectionList.push(selectionType);

    selectionType = {
      name: "SSV Snapshot",
      selectionValue: SnpashotProfile.SSV,
      sectorValue: null
    };
    this.selectionList.push(selectionType);

    this.selectedList = this.selectionList[0];
    this.selectedType = SnpashotProfile.RMNCHA;
    this.selectedSector = null;
  }

  private getAreaText() {
    // this.areaText = this.snapshotService.getAreaText(this.areaLevel)
    switch (this.areaLevel.level) {
      case AreaLevel.NATIONAL:
        this.areaText = this.national.areaname;
        break;
      case AreaLevel.STATE:
        this.areaText = this.state.areaname;
        break;
      case AreaLevel.DISTRICT:
        this.areaText = this.district.areaname;
        break;
    }
  }

  async getIndicators(areaCode: string, type, sector) {
    let indicatorData = await this.snapshotService.getIndicators(
      areaCode,
      type,
      sector,
      true,
      true
    );
    if (this.areaLevel.level == AreaLevel.NATIONAL) {
      this.indicatorList = indicatorData;
      this.sectorsSet = new Set();
      this.indicatorList.forEach(element => {
        this.sectorsSet.add(element.theme);
      });
      this.sectors = Array.from(this.sectorsSet);
    } else if (this.areaLevel.level == AreaLevel.STATE) {
      this.stateIndicatorList = indicatorData;
      this.sectorsSet = new Set();
      this.stateIndicatorList.forEach(element => {
        this.sectorsSet.add(element.theme);
      });
      this.stateSectors = Array.from(this.sectorsSet);
    } else {
      this.districtIndicatorList = indicatorData;
      this.sectorsSet = new Set();
      this.districtIndicatorList.forEach(element => {
        this.sectorsSet.add(element.theme);
      });
      this.districtSectors = Array.from(this.sectorsSet);
    }

    this.showLegend = true;
  }
  /**
   * This method will help in sharing the screenshot
   * @since 1.0.0
   * @author Ratikanta
   *
   * @memberof SnapshotViewPage
   */
  share() {
    this.utilService.share(
      this.messageService.messages.snapshotViewSharingMessage,
      this.messageService.messages.snapshotViewSharingMessage,
      this.constantService.getConstantObject().domIdSnapshotView
    );
  }


  goToIndicatorView(indicator) {
    this.getAreaText();
    let data: IIndicatorNavParamData = {
      headerText:
       this.areaText +
        " (" +
        indicator.source.sourceName +
        " - " +
        indicator.timePeriod +
        ")",
      snapshotIndicator: indicator,
      showChart: "bar",
      disableView: [],
      type: this.selectedType
    };

    this.navCtrl.push("SnapshotIndicatorViewPage", { data: data });
  }

  async setDefaultArea() {
    await this.snapshotService.setDefaultArea();
  }

  /**
   * Fired when entering a page, after it becomes the active page.
   * Register the hardware backbutton
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  /**
   * This method will initialize the hardware backbutton
   * It will check the status of loadingStatus variable
   * if it is true then customHandleBackButton() will call
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(
      () => {
        if (this.snapshotService.loadingStatus) this.customHandleBackButton();
      },
      10
    );
  }

  /**
   * This method will show a confirmation popup to exit the app, when user click on the hardware back button
   * in the home page
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  private customHandleBackButton(): void {
    const overlayModal = this.app._overlayPortal._views[0];
    if (overlayModal && overlayModal.dismiss) {
      overlayModal.dismiss();
    } else this.navCtrl.setRoot("HomePage");
  }

  /**
   * Fired when you leave a page, before it stops being the active one
   * Unregister the hardware backbutton
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  /**
   *  This method will return all the area level
   */
  async getAreaLevel() {
    let areaLevelData = await this.comparsionServiceProvider.getAreaLevel();
    areaLevelData.forEach(element => {
      if (element.slugidarealevel != AreaLevel.NITIAYOG) {
        this.areaLevels.push(element);
      }
    });

    this.areaLevel = this.areaLevels[0];
  }

  /**
   *  This method will return all the area
   */
  async getArea() {
    this.area = await this.comparsionServiceProvider.getArea();
    this.national = ComparisonViewAreaFilterPipe.prototype.transform(
      this.area,
      this.areaLevel,
      "GLO"
    )[0] as IArea;
    this.getIndicators(
      this.national.code,
      this.selectedType,
      this.selectedSector
    );
  }

  selectTab(index) {
    this.pageSlider.slideTo(index);
    this.content.scrollToTop();
  }

  changeWillSlide($event) {
    this.index = $event._snapIndex;
    this.areaLevel = this.areaLevels[this.index];
    this.content.scrollToTop();
  }

  selectAreaLevel(level) {
    this.areaLevel = level;
  }

  selectArea(area) {
    if (this.areaLevel.isDistrictAvailable) {
      if (this.district) {
        this.getIndicators(
          (this.district as IArea).code,
          this.selectedType,
          this.selectedSector
        );
      } else {
        this.districtIndicatorList = null;
      }
    } else if (this.areaLevel.isStateAvailable) {
      this.getIndicators(
        (this.state as IArea).code,
        this.selectedType,
        this.selectedSector
      );
    }
  }

  async getSnapshotProfile(type: number, sector?: ISector) {
    this.selectedType = type;
    this.selectedSector = sector;
    let done = false;

    if (this.district)
      done = await this.getProfileIndicators(
        this.district as IArea,
        this.selectedType,
        this.selectedSector,
        true,
        false
      );

    if (this.state)
      done = await this.getProfileIndicators(
        this.state as IArea,
        this.selectedType,
        this.selectedSector,
        this.district ? false : true,
        false
      );

    done = await this.getProfileIndicators(
      this.national,
      this.selectedType,
      this.selectedSector,
      this.district || this.state ? false : true,
      true
    );
  }

  async getProfileIndicators(
    area: IArea,
    type,
    sector,
    showLoader,
    hideLoader
  ) {
    let indicatorData = await this.snapshotService.getIndicators(
      area.code,
      type,
      sector,
      showLoader,
      hideLoader
    );
    if (area.actAreaLevel.level == AreaLevel.NATIONAL) {
      this.indicatorList = indicatorData;
      this.sectorsSet = new Set();
      this.indicatorList.forEach(element => {
        this.sectorsSet.add(element.theme);
      });
      this.sectors = Array.from(this.sectorsSet);
    } else if (area.actAreaLevel.level == AreaLevel.STATE) {
      this.stateIndicatorList = indicatorData;
      this.sectorsSet = new Set();
      this.stateIndicatorList.forEach(element => {
        this.sectorsSet.add(element.theme);
      });
      this.stateSectors = Array.from(this.sectorsSet);
    } else {
      this.districtIndicatorList = indicatorData;
      this.sectorsSet = new Set();
      this.districtIndicatorList.forEach(element => {
        this.sectorsSet.add(element.theme);
      });
      this.districtSectors = Array.from(this.sectorsSet);
    }

    this.showLegend = true;

    return true;
  }
}
