import { Injectable } from "@angular/core";

@Injectable()
export class MessageServiceProvider {
  get messages() {
    let message: IMessage = {
      underConstruction: "Under construction",
      syncSyccess: "Sync success",
      syncing: "Syncing, please wait...",
      errorInSharingScreen: "Error in sharing screen",
      snapshotViewSharingMessage: "Snapshot view",
      snapshotViewSharingSubject: "Snapshot view",
      comparsionViewSharingMessage: "Comparision View",
      comparsionViewSharingSubject: "Comparision View",
      customViewSharingMessage: "Custom View",
      customViewSharingSubject: "Custom View",
      nitiAyogSharingMessage: "Aspirational View",
      nitiAyogSharingSubject: "Aspirational View",
      noDataToSync: "No data to sync",
      noDataConnectionForIndicator:
        "Active internet connection is required for viewing data for selected Indicators.",
      someOfflineIndicator:
        "Data for some of the indicators can’t be generated due to no internet connectivity. Do you wish to proceed? ",
      thematicProfileMessage: "Thematic Profile",
      thematicProfileSubject: "Thematic Profile",
      geographicalProfileMessage: "Geographical Profile",
      geographicalProfileSubject: "Geographical Profile",
      dataRepositoryMessage: "Data Repository",
      dataRepositorySubjecr: "Data Repository"
    };
    return message;
  }
}
