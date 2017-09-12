//---------------------------------------------------------------------
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
//---------------------------------------------------------------------

import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	VSS.register("TPHealth-ReleaseDetailsWidget-Configuration",
		() => {
			var detailsConfigurationWidget = new DetailsConfiguration(WidgetHelpers);
			return detailsConfigurationWidget;
		});
	VSS.notifyLoadSucceeded();
});

class DetailsConfiguration {
	widgetConfigurationContext = null;
	definitionDropDown = $("#definitionDropDown");
	errordropdown = $("#definitionDropDown .validation-error > .validation-error-text");
    showRejectedAsFailedCheckbox = $("#showRejectedAsFailed");
    showRejectedAsFailed: boolean = true;

	constructor(public WidgetHelpers) { }

	public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;
        var settings: IReleaseDetailSettings = JSON.parse(widgetSettings.customSettings.data);

        if (!settings || !settings.definitionId) {

			var options = this.definitionDropDown;
			var text = "Select a release definition";
            options.append($("<option style=\"font-style:italic\" />").val(-1).text(text));

        }
        if (!!settings) {
            this.showRejectedAsFailed = settings.showRejectedAsFailed;
        }

        this.showRejectedAsFailedCheckbox.prop('checked', this.showRejectedAsFailed);

	    await this.loadReleaseDefinitions(settings);
				
		this.notifyOnChange(this.definitionDropDown);

        var self = this;
        this.showRejectedAsFailedCheckbox.change(function (e) {
            self.showRejectedAsFailed = this.checked;
            self.widgetConfigurationContext.notify(self.WidgetHelpers.WidgetEvent.ConfigurationChange,
                self.WidgetHelpers.WidgetEvent.Args(self.getCustomSettings()));
        });

		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	async loadReleaseDefinitions(settings) {
		var releaseClient = TFS_RM_Client.getClient();
		var context = VSS.getWebContext();
		var defs = await releaseClient.getReleaseDefinitions(context.project.id, undefined, undefined, undefined, undefined, undefined, undefined, TFS_RM_Contracts.ReleaseDefinitionQueryOrder.NameAscending);
		var options = this.definitionDropDown;
		for (let i: number = 0; i < defs.length; i++) {
			let defRef = defs[i];

			if (settings && settings.definitionId && defRef.id.toString() === settings.definitionId.toString()) {
				options.append($("<option selected/>").val(defRef.id).text(defRef.name));
			} else {
				options.append($("<option />").val(defRef.id).text(defRef.name));
			}
		}
	}

	validateQueryDropdown($queryDropdown, $errordropdown): boolean {
		if (this.definitionDropDown.val() === "-1") {
			var text = "Please select a release definition";
			$errordropdown.text(text);
			$errordropdown.parent().css("visibility", "visible");
			return false;
		}
		$errordropdown.parent().css("visibility", "hidden");
		return true;
	}

	notifyOnChange(control) {
		control.change(() => {
			if (this.validateQueryDropdown(this.definitionDropDown, this.errordropdown)) {
				$("#definitionDropDown option[value='-1']").remove();
				this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
					this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
			}
		});
	}

	getCustomSettings() {
		var data: IReleaseDetailSettings =
			{
                definitionId: this.definitionDropDown.val(),
                showRejectedAsFailed: this.showRejectedAsFailed
			};
		return { data: JSON.stringify(data) };
	}

	onSave() {
		if (this.definitionDropDown.val() === "-1") {
			return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
		}
		return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
	}
}