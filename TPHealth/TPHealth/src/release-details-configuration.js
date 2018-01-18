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
define(["require", "exports", "ReleaseManagement/Core/RestClient", "ReleaseManagement/Core/Contracts"], function (require, exports, TFS_RM_Client, TFS_RM_Contracts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetConfigurationStyles();
        VSS.register("TPHealth-ReleaseDetailsWidget-Configuration", function () {
            var detailsConfigurationWidget = new DetailsConfiguration(WidgetHelpers);
            return detailsConfigurationWidget;
        });
        VSS.notifyLoadSucceeded();
    });
    var DetailsConfiguration = /** @class */ (function () {
        function DetailsConfiguration(WidgetHelpers) {
            this.WidgetHelpers = WidgetHelpers;
            this.widgetConfigurationContext = null;
            this.definitionDropDown = $("#definitionDropDown");
            this.errordropdown = $("#definitionDropDown .validation-error > .validation-error-text");
            this.showRejectedAsFailedCheckbox = $("#showRejectedAsFailed");
            this.showRejectedAsFailed = true;
        }
        DetailsConfiguration.prototype.load = function (widgetSettings, widgetConfigurationContext) {
            return __awaiter(this, void 0, void 0, function () {
                var settings, options, text, self;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.widgetConfigurationContext = widgetConfigurationContext;
                            settings = JSON.parse(widgetSettings.customSettings.data);
                            if (!settings || !settings.definitionId) {
                                options = this.definitionDropDown;
                                text = "Select a release definition";
                                options.append($("<option style=\"font-style:italic\" />").val(-1).text(text));
                            }
                            if (!!settings) {
                                this.showRejectedAsFailed = settings.showRejectedAsFailed;
                            }
                            this.showRejectedAsFailedCheckbox.prop('checked', this.showRejectedAsFailed);
                            return [4 /*yield*/, this.loadReleaseDefinitions(settings)];
                        case 1:
                            _a.sent();
                            this.notifyOnChange(this.definitionDropDown);
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
        DetailsConfiguration.prototype.loadReleaseDefinitions = function (settings) {
            return __awaiter(this, void 0, void 0, function () {
                var releaseClient, context, defs, options, i, defRef;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            releaseClient = TFS_RM_Client.getClient();
                            context = VSS.getWebContext();
                            return [4 /*yield*/, releaseClient.getReleaseDefinitions(context.project.id, undefined, undefined, undefined, undefined, undefined, undefined, TFS_RM_Contracts.ReleaseDefinitionQueryOrder.NameAscending)];
                        case 1:
                            defs = _a.sent();
                            options = this.definitionDropDown;
                            for (i = 0; i < defs.length; i++) {
                                defRef = defs[i];
                                if (settings && settings.definitionId && defRef.id.toString() === settings.definitionId.toString()) {
                                    options.append($("<option selected/>").val(defRef.id).text(defRef.name));
                                }
                                else {
                                    options.append($("<option />").val(defRef.id).text(defRef.name));
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        DetailsConfiguration.prototype.validateQueryDropdown = function ($queryDropdown, $errordropdown) {
            if (this.definitionDropDown.val() === "-1") {
                var text = "Please select a release definition";
                $errordropdown.text(text);
                $errordropdown.parent().css("visibility", "visible");
                return false;
            }
            $errordropdown.parent().css("visibility", "hidden");
            return true;
        };
        DetailsConfiguration.prototype.notifyOnChange = function (control) {
            var _this = this;
            control.change(function () {
                if (_this.validateQueryDropdown(_this.definitionDropDown, _this.errordropdown)) {
                    $("#definitionDropDown option[value='-1']").remove();
                    _this.widgetConfigurationContext.notify(_this.WidgetHelpers.WidgetEvent.ConfigurationChange, _this.WidgetHelpers.WidgetEvent.Args(_this.getCustomSettings()));
                }
            });
        };
        DetailsConfiguration.prototype.getCustomSettings = function () {
            var data = {
                definitionId: this.definitionDropDown.val(),
                showRejectedAsFailed: this.showRejectedAsFailed
            };
            return { data: JSON.stringify(data) };
        };
        DetailsConfiguration.prototype.onSave = function () {
            if (this.definitionDropDown.val() === "-1") {
                return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
            }
            return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
        };
        return DetailsConfiguration;
    }());
});
