// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------
import * as tc from "telemetryclient-team-services-extension";
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Client = require("TFS/Build/RestClient");
import Services_Navigation = require("VSS/SDK/Services/Navigation");
import telemetryClientSettings = require("./telemetryClientSettings");

// tslint:disable-next-line:no-console
console.log("Entering build details");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetStyles();
	VSS.register("TPHealth-DetailsWidget", () => {
		const detailsWidget = new DetailsWidget(WidgetHelpers);
		return detailsWidget;
	});
	VSS.notifyLoadSucceeded();
});

export class DetailsWidget {

	constructor(public WidgetHelpers) {
	}

	public async load(widgetSettings) {
		tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("BuildDetails");

		await this.ShowBuildDetails(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public async reload(widgetSettings) {
		await this.ShowBuildDetails(widgetSettings);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}
	public async ShowBuildDetails(widgetSettings) {
		const buildClient = TFS_Build_Client.getClient();
		const context = VSS.getWebContext();

		const customSettings = JSON.parse(widgetSettings.customSettings.data) as IDetailSettings;
		if (customSettings == null) {
			this.setNoDetails();
			return;
		}

		// let's first find out if there are builds
		const definitionIds = [customSettings.definitionId];
		const builds = await buildClient.getBuilds(context.project.name,
			definitionIds,
			null, null, null, null, null, null, null, null, null, null, null, null,
			1); // maxBuildsPerDefinition
		if (builds.length > 0) {
			const build = builds[0];
			this.setDetails(build);
			this.setStatusColor(build);
			this.setNavigateUrl(build);
			return;
		}

		// no build could be found, so fallback to the build definition
		const definition = await buildClient.getDefinition(customSettings.definitionId, context.project.name);
		if (definition) {
			this.setDetailsFromDefinition(definition);
			this.setStatusColorFromDefinition(definition);
			this.setNavigateUrlFromDefinition(definition);
			return;
		}

		// no build and no definition...
		this.setNoDetails();
	}

	private setNavigateUrl(build: TFS_Build_Contracts.Build) {
		if (build && build._links && build._links.web) {
			VSS.getService(VSS.ServiceIds.Navigation).then((navigationService: Services_Navigation.HostNavigationService) => {
				$("#buildDefinitionNavigateUrl").on("click", (e) => {
					e.preventDefault();
					navigationService.openNewWindow(build._links.web.href, "");
				});
			});
		}
	}

	private setNavigateUrlFromDefinition(definition: TFS_Build_Contracts.BuildDefinition) {
		if (definition && definition._links && definition._links.web) {
			VSS.getService(VSS.ServiceIds.Navigation).then((navigationService: Services_Navigation.HostNavigationService) => {
				$("#buildDefinitionNavigateUrl").on("click", (e) => {
					e.preventDefault();
					navigationService.openNewWindow(definition._links.web.href, "");
				});
			});
		}
	}

	private setStatusColor(build: TFS_Build_Contracts.Build) {
		const $root = $("#root");
		const $buildStatus = $("#buildStatus");
		const $buildDefinitionName = $("#buildDefinitionName");

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
		} else if (build.status === TFS_Build_Contracts.BuildStatus.InProgress
			|| build.status === TFS_Build_Contracts.BuildStatus.NotStarted) {
			$root.addClass("building");
			$buildStatus.addClass("build-status-building");
			$buildDefinitionName.addClass("build-definition-name-building");
		}
	}

	private setStatusColorFromDefinition(definition: TFS_Build_Contracts.BuildDefinition) {
		const $root = $("#root");
		const $buildStatus = $("#buildStatus");
		const $buildDefinitionName = $("#buildDefinitionName");

		$root.addClass("no-definition");
		$buildStatus.addClass("build-status-unknown");
		$buildDefinitionName.addClass("build-definition-name-unknown");
	}

	private setNoDetails() {
		$("#root").removeClass("success partial fail building");
		$("#root").addClass("no-builds");
		$("#nodata").text("No builds found");
		$("#details").hide();
	}

	private setDetails(build: TFS_Build_Contracts.Build) {
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
			$("#buildDefinitionName").addClass("reallySmall-text");
		}
	}

	private setDetailsFromDefinition(definition: TFS_Build_Contracts.BuildDefinition) {
		$("#details").show();
		$("#buildDefinitionName").text(definition.name);
		$("#buildVersion").text("");
		$("#buildQueuedBy").text("");
		$("#root").removeClass("no-builds");
		$("#nodata").text("");

		if (definition.name.length > 91) {
			$("#buildDefinitionName").addClass("reallySmall-text");
		}
	}
}
