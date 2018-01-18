//---------------------------------------------------------------------
// <copyright file="overview.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript 
//    code for the configuration page for the overview widget.
// </summary>
//---------------------------------------------------------------------
/// <reference path="../node_modules/vss-web-extension-sdk/typings/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />

import VSS_Common_Contracts = require("VSS/WebApi/Contracts");
import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");
import ReleaseStatus = require("./release-status");
import TelemetryClient = require("./TelemetryClient");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
    WidgetHelpers.IncludeWidgetStyles();
    
	VSS.register("TPHealth-ReleaseOverviewWidget", () => {
		var overviewWidget = new OverviewWidget(WidgetHelpers);
		return overviewWidget;
	})
	VSS.notifyLoadSucceeded();
});

class Overview {
	constructor(public Failed: number, public Succeeded: number, public InProgress: number) {
	}
}

export class OverviewWidget {
	constructor(public WidgetHelpers) { }

    public async load(widgetSettings) {
        TelemetryClient.TelemetryClient.getClient().trackPageView("ReleaseOverview");

		this.ShowOverviewData(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async reload(widgetSettings) {
		this.ShowOverviewData(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async ShowOverviewData(widgetSettings) {
		$(".title").text(widgetSettings.name);
	    await this.showRelease(widgetSettings);
	}

	async showRelease(widgetSettings) {
		var releaseClient = TFS_RM_Client.getClient();
		var context = VSS.getWebContext();

		var overviewData: Overview = new Overview(0, 0, 0);
		var customSettings = <IReleaseOverviewSettings>JSON.parse(widgetSettings.customSettings.data);
        var definitions = await releaseClient.getReleaseDefinitions(context.project.name);
        
		if (!!customSettings && !!customSettings.selectedDefinitions) {
			definitions = definitions.filter(def => customSettings.selectedDefinitions.indexOf(def.name) !== -1);
        }
        var showRejectedAsFailed: boolean = true;
        if (!!customSettings) {
            showRejectedAsFailed = customSettings.showRejectedAsFailed;
        }

		var ids = definitions.map(value => { return value.id });
		if (ids.length > 0) {
            var allReleases: TFS_RM_Contracts.Release[] = [];
            
            for (var i = 0; i < ids.length; i++) {
				var releaseForDefinition = await releaseClient.getReleases(context.project.id,
					ids[i],
					null, null, null, null, null, null, null, null, 1, null,
                    TFS_RM_Contracts.ReleaseExpands.Approvals | TFS_RM_Contracts.ReleaseExpands.Environments );

				allReleases = allReleases.concat(releaseForDefinition);
                
            }
            
			allReleases.forEach(release => {
				var status = ReleaseStatus.ReleaseStatus.getStatus(release, showRejectedAsFailed);
				switch(status){
					case TFS_RM_Contracts.DeploymentStatus.InProgress:
						overviewData.InProgress++;
						break;
					case TFS_RM_Contracts.DeploymentStatus.Succeeded:
                        overviewData.Succeeded++;
					    break;
					case TFS_RM_Contracts.DeploymentStatus.Failed:
                        overviewData.Failed++;
					    break;

                }
                
			});

			$("#failed").text(overviewData.Failed);
			$("#inprogress").text(overviewData.InProgress);
			$("#succeeded").text(overviewData.Succeeded);

			$("#container").removeClass("building success fail");

			if (overviewData.Failed > 0) {
				$("#container").addClass("fail");
			}
			else if (overviewData.InProgress > 0) {
				$("#container").addClass("building");
			}
			else {
				$("#container").addClass("success");
			}
		}
		else {
			$("#nodata").text("No release definitions found");
		}
	}
}
