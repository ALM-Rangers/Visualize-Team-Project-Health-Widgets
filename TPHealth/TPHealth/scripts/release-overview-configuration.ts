//---------------------------------------------------------------------
// <copyright file="overview-configuration.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript 
//    code for the configuration page of the overview widget.
// </summary>
//---------------------------------------------------------------------
import Controls = require("VSS/Controls");
import Combos = require("VSS/Controls/Combos");
import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");


VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	VSS.register("TPHealth-ReleaseOverviewWidget-Configuration",
		() => {
			var overviewConfigurationWidget = new OverviewConfiguration(WidgetHelpers);
			return overviewConfigurationWidget;
		});
	VSS.notifyLoadSucceeded();
});
export class OverviewConfiguration {
	widgetConfigurationContext = null;
	combo: Combos.Combo = null;
	buildDefinitionDropDown = $(".build-definition-container");
    showRejectedAsFailedCheckbox = $("#showRejectedAsFailed");
    showRejectedAsFailed: boolean = true;

	constructor(public WidgetHelpers) { }

    public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;

		var settings: IReleaseOverviewSettings = JSON.parse(widgetSettings.customSettings.data);
        var selectedDefinitions: string = null;
  
		if (!!settings) {
            selectedDefinitions = settings.selectedDefinitions;
            this.showRejectedAsFailed = settings.showRejectedAsFailed;
        } 

        this.showRejectedAsFailedCheckbox.prop('checked', this.showRejectedAsFailed);
		var text = "Select release definition(s)";
		$("#definitionLegend").text(text);

		var defs: TFS_RM_Contracts.ReleaseDefinition[];
		var context = VSS.getWebContext();
		var releaseClient = TFS_RM_Client.getClient();
		defs = await releaseClient.getReleaseDefinitions(context.project.id, undefined, undefined, undefined, undefined, undefined, undefined, TFS_RM_Contracts.ReleaseDefinitionQueryOrder.NameAscending);

        var names = (<any>defs).map(value => { return value.name });
		var dropOptions: Combos.IComboDropOptions = {
			maxRowCount: 4,
		};

		var multiValueOptions: Combos.IComboOptions = {
			type: "multi-value",
			source: names,
			value: selectedDefinitions,
			dropOptions: dropOptions
		};

        this.combo = Controls.create(Combos.Combo, this.buildDefinitionDropDown, multiValueOptions);
        this.notifyOnChange(this.buildDefinitionDropDown);

        var self = this;
        this.showRejectedAsFailedCheckbox.change(function (e) {
            self.showRejectedAsFailed = this.checked;
            self.widgetConfigurationContext.notify(self.WidgetHelpers.WidgetEvent.ConfigurationChange,
                self.WidgetHelpers.WidgetEvent.Args(self.getCustomSettings()));
        });
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

    notifyOnChange(control) {
        control.change(() => {
			this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
				this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
		});
    }


	getCustomSettings() {
		var data: IReleaseOverviewSettings =
			{
                selectedDefinitions: this.combo.getText(),
                showRejectedAsFailed: this.showRejectedAsFailed
			};
		return { data: JSON.stringify(data) };
	}

	onSave() {
		return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
	}
}