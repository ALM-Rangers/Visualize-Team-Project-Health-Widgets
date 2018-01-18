var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "VSS/Controls", "VSS/Controls/Combos", "ReleaseManagement/Core/RestClient", "ReleaseManagement/Core/Contracts"], function (require, exports, Controls, Combos, TFS_RM_Client, TFS_RM_Contracts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetConfigurationStyles();
        VSS.register("TPHealth-ReleaseOverviewWidget-Configuration", function () {
            var overviewConfigurationWidget = new OverviewConfiguration(WidgetHelpers);
            return overviewConfigurationWidget;
        });
        VSS.notifyLoadSucceeded();
    });
    var OverviewConfiguration = /** @class */ (function () {
        function OverviewConfiguration(WidgetHelpers) {
            this.WidgetHelpers = WidgetHelpers;
            this.widgetConfigurationContext = null;
            this.combo = null;
            this.buildDefinitionDropDown = $(".build-definition-container");
            this.showRejectedAsFailedCheckbox = $("#showRejectedAsFailed");
            this.showRejectedAsFailed = true;
        }
        OverviewConfiguration.prototype.load = function (widgetSettings, widgetConfigurationContext) {
            return __awaiter(this, void 0, void 0, function () {
                var settings, selectedDefinitions, text, defs, context, releaseClient, names, dropOptions, multiValueOptions, self;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.widgetConfigurationContext = widgetConfigurationContext;
                            settings = JSON.parse(widgetSettings.customSettings.data);
                            selectedDefinitions = null;
                            if (!!settings) {
                                selectedDefinitions = settings.selectedDefinitions;
                                this.showRejectedAsFailed = settings.showRejectedAsFailed;
                            }
                            this.showRejectedAsFailedCheckbox.prop('checked', this.showRejectedAsFailed);
                            text = "Select release definition(s)";
                            $("#definitionLegend").text(text);
                            context = VSS.getWebContext();
                            releaseClient = TFS_RM_Client.getClient();
                            return [4 /*yield*/, releaseClient.getReleaseDefinitions(context.project.id, undefined, undefined, undefined, undefined, undefined, undefined, TFS_RM_Contracts.ReleaseDefinitionQueryOrder.NameAscending)];
                        case 1:
                            defs = _a.sent();
                            names = defs.map(function (value) { return value.name; });
                            dropOptions = {
                                maxRowCount: 4,
                            };
                            multiValueOptions = {
                                type: "multi-value",
                                source: names,
                                value: selectedDefinitions,
                                dropOptions: dropOptions
                            };
                            this.combo = Controls.create(Combos.Combo, this.buildDefinitionDropDown, multiValueOptions);
                            this.notifyOnChange(this.buildDefinitionDropDown);
                            self = this;
                            this.showRejectedAsFailedCheckbox.change(function (e) {
                                self.showRejectedAsFailed = this.checked;
                                self.widgetConfigurationContext.notify(self.WidgetHelpers.WidgetEvent.ConfigurationChange, self.WidgetHelpers.WidgetEvent.Args(self.getCustomSettings()));
                            });
                            return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                    }
                });
            });
        };
        OverviewConfiguration.prototype.notifyOnChange = function (control) {
            var _this = this;
            control.change(function () {
                _this.widgetConfigurationContext.notify(_this.WidgetHelpers.WidgetEvent.ConfigurationChange, _this.WidgetHelpers.WidgetEvent.Args(_this.getCustomSettings()));
            });
        };
        OverviewConfiguration.prototype.getCustomSettings = function () {
            var data = {
                selectedDefinitions: this.combo.getText(),
                showRejectedAsFailed: this.showRejectedAsFailed
            };
            return { data: JSON.stringify(data) };
        };
        OverviewConfiguration.prototype.onSave = function () {
            return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
        };
        return OverviewConfiguration;
    }());
    exports.OverviewConfiguration = OverviewConfiguration;
});
