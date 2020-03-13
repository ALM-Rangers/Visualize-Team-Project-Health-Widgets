// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Client = require("TFS/Build/RestClient");
import Controls = require("VSS/Controls");
import Combos = require("VSS/Controls/Combos");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	VSS.register("TPHealth-OverviewWidget-Configuration",
		() => {
			const overviewConfigurationWidget = new OverviewConfiguration(WidgetHelpers);
			return overviewConfigurationWidget;
		});
	VSS.notifyLoadSucceeded();
});

export class OverviewConfiguration {
	private widgetConfigurationContext = null;
	private combo: Combos.Combo = null;
	private buildDefinitionDropDown = $(".build-definition-container");
	private showAll = $("#showAll");

	constructor(public WidgetHelpers) { }

	public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;

		const settings: IOverviewSettings = JSON.parse(widgetSettings.customSettings.data);
		let selectedDefinitions: string = null;

		if (!!settings) {
			selectedDefinitions = settings.selectedDefinitions;
		}
		const text = "Select build definition(s)";
		$("#definitionLegend").text(text);

		const context = VSS.getWebContext();
		const buildClient = TFS_Build_Client.getClient();

		const defs: TFS_Build_Contracts.BuildDefinitionReference[] =
			await buildClient.getDefinitions(
				context.project.id,
				undefined,
				undefined,
				undefined,
				undefined,
				TFS_Build_Contracts.DefinitionQueryOrder.DefinitionNameAscending);

		const names = (defs as any).map((value) => value.name);
		const dropOptions: Combos.IComboDropOptions = {
			maxRowCount: 4,
		};

		const multiValueOptions: Combos.IComboOptions = {
			dropOptions,
			source: names,
			type: "multi-value",
			value: selectedDefinitions,
		};

		this.combo = Controls.create(Combos.Combo, this.buildDefinitionDropDown, multiValueOptions);
		this.notifyOnChange(this.buildDefinitionDropDown);
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	public getCustomSettings() {
		const data: IOverviewSettings = {
			selectedDefinitions: this.combo.getText(),
		};
		return { data: JSON.stringify(data) };
	}

	public onSave() {
		return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
	}

	private notifyOnChange(control) {
		control.change(() => {
			this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
				this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
		});
	}
}
