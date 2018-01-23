define(function(){return function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=16)}([,,function(e,t,n){var i,o;i=[n,t,n(3)],void 0!==(o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(){this.disableTelemetry="false",this.disableAjaxTracking="false",this.enableDebug="false"}return e}();t.TelemetryClientSettings=i;var o=function(){function e(){this.IsAvailable=!0}return e.getClient=function(t){return this._instance||(console.log("Creating new TelemetryClient!"),this._instance=new e,this._instance.Init(t)),this._instance},e.prototype.Init=function(e){console.log("TelemetryClient settings key: "+e.key.substring(0,8)+"************"),console.log("TelemetryClient settings extension context: "+e.extensioncontext),console.log("TelemetryClient settings disableTelemetry: "+("true"===e.disableTelemetry)),console.log("TelemetryClient settings disableAjaxTracking: "+("true"===e.disableAjaxTracking)),console.log("TelemetryClient settings enableDebug: "+("true"===e.enableDebug));var t={instrumentationKey:e.key,disableTelemetry:"true"===e.disableTelemetry,disableAjaxTracking:"true"===e.disableAjaxTracking,enableDebug:"true"===e.enableDebug};this.ExtensionContext=e.extensioncontext;try{var i=VSS.getWebContext();n.AppInsights.downloadAndSetup(t),n.AppInsights.setAuthenticatedUserContext(i.user.id,i.collection.id)}catch(e){console.log(e)}},e.prototype.trackPageView=function(e,t,i,o,r){try{n.AppInsights.trackPageView(this.ExtensionContext+"."+e,t,i,o,r),n.AppInsights.flush()}catch(e){console.log(e)}},e.prototype.trackEvent=function(e,t,i){try{console.log("Tracking event: "+this.ExtensionContext+"."+e),n.AppInsights.trackEvent(this.ExtensionContext+"."+e,t,i),n.AppInsights.flush()}catch(e){console.log(e)}},e.prototype.trackException=function(e,t,i,o){try{console.error(e);var r={name:this.ExtensionContext+"."+t,message:e};n.AppInsights.trackException(r,t,i,o),n.AppInsights.flush()}catch(e){console.log(e)}},e.prototype.trackMetric=function(e,t,i,o,r,a){try{n.AppInsights.trackMetric(this.ExtensionContext+"."+e,t,i,o,r,a),n.AppInsights.flush()}catch(e){console.log(e)}},e}();t.TelemetryClient=o}.apply(t,i))&&(e.exports=o)},function(e,t,n){"use strict";var i,o,r;!function(e){e.ApplicationInsights||(e.ApplicationInsights={})}(r||(r={}));var r;!function(e){!function(e){var t=function(){function e(){}return e}();e.Base=t}(e.Telemetry||(e.Telemetry={}))}(r||(r={}));var r;!function(e){!function(e){var t=function(){function e(){this.ver=1,this.sampleRate=100,this.tags={}}return e}();e.Envelope=t}(e.Telemetry||(e.Telemetry={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){!function(e){e.Context||(e.Context={})}(e.ApplicationInsights||(e.ApplicationInsights={}))}(r||(r={}));var r;!function(e){e.ApplicationInsights||(e.ApplicationInsights={})}(r||(r={}));var r;!function(e){e.ApplicationInsights||(e.ApplicationInsights={})}(r||(r={}));var r;!function(e){e.ApplicationInsights||(e.ApplicationInsights={})}(r||(r={}));var a;!function(e){!function(e){e[e.Verbose=0]="Verbose",e[e.Information=1]="Information",e[e.Warning=2]="Warning",e[e.Error=3]="Error",e[e.Critical=4]="Critical"}(e.SeverityLevel||(e.SeverityLevel={}))}(a||(a={}));var r;!function(e){e.ApplicationInsights||(e.ApplicationInsights={})}(r||(r={})),i=[n,t],void 0!==(o=function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e._createLazyMethod=function(t){var n=window[e.appInsightsName];n[t]=function(){var e=arguments;n.queue?n.queue.push(function(){return n[t].apply(n,e)}):n[t].apply(n,e)}},e._defineLazyMethods=function(){var t=window[e.appInsightsName];try{t.cookie=document.cookie}catch(e){}t.queue=[];for(var n=["clearAuthenticatedUserContext","flush","setAuthenticatedUserContext","startTrackEvent","startTrackPage","stopTrackEvent","stopTrackPage","trackDependency","trackEvent","trackException","trackMetric","trackPageView","trackTrace"];n.length;)e._createLazyMethod(n.pop())},e._download=function(t){e.appInsightsInstance.config=t;var n=window[e.appInsightsName];if(n.queue||(n.queue=[]),setTimeout(function(){var e=document.createElement("script");e.src=t.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",document.head.appendChild(e)}),!t.disableExceptionTracking){e._createLazyMethod("_onerror");var i=window.onerror;window.onerror=function(e,t,o,r,a){var s=i&&i(e,t,o,r,a);return!0!==s&&n._onerror(e,t,o,r,a),s}}},Object.defineProperty(e,"appInsightsInstance",{get:function(){if("undefined"!=typeof window)return window[e.appInsightsName]||(window[e.appInsightsName]={downloadAndSetup:e._download,_defineLazyMethods:e._defineLazyMethods},e._defineLazyMethods()),window[e.appInsightsName]},enumerable:!0,configurable:!0}),e.appInsightsInitialized=!1,e.appInsightsName="appInsights",e}();t.AppInsights=n.appInsightsInstance}.apply(t,i))&&(e.exports=o)},function(e,t,n){var i,o;i=[n,t],void 0!==(o=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.settings={disableAjaxTracking:"false",disableTelemetry:"false",enableDebug:"false",extensioncontext:"FolderManagement",key:"__InstrumentationKey__"}}.apply(t,i))&&(e.exports=o)},,,function(e,t,n){var i,o;i=[n,t],void 0!==(o=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t,n){this.Failed=e,this.Succeeded=t,this.InProgress=n}return e}();t.Overview=n}.apply(t,i))&&(e.exports=o)},function(e,t,n){var i,o;i=[n,t,!function(){var e=new Error('Cannot find module "ReleaseManagement/Core/Contracts"');throw e.code="MODULE_NOT_FOUND",e}()],void 0!==(o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(){}return e.getStatus=function(e,t){var i=this,o=n.DeploymentStatus.Succeeded;return e.environments.forEach(function(e){var r=n.DeploymentStatus.Succeeded;return e.deploySteps.forEach(function(e){return(r=i.getStepStatus(e,t))===n.DeploymentStatus.Succeeded||(o=r,!1)}),r===n.DeploymentStatus.Succeeded||(o=r,!1)}),o},e.getStepStatus=function(e,t){if(e.status===n.DeploymentStatus.Succeeded)return n.DeploymentStatus.Succeeded;switch(e.operationStatus){case n.DeploymentOperationStatus.Approved:case n.DeploymentOperationStatus.Deferred:case n.DeploymentOperationStatus.ManualInterventionPending:case n.DeploymentOperationStatus.Pending:case n.DeploymentOperationStatus.PhaseInProgress:case n.DeploymentOperationStatus.Queued:case n.DeploymentOperationStatus.QueuedForAgent:return n.DeploymentStatus.InProgress;case n.DeploymentOperationStatus.Canceled:case n.DeploymentOperationStatus.PhaseCanceled:return n.DeploymentStatus.NotDeployed;case n.DeploymentOperationStatus.Rejected:return t?n.DeploymentStatus.Failed:n.DeploymentStatus.Succeeded;case n.DeploymentOperationStatus.PhaseFailed:return n.DeploymentStatus.Failed;case n.DeploymentOperationStatus.PhasePartiallySucceeded:return n.DeploymentStatus.PartiallySucceeded}return n.DeploymentStatus.Succeeded},e}();t.ReleaseStatus=i}.apply(t,i))&&(e.exports=o)},,,,,,,,function(e,t,n){var i,o,r=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))(function(o,r){function a(e){try{c(i.next(e))}catch(e){r(e)}}function s(e){try{c(i.throw(e))}catch(e){r(e)}}function c(e){e.done?o(e.value):new n(function(t){t(e.value)}).then(a,s)}c((i=i.apply(e,t||[])).next())})},a=this&&this.__generator||function(e,t){function n(e){return function(t){return i([e,t])}}function i(n){if(o)throw new TypeError("Generator is already executing.");for(;c;)try{if(o=1,r&&(a=r[2&n[0]?"return":n[0]?"throw":"next"])&&!(a=a.call(r,n[1])).done)return a;switch(r=0,a&&(n=[0,a.value]),n[0]){case 0:case 1:a=n;break;case 4:return c.label++,{value:n[1],done:!1};case 5:c.label++,r=n[1],n=[0];continue;case 7:n=c.ops.pop(),c.trys.pop();continue;default:if(a=c.trys,!(a=a.length>0&&a[a.length-1])&&(6===n[0]||2===n[0])){c=0;continue}if(3===n[0]&&(!a||n[1]>a[0]&&n[1]<a[3])){c.label=n[1];break}if(6===n[0]&&c.label<a[1]){c.label=a[1],a=n;break}if(a&&c.label<a[2]){c.label=a[2],c.ops.push(n);break}a[2]&&c.ops.pop(),c.trys.pop();continue}n=t.call(e,c)}catch(e){n=[6,e],r=0}finally{o=a=0}if(5&n[0])throw n[1];return{value:n[0]?n[1]:void 0,done:!0}}var o,r,a,s,c={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return s={next:n(0),throw:n(1),return:n(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s};i=[n,t,!function(){var e=new Error('Cannot find module "ReleaseManagement/Core/Contracts"');throw e.code="MODULE_NOT_FOUND",e}(),!function(){var e=new Error('Cannot find module "ReleaseManagement/Core/RestClient"');throw e.code="MODULE_NOT_FOUND",e}(),n(2),n(7),n(8),n(4)],void 0!==(o=function(e,t,n,i,o,s,c,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),VSS.require(["TFS/Dashboards/WidgetHelpers"],function(e){e.IncludeWidgetStyles(),VSS.register("TPHealth-ReleaseOverviewWidget",function(){return new l(e)}),VSS.notifyLoadSucceeded()});var l=function(){function e(e){this.WidgetHelpers=e}return e.prototype.load=function(e){return r(this,void 0,void 0,function(){return a(this,function(t){return o.TelemetryClient.getClient(u.settings).trackPageView("ReleaseOverview"),this.ShowOverviewData(e),[2,this.WidgetHelpers.WidgetStatusHelper.Success()]})})},e.prototype.reload=function(e){return r(this,void 0,void 0,function(){return a(this,function(t){return this.ShowOverviewData(e),[2,this.WidgetHelpers.WidgetStatusHelper.Success()]})})},e.prototype.ShowOverviewData=function(e){return r(this,void 0,void 0,function(){return a(this,function(t){switch(t.label){case 0:return $(".title").text(e.name),[4,this.showRelease(e)];case 1:return t.sent(),[2]}})})},e.prototype.showRelease=function(e){return r(this,void 0,void 0,function(){var t,o,r,u,l,p,d,f,h,g,y,v;return a(this,function(a){switch(a.label){case 0:return t=i.getClient(),o=VSS.getWebContext(),r=new s.Overview(0,0,0),u=JSON.parse(e.customSettings.data),[4,t.getReleaseDefinitions(o.project.name)];case 1:if(l=a.sent(),u&&u.selectedDefinitions&&(l=l.filter(function(e){return-1!==u.selectedDefinitions.indexOf(e.name)})),p=!0,u&&(p=u.showRejectedAsFailed),d=l.map(function(e){return e.id}),!(d.length>0))return[3,6];f=[],h=0,g=d,a.label=2;case 2:return h<g.length?(y=g[h],[4,t.getReleases(o.project.id,y,null,null,null,null,null,null,null,null,1,null,n.ReleaseExpands.Approvals|n.ReleaseExpands.Environments)]):[3,5];case 3:v=a.sent(),f=f.concat(v),a.label=4;case 4:return h++,[3,2];case 5:return f.forEach(function(e){switch(c.ReleaseStatus.getStatus(e,p)){case n.DeploymentStatus.InProgress:r.InProgress++;break;case n.DeploymentStatus.Succeeded:r.Succeeded++;break;case n.DeploymentStatus.Failed:r.Failed++}}),$("#failed").text(r.Failed),$("#inprogress").text(r.InProgress),$("#succeeded").text(r.Succeeded),$("#container").removeClass("building success fail"),r.Failed>0?$("#container").addClass("fail"):r.InProgress>0?$("#container").addClass("building"):$("#container").addClass("success"),[3,7];case 6:$("#nodata").text("No release definitions found"),a.label=7;case 7:return[2]}})})},e}();t.OverviewWidget=l}.apply(t,i))&&(e.exports=o)}])});