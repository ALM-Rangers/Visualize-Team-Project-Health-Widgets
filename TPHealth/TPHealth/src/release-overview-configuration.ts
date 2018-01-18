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
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");
import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");
import Controls = require("VSS/Controls");
import Combos = require("VSS/Controls/Combos");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	VSS.register("TPHealth-ReleaseOverviewWidget-Configuration",
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
	private showRejectedAsFailedCheckbox = $("#showRejectedAsFailed");
	private showRejectedAsFailed: boolean = true;

	constructor(public WidgetHelpers) { }

	public async load(widgetSettings, widgetConfigurationContext) {
		this.widgetConfigurationContext = widgetConfigurationContext;

		const settings: IReleaseOverviewSettings = JSON.parse(widgetSettings.customSettings.data);
		let selectedDefinitions: string = null;

		if (!!settings) {
			selectedDefinitions = settings.selectedDefinitions;
			this.showRejectedAsFailed = settings.showRejectedAsFailed;
		}

		this.showRejectedAsFailedCheckbox.prop("checked", this.showRejectedAsFailed);
		const text = "Select release definition(s)";
		$("#definitionLegend").text(text);

		const context = VSS.getWebContext();
		const releaseClient = TFS_RM_Client.getClient();
		const defs: TFS_RM_Contracts.ReleaseDefinition[] =
			await releaseClient.getReleaseDefinitions(
				context.project.id,
				undefined, undefined, undefined, undefined, undefined, undefined,
				TFS_RM_Contracts.ReleaseDefinitionQueryOrder.NameAscending);

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

		const self = this;
		this.showRejectedAsFailedCheckbox.change(function (e) {
			self.showRejectedAsFailed = this.checked;
			self.widgetConfigurationContext.notify(self.WidgetHelpers.WidgetEvent.ConfigurationChange,
				self.WidgetHelpers.WidgetEvent.Args(self.getCustomSettings()));
		});
		return this.WidgetHelpers.WidgetStatusHelper.Success();
	}

	private notifyOnChange(control) {
		control.change(() => {
			this.widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange,
				this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
		});
	}

	private getCustomSettings() {
		const data: IReleaseOverviewSettings = {
				selectedDefinitions: this.combo.getText(),
				showRejectedAsFailed: this.showRejectedAsFailed,
			};
		return { data: JSON.stringify(data) };
	}

	private onSave() {
		return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
	}
}
