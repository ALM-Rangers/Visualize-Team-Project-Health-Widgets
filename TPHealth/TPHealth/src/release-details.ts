//---------------------------------------------------------------------
// <copyright file="release-details.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript 
//    code for the release details widget.
// </summary>
//---------------------------------------------------------------------
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");
import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");
import ReleaseStatus = require("./release-status");
import TelemetryClient = require("./TelemetryClient");
import Services_Navigation = require("VSS/SDK/Services/Navigation");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetStyles();
	VSS.register("TPHealth-ReleaseDetailsWidget", () => {
		var detailsWidget = new ReleaseDetailsWidget(WidgetHelpers);
		return detailsWidget;
	})
	VSS.notifyLoadSucceeded();
});

export class ReleaseDetailsWidget {

	constructor(public WidgetHelpers) { }

    public async load(widgetSettings) {
        TelemetryClient.TelemetryClient.getClient().trackPageView("ReleaseDetails");

		await this.ShowReleaseDetails(widgetSettings);
        return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async reload(widgetSettings) {
		await this.ShowReleaseDetails(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
    }

	public async ShowReleaseDetails(widgetSettings) {
		var releaseClient = TFS_RM_Client.getClient();
		var context = VSS.getWebContext();

		var customSettings = <IReleaseDetailSettings>JSON.parse(widgetSettings.customSettings.data);

		if (customSettings != null) {
			var releases = await releaseClient.getReleases(context.project.id,
				customSettings.definitionId,
				null, null, null, null, null, null, null, null, 1, null, TFS_RM_Contracts.ReleaseExpands.Environments);
			if (releases.length >= 1) {
				var release = releases[0];
				this.setDetails(release);
				this.setStatus(release, customSettings.showRejectedAsFailed);
				this.setNavigateUrl(release);
			} else {
				this.setNoDetails();
			}
		}
		else {
			this.setNoDetails();
		}
	}
	setNavigateUrl(release: TFS_RM_Contracts.Release) {
		if (release && release._links && release._links.web) {
            VSS.getService(VSS.ServiceIds.Navigation).then((navigationService: Services_Navigation.HostNavigationService) => {
                $("#definitionNavigateUrl").on("click", (e) => {
                    e.preventDefault();
                    navigationService.openNewWindow(release._links.web.href, "");
                });
            });

        }
	}

	setStatus(release: TFS_RM_Contracts.Release, showRejectedAsFailed: boolean) {
		var status = ReleaseStatus.ReleaseStatus.getStatus(release, showRejectedAsFailed);

		switch (status) {
			case TFS_RM_Contracts.DeploymentStatus.InProgress:
				this.setStatusCssClass("building", "build-status-building", "build-definition-name-building");
				break;
			case TFS_RM_Contracts.DeploymentStatus.Succeeded:
				this.setStatusCssClass("success", "build-status-succeeded", "build-definition-name-succeeded");
				break;
			case TFS_RM_Contracts.DeploymentStatus.Failed:
				this.setStatusCssClass("fail", "build-status-failed", "build-definition-name-failed");
				break;

		}
	}	

	setStatusCssClass(root: string, status: string, definitionName: string) {
		var $root = $("#root");
		var $releaseStatus = $("#releaseStatus");
		var $releaseDefinitionName = $("#releaseDefinitionName");

		$root.removeClass("success partial fail building");
		$releaseStatus.removeClass("build-status-succeeded build-status-building build-status-failed");

		$root.addClass(root);
		$releaseStatus.addClass(status);
		$releaseDefinitionName.addClass(definitionName);
	}

	setNoDetails() {
		$("#root").removeClass("success partial fail building");
		$("#root").addClass("no-releases");
		$("#nodata").text("No releases found");
		$("#details").hide();
	}

    setDetails(release: TFS_RM_Contracts.Release) {
		$("#details").show();
		$("#releaseDefinitionName").text(release.releaseDefinition.name);
        $("#releaseName").text(release.name);
        $("#releaseDescription").text(release.description);
        $("#releaseCreatedBy").text(release.createdBy.displayName);
        $("#nodata").hide();

		$("#root").removeClass("no-releases");
		
		if (release.releaseDefinition.name.length > 91) {
			$("#releaseDefinitionName").addClass("reallySmall-text")
		}
	}
}