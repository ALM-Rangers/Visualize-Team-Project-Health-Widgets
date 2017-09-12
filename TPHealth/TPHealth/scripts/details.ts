//---------------------------------------------------------------------
// <copyright file="details.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript 
//    code for the details widget.
// </summary>
//---------------------------------------------------------------------
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Client = require("TFS/Build/RestClient");
import TelemetryClient = require("./TelemetryClient");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetStyles();
	VSS.register("TPHealth-DetailsWidget", () => {
		var detailsWidget = new DetailsWidget(WidgetHelpers);
		return detailsWidget;
	})
	VSS.notifyLoadSucceeded();
});

class BuildDetails {
	constructor(public status: TFS_Build_Contracts.BuildStatus,
		public result: TFS_Build_Contracts.BuildResult,
		public name: string,
		public queuedBy: string,
		public buildNumber: string,
		public completed: Date,
		public testCoverage: number
	) { }
}

export class DetailsWidget {

	constructor(public WidgetHelpers) {
	}

    public async load(widgetSettings) {
        TelemetryClient.TelemetryClient.getClient().trackPageView("BuildDetails");

		await this.ShowBuildDetails(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async reload(widgetSettings) {
		await this.ShowBuildDetails(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}
	public async ShowBuildDetails(widgetSettings) {
		var buildClient = TFS_Build_Client.getClient();
		var context = VSS.getWebContext();

		var customSettings = <IDetailSettings>JSON.parse(widgetSettings.customSettings.data);
		if (customSettings == null) {
			this.setNoDetails();
			return;
		}

		// let's first find out if there are builds
		var definitionIds = [];
		definitionIds.push(customSettings.definitionId);
		var builds = await buildClient.getBuilds(context.project.name,
			definitionIds,
			null, null, null, null, null, null, null, null, null, null, null, null, null,
			1);
		if (builds.length === 1) {
			var build = builds[0];
			this.setDetails(build);
			this.setStatusColor(build);
			this.setNavigateUrl(build);
			return;
		}

		// no build could be found, so fallback to the build definition
		var definition = await buildClient.getDefinition(customSettings.definitionId, context.project.name);
		if (definition) {
			this.setDetailsFromDefinition(definition);
			this.setStatusColorFromDefinition(definition);
			this.setNavigateUrlFromDefinition(definition);
			return;
		}

		// no build and no definition...
		this.setNoDetails();
	}

	setNavigateUrl(build: TFS_Build_Contracts.Build) {
		if (build && build._links && build._links.web) {
			$("#buildDefinitionNavigateUrl").attr("href", build._links.web.href);
		}
	}
	
	setNavigateUrlFromDefinition(definition: TFS_Build_Contracts.BuildDefinition) {
		if (definition && definition._links && definition._links.web) {
			$("#buildDefinitionNavigateUrl").attr("href", definition._links.web.href);
		}
	}

	setStatusColor(build: TFS_Build_Contracts.Build) {
		var $root = $("#root");
		var $buildStatus = $("#buildStatus");
		var $buildDefinitionName = $("#buildDefinitionName");

		$root.removeClass("success partial fail building");
		$buildStatus.removeClass("build-status-succeeded build-status-building build-status-failed");

		if (build.status === TFS_Build_Contracts.BuildStatus.Completed) {
			if (build.result === TFS_Build_Contracts.BuildResult.Succeeded) {
				$root.addClass("success");
				$buildStatus.addClass("build-status-succeeded");
				$buildDefinitionName.addClass("build-definition-name-success");
			} else if (build.result === TFS_Build_Contracts.BuildResult.PartiallySucceeded) {
				$root.addClass("partial");
				$buildStatus.addClass("build-status-failed");
				$buildDefinitionName.addClass("build-definition-name-failed");
			} else if (build.result === TFS_Build_Contracts.BuildResult.Failed ||
				build.result === TFS_Build_Contracts.BuildResult.Canceled) {
				$root.addClass("fail");
				$buildStatus.addClass("build-status-failed");
				$buildDefinitionName.addClass("build-definition-name-failed");
			}
		}
		else if (build.status === TFS_Build_Contracts.BuildStatus.InProgress
			|| build.status === TFS_Build_Contracts.BuildStatus.NotStarted) {
			$root.addClass("building");
			$buildStatus.addClass("build-status-building");
			$buildDefinitionName.addClass("build-definition-name-building");
		}
	}

	setStatusColorFromDefinition(definition: TFS_Build_Contracts.BuildDefinition) {
		var $root = $("#root");
		var $buildStatus = $("#buildStatus");
		var $buildDefinitionName = $("#buildDefinitionName");

		$root.addClass("no-definition");
		$buildStatus.addClass("build-status-unknown");
		$buildDefinitionName.addClass("build-definition-name-unknown");
	}

	setNoDetails() {
		$("#root").removeClass("success partial fail building");
		$("#root").addClass("no-builds");
		$("#nodata").text("No builds found");
		$("#details").hide();
	}

	setDetails(build: TFS_Build_Contracts.Build) {
		$("#details").show();
		$("#buildDefinitionName").text(build.definition.name);
		$("#buildVersion").text(build.buildNumber);
		$("#buildQueuedBy").text(build.requestedFor.displayName);
		if (build.finishTime) {
			$("#buildCompleted").text(build.finishTime.toISOString().slice(0, 10));
		}
		$("#root").removeClass("no-builds");
		$("#nodata").text("");

		if (build.definition.name.length > 91) {
			$("#buildDefinitionName").addClass("reallySmall-text")
		}
	}

	setDetailsFromDefinition(definition: TFS_Build_Contracts.BuildDefinition) {
		$("#details").show();
		$("#buildDefinitionName").text(definition.name);
		$("#buildVersion").text("");
		$("#buildQueuedBy").text("");
		$("#root").removeClass("no-builds");
		$("#nodata").text("");
		
		if (definition.name.length > 91) {
			$("#buildDefinitionName").addClass("reallySmall-text")
		}
	}
}
