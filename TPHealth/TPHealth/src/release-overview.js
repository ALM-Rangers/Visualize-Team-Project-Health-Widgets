//---------------------------------------------------------------------
// <copyright file="overview.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript 
//    code for the configuration page for the overview widget.
// </summary>
//---------------------------------------------------------------------
/// <reference path="../node_modules/vss-web-extension-sdk/typings/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
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
define(["require", "exports", "ReleaseManagement/Core/RestClient", "ReleaseManagement/Core/Contracts", "./release-status", "./TelemetryClient"], function (require, exports, TFS_RM_Client, TFS_RM_Contracts, ReleaseStatus, TelemetryClient) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("TPHealth-ReleaseOverviewWidget", function () {
            var overviewWidget = new OverviewWidget(WidgetHelpers);
            return overviewWidget;
        });
        VSS.notifyLoadSucceeded();
    });
    var Overview = /** @class */ (function () {
        function Overview(Failed, Succeeded, InProgress) {
            this.Failed = Failed;
            this.Succeeded = Succeeded;
            this.InProgress = InProgress;
        }
        return Overview;
    }());
    var OverviewWidget = /** @class */ (function () {
        function OverviewWidget(WidgetHelpers) {
            this.WidgetHelpers = WidgetHelpers;
        }
        OverviewWidget.prototype.load = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    TelemetryClient.TelemetryClient.getClient().trackPageView("ReleaseOverview");
                    this.ShowOverviewData(widgetSettings);
                    return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                });
            });
        };
        OverviewWidget.prototype.reload = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.ShowOverviewData(widgetSettings);
                    return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                });
            });
        };
        OverviewWidget.prototype.ShowOverviewData = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $(".title").text(widgetSettings.name);
                            return [4 /*yield*/, this.showRelease(widgetSettings)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OverviewWidget.prototype.showRelease = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                var releaseClient, context, overviewData, customSettings, definitions, showRejectedAsFailed, ids, allReleases, i, releaseForDefinition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            releaseClient = TFS_RM_Client.getClient();
                            context = VSS.getWebContext();
                            overviewData = new Overview(0, 0, 0);
                            customSettings = JSON.parse(widgetSettings.customSettings.data);
                            return [4 /*yield*/, releaseClient.getReleaseDefinitions(context.project.name)];
                        case 1:
                            definitions = _a.sent();
                            if (!!customSettings && !!customSettings.selectedDefinitions) {
                                definitions = definitions.filter(function (def) { return customSettings.selectedDefinitions.indexOf(def.name) !== -1; });
                            }
                            showRejectedAsFailed = true;
                            if (!!customSettings) {
                                showRejectedAsFailed = customSettings.showRejectedAsFailed;
                            }
                            ids = definitions.map(function (value) { return value.id; });
                            if (!(ids.length > 0)) return [3 /*break*/, 6];
                            allReleases = [];
                            i = 0;
                            _a.label = 2;
                        case 2:
                            if (!(i < ids.length)) return [3 /*break*/, 5];
                            return [4 /*yield*/, releaseClient.getReleases(context.project.id, ids[i], null, null, null, null, null, null, null, null, 1, null, TFS_RM_Contracts.ReleaseExpands.Approvals | TFS_RM_Contracts.ReleaseExpands.Environments)];
                        case 3:
                            releaseForDefinition = _a.sent();
                            allReleases = allReleases.concat(releaseForDefinition);
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 2];
                        case 5:
                            allReleases.forEach(function (release) {
                                var status = ReleaseStatus.ReleaseStatus.getStatus(release, showRejectedAsFailed);
                                switch (status) {
                                    case TFS_RM_Contracts.DeploymentStatus.InProgress:
                                        overviewData.InProgress++;
                                        break;
                                    case TFS_RM_Contracts.DeploymentStatus.Succeeded:
                                        overviewData.Succeeded++;
                                        break;
                                    case TFS_RM_Contracts.DeploymentStatus.Failed:
                                        overviewData.Failed++;
                                        break;
                                }
                            });
                            $("#failed").text(overviewData.Failed);
                            $("#inprogress").text(overviewData.InProgress);
                            $("#succeeded").text(overviewData.Succeeded);
                            $("#container").removeClass("building success fail");
                            if (overviewData.Failed > 0) {
                                $("#container").addClass("fail");
                            }
                            else if (overviewData.InProgress > 0) {
                                $("#container").addClass("building");
                            }
                            else {
                                $("#container").addClass("success");
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            $("#nodata").text("No release definitions found");
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        return OverviewWidget;
    }());
    exports.OverviewWidget = OverviewWidget;
});
