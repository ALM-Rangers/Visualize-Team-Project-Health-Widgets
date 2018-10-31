// ---------------------------------------------------------------------
// <copyright file="details-configuration.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript
//    code for the configuration page of the details widget.
// </summary>
// ---------------------------------------------------------------------

import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Client = require("TFS/Build/RestClient");
import TFS_Git_Client = require("TFS/VersionControl/GitRestClient");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	VSS.register("TPHealth-DetailsWidget-Configuration",
		() => {
			const detailsConfigurationWidget = new DetailsConfiguration(WidgetHelpers);
			return detailsConfigurationWidget;
		});
	VSS.notifyLoadSucceeded();
});

class DetailsConfiguration {
	private widgetConfigurationContext = null;
	private definitionDropDown = $("#definitionDropDown");
	private errordropdown = $("#definitionDropDown .validation-error > .validation-error-text");

	private reposDropDown = $("#reposDropDown");
	private showBranchCheckBox = $("#showBranchCheckBox");

	private detailsSettings: IDetailSettings;
	private showBranch: boolean = false;

	constructor(public WidgetHelpers) { }

	public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;
		this.detailsSettings = JSON.parse(widgetSettings.customSettings.data);

		if (!this.detailsSettings || !this.detailsSettings.definitionId) {
			const options = this.definitionDropDown;
			const text = "Select a build definition";
			options.append($("<option style=\"font-style:italic\" />").val(-1).text(text));
		}
		await this.loadBuildDefinitions(this.detailsSettings);
		this.showBranch = this.detailsSettings.showBranch;
		if (this.showBranch) {
			this.showBranchCheckBox.prop("checked", true);
		} else {
			this.showBranchCheckBox.prop("checked", false);
		}
		this.notifyOnChange(this.definitionDropDown);
		this.notifyOnReposDropDownChange(this.reposDropDown);
		this.notifyOnShowBranchChange(this.showBranchCheckBox);

		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	private async loadBuildDefinitions(settings) {
		const buildClient = TFS_Build_Client.getClient();
		const context = VSS.getWebContext();
		const defs = await buildClient.getDefinitions(
			context.project.id,
			undefined,
			undefined,
			undefined,
			undefined,
			TFS_Build_Contracts.DefinitionQueryOrder.DefinitionNameAscending);

		const options = this.definitionDropDown;

		for (const defRef of defs) {
			if (settings && settings.definitionId && defRef.id.toString() === settings.definitionId.toString()) {
				options.append($("<option selected/>").val(defRef.id).text(defRef.name));
			} else {
				options.append($("<option />").val(defRef.id).text(defRef.name));
			}
		}

		this.loadBranches();
	}

	private loadBranches() {
		if (this.validateQueryDropdown(this.definitionDropDown, this.errordropdown)) {
			const context = VSS.getWebContext();
			const buildClient = TFS_Build_Client.getClient();
			buildClient.getDefinition(this.definitionDropDown.val() as number, context.project.id)
			.then((def) => {
				const buildRepo = def.repository;

				const gitClient = TFS_Git_Client.getClient();
				gitClient.getBranches(buildRepo.id)
				.then( (branches)  => {
					const options = this.reposDropDown;
					options.empty();
					options.append($("<option style=\"font-style:italic\" />").val(-1).text("Any"));

					for (const b of branches) {

						if (this.detailsSettings && this.detailsSettings.branch && b.name === this.detailsSettings.branch) {
							options.append($("<option selected/>").val(b.name).text(b.name));
						} else {
							options.append($("<option />").val(b.name).text(b.name));
						}
					}
				});
			});
		}
	}

	private validateQueryDropdown($queryDropdown, $errordropdown): boolean {
		if ($queryDropdown.val() === "-1") {
			const text = "Please select a build definition";
			$errordropdown.text(text);
			$errordropdown.parent().css("visibility", "visible");
			return false;
		}
		$errordropdown.parent().css("visibility", "hidden");
		return true;
	}

	private notifyOnChange(control) {
		control.change(() => {
			if (this.validateQueryDropdown(this.definitionDropDown, this.errordropdown)) {
				$("#definitionDropDown option[value='-1']").remove();
				this.notifyConfigurationChanged();
				this.loadBranches();
			}
		});
	}

	private notifyOnShowBranchChange(control) {
		control.change(() => {
			this.showBranch = !this.showBranch;
			this.notifyConfigurationChanged();
		});
	}

	private notifyOnReposDropDownChange(control) {
		control.change(() => {
			this.notifyConfigurationChanged();
		});
	}

	private notifyConfigurationChanged() {
		this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
			this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
	}

	private getCustomSettings() {
		const data: IDetailSettings = {
			branch: this.reposDropDown.val() as string,
			definitionId: this.definitionDropDown.val() as number,
			showBranch: this.showBranch,
		};
		return { data: JSON.stringify(data) };
	}
}
