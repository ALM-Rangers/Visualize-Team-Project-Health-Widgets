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
define(["require", "exports", "telemetryclient-team-services-extension", "TFS/Build/Contracts", "TFS/Build/RestClient", "./telemetryClientSettings"], function (require, exports, tc, TFS_Build_Contracts, TFS_Build_Client, telemetryClientSettings) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("TPHealth-DetailsWidget", function () {
            var detailsWidget = new DetailsWidget(WidgetHelpers);
            return detailsWidget;
        });
        VSS.notifyLoadSucceeded();
    });
    var DetailsWidget = /** @class */ (function () {
        function DetailsWidget(WidgetHelpers) {
            this.WidgetHelpers = WidgetHelpers;
        }
        DetailsWidget.prototype.load = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("BuildDetails");
                            return [4 /*yield*/, this.ShowBuildDetails(widgetSettings)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                    }
                });
            });
        };
        DetailsWidget.prototype.reload = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ShowBuildDetails(widgetSettings)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                    }
                });
            });
        };
        DetailsWidget.prototype.ShowBuildDetails = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                var buildClient, context, customSettings, definitionIds, builds, build, definition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            buildClient = TFS_Build_Client.getClient();
                            context = VSS.getWebContext();
                            customSettings = JSON.parse(widgetSettings.customSettings.data);
                            if (customSettings == null) {
                                this.setNoDetails();
                                return [2 /*return*/];
                            }
                            definitionIds = [customSettings.definitionId];
                            return [4 /*yield*/, buildClient.getBuilds(context.project.name, definitionIds, null, null, null, null, null, null, null, null, null, null, null, null, null, 1)];
                        case 1:
                            builds = _a.sent();
                            if (builds.length === 1) {
                                build = builds[0];
                                this.setDetails(build);
                                this.setStatusColor(build);
                                this.setNavigateUrl(build);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, buildClient.getDefinition(customSettings.definitionId, context.project.name)];
                        case 2:
                            definition = _a.sent();
                            if (definition) {
                                this.setDetailsFromDefinition(definition);
                                this.setStatusColorFromDefinition(definition);
                                this.setNavigateUrlFromDefinition(definition);
                                return [2 /*return*/];
                            }
                            // no build and no definition...
                            this.setNoDetails();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DetailsWidget.prototype.setNavigateUrl = function (build) {
            if (build && build._links && build._links.web) {
                VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                    $("#buildDefinitionNavigateUrl").on("click", function (e) {
                        e.preventDefault();
                        navigationService.openNewWindow(build._links.web.href, "");
                    });
                });
            }
        };
        DetailsWidget.prototype.setNavigateUrlFromDefinition = function (definition) {
            if (definition && definition._links && definition._links.web) {
                VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                    $("#buildDefinitionNavigateUrl").on("click", function (e) {
                        e.preventDefault();
                        navigationService.openNewWindow(definition._links.web.href, "");
                    });
                });
            }
        };
        DetailsWidget.prototype.setStatusColor = function (build) {
            var $root = $("#root");
            var $buildStatus = $("#buildStatus");
            var $buildDefinitionName = $("#buildDefinitionName");
            $root.removeClass("success partial fail building");
            $buildStatus.removeClass("build-status-succeeded build-status-building build-status-failed");
            if (build.status === TFS_Build_Contracts.BuildStatus.Completed) {
                if (build.result === TFS_Build_Contracts.BuildResult.Succeeded) {
                    $root.addClass("success");
                    $buildStatus.addClass("build-status-succeeded");
                    $buildDefinitionName.addClass("build-definition-name-success");
                }
                else if (build.result === TFS_Build_Contracts.BuildResult.PartiallySucceeded) {
                    $root.addClass("partial");
                    $buildStatus.addClass("build-status-failed");
                    $buildDefinitionName.addClass("build-definition-name-failed");
                }
                else if (build.result === TFS_Build_Contracts.BuildResult.Failed ||
                    build.result === TFS_Build_Contracts.BuildResult.Canceled) {
                    $root.addClass("fail");
                    $buildStatus.addClass("build-status-failed");
                    $buildDefinitionName.addClass("build-definition-name-failed");
                }
            }
            else if (build.status === TFS_Build_Contracts.BuildStatus.InProgress
                || build.status === TFS_Build_Contracts.BuildStatus.NotStarted) {
                $root.addClass("building");
                $buildStatus.addClass("build-status-building");
                $buildDefinitionName.addClass("build-definition-name-building");
            }
        };
        DetailsWidget.prototype.setStatusColorFromDefinition = function (definition) {
            var $root = $("#root");
            var $buildStatus = $("#buildStatus");
            var $buildDefinitionName = $("#buildDefinitionName");
            $root.addClass("no-definition");
            $buildStatus.addClass("build-status-unknown");
            $buildDefinitionName.addClass("build-definition-name-unknown");
        };
        DetailsWidget.prototype.setNoDetails = function () {
            $("#root").removeClass("success partial fail building");
            $("#root").addClass("no-builds");
            $("#nodata").text("No builds found");
            $("#details").hide();
        };
        DetailsWidget.prototype.setDetails = function (build) {
            $("#details").show();
            $("#buildDefinitionName").text(build.definition.name);
            $("#buildVersion").text(build.buildNumber);
            $("#buildQueuedBy").text(build.requestedFor.displayName);
            if (build.finishTime) {
                $("#buildCompleted").text(build.finishTime.toISOString().slice(0, 10));
            }
            $("#root").removeClass("no-builds");
            $("#nodata").text("");
            if (build.definition.name.length > 91) {
                $("#buildDefinitionName").addClass("reallySmall-text");
            }
        };
        DetailsWidget.prototype.setDetailsFromDefinition = function (definition) {
            $("#details").show();
            $("#buildDefinitionName").text(definition.name);
            $("#buildVersion").text("");
            $("#buildQueuedBy").text("");
            $("#root").removeClass("no-builds");
            $("#nodata").text("");
            if (definition.name.length > 91) {
                $("#buildDefinitionName").addClass("reallySmall-text");
            }
        };
        return DetailsWidget;
    }());
    exports.DetailsWidget = DetailsWidget;
});
