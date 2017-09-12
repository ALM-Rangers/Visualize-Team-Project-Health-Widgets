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
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Client = require("TFS/Build/RestClient");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	VSS.register("TPHealth-OverviewWidget-Configuration",
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
	showAll = $("#showAll");
	constructor(public WidgetHelpers) { }

	public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;

		var settings: IOverviewSettings = JSON.parse(widgetSettings.customSettings.data);
		var selectedDefinitions: string = null;

		if (!!settings) {
			selectedDefinitions = settings.selectedDefinitions;
		}
		var text = "Select build definition(s)";
		$("#definitionLegend").text(text);

		var defs: TFS_Build_Contracts.BuildDefinitionReference[];
		var context = VSS.getWebContext();
		var buildClient = TFS_Build_Client.getClient();
		defs = await buildClient.getDefinitions(context.project.id, undefined, undefined, undefined, undefined, TFS_Build_Contracts.DefinitionQueryOrder.DefinitionNameAscending);
		
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
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	notifyOnChange(control) {
		control.change(() => {
			this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
				this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
		});
	}

	getCustomSettings() {
		var data: IOverviewSettings =
			{
				selectedDefinitions: this.combo.getText()
			};
		return { data: JSON.stringify(data) };
	}

	onSave() {
		return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
	}
}