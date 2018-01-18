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

	constructor(public WidgetHelpers) { }

	public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;
		const settings: IDetailSettings = JSON.parse(widgetSettings.customSettings.data);
		if (!settings || !settings.definitionId) {
			const options = this.definitionDropDown;
			const text = "Select a build definition";
			options.append($("<option style=\"font-style:italic\" />").val(-1).text(text));
		}
		await this.loadBuildDefinitions(settings);

		this.notifyOnChange(this.definitionDropDown);

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
			TFS_Build_Contracts.DefinitionQueryOrder.DefinitionNameAscending)

		const options = this.definitionDropDown;

		for (const defRef of defs) {
			if (settings && settings.definitionId && defRef.id.toString() === settings.definitionId.toString()) {
				options.append($("<option selected/>").val(defRef.id).text(defRef.name));
			} else {
				options.append($("<option />").val(defRef.id).text(defRef.name));
			}
		}
	}

	private validateQueryDropdown($queryDropdown, $errordropdown): boolean {
		if (this.definitionDropDown.val() === "-1") {
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
				this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
					this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
			}
		});
	}

	private getCustomSettings() {
		const data: IDetailSettings = {
			definitionId: this.definitionDropDown.val() as number,
		};
		return { data: JSON.stringify(data) };
	}

	private onSave() {
		if (this.definitionDropDown.val() === "-1") {
			return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
		}
		return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
	}
}
