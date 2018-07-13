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
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");
import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");
import VSS_Common_Contracts = require("VSS/WebApi/Contracts");
import overview = require("./overview");
import ReleaseStatus = require("./release-status");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetStyles();

	VSS.register("TPHealth-ReleaseOverviewWidget", () => {
		const overviewWidget = new OverviewWidget(WidgetHelpers);
		return overviewWidget;
	});
	VSS.notifyLoadSucceeded();
});

export class OverviewWidget {
	constructor(public WidgetHelpers) { }

	public async load(widgetSettings) {
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

	private async showRelease(widgetSettings) {
		const releaseClient = TFS_RM_Client.getClient();
		const context = VSS.getWebContext();
		const overviewData: overview.Overview = new overview.Overview(0, 0, 0);
		const customSettings = JSON.parse(widgetSettings.customSettings.data) as IReleaseOverviewSettings;
		let definitions = await releaseClient.getReleaseDefinitions(context.project.name);

		if (!!customSettings && !!customSettings.selectedDefinitions) {
			definitions = definitions.filter((def) => customSettings.selectedDefinitions.indexOf(def.name) !== -1);
		}
		let showRejectedAsFailed: boolean = true;
		if (!!customSettings) {
			showRejectedAsFailed = customSettings.showRejectedAsFailed;
		}

		const ids = definitions.map((value) => value.id);
		if (ids.length > 0) {
			let allReleases: TFS_RM_Contracts.Release[] = [];

			for (const id of ids) {
				const releaseForDefinition = await releaseClient.getReleases(context.project.id,
					id,
					null, null, null, null, null, null, null, null, 1, null,
					// tslint:disable-next-line:no-bitwise
					TFS_RM_Contracts.ReleaseExpands.Approvals | TFS_RM_Contracts.ReleaseExpands.Environments);

				allReleases = allReleases.concat(releaseForDefinition);

			}

			allReleases.forEach((release) => {
				const status = ReleaseStatus.ReleaseStatus.getStatus(release, showRejectedAsFailed);
				switch (status) {
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
			} else if (overviewData.InProgress > 0) {
				$("#container").addClass("building");
			} else {
				$("#container").addClass("success");
			}
		} else {
			$("#nodata").text("No release definitions found");
		}
	}
}
