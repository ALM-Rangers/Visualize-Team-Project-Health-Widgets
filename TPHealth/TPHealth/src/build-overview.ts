// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------
import * as tc from "telemetryclient-team-services-extension";
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Client = require("TFS/Build/RestClient");
import VSS_Common_Contracts = require("VSS/WebApi/Contracts");
import Overview = require("./overview");
import telemetryClientSettings = require("./telemetryClientSettings");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetStyles();
	VSS.register("TPHealth-OverviewWidget", () => {
		const overviewWidget = new OverviewWidget(WidgetHelpers);
		return overviewWidget;
	});
	VSS.notifyLoadSucceeded();
});

export class OverviewWidget {
	constructor(public WidgetHelpers) { }

	public async load(widgetSettings) {
		tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("BuildOverview");

		this.ShowOverviewData(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async reload(widgetSettings) {
		this.ShowOverviewData(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async ShowOverviewData(widgetSettings) {
		$(".title").text(widgetSettings.name);
		await this.showBuild(widgetSettings);
	}

	private async showBuild(widgetSettings) {
		const buildClient = TFS_Build_Client.getClient();
		const context = VSS.getWebContext();
		const overviewData: Overview.Overview = new Overview.Overview(0, 0, 0);
		const customSettings = JSON.parse(widgetSettings.customSettings.data) as IOverviewSettings;
		let definitions = await buildClient.getDefinitions(context.project.name);

		if (!!customSettings && !!customSettings.selectedDefinitions) {
			definitions = definitions.filter((def) => customSettings.selectedDefinitions.indexOf(def.name) !== -1);
		}

		const ids = definitions.map((value) => value.id);
		if (ids.length > 0) {
			const builds = await buildClient.getBuilds(context.project.name, ids, null, null, null, null,
				null, null, null, null, null, null, null, null, null, 1);

			builds.forEach((build) => {
				if (build.result === TFS_Build_Contracts.BuildResult.Succeeded) {
					overviewData.Succeeded++;
				} else if (build.result === TFS_Build_Contracts.BuildResult.Canceled) {
					overviewData.Failed++;
				} else if (build.result === TFS_Build_Contracts.BuildResult.Failed) {
					overviewData.Failed++;
				} else if (build.result === TFS_Build_Contracts.BuildResult.PartiallySucceeded) {
					overviewData.Failed++;
				} else if (build.result === TFS_Build_Contracts.BuildResult.None) {
					overviewData.InProgress++;
				} else if (build.status === TFS_Build_Contracts.BuildStatus.InProgress) {
					overviewData.InProgress++;
				} else if (build.status === TFS_Build_Contracts.BuildStatus.NotStarted) {
					overviewData.InProgress++;
				}
			});

			$("#failed").text(overviewData.Failed);
			$("#inprogress").text(overviewData.InProgress);
			$("#succeeded").text(overviewData.Succeeded);

			$("#container").removeClass("building success fail");

			if (overviewData.Failed > 0) {
				$("#container").addClass("fail");
			} else if (overviewData.InProgress > 0) {
				$("#container").addClass("building");
			} else {
				$("#container").addClass("success");
			}
		} else {
			$("#nodata").text("No build definitions found");
		}
	}
}
