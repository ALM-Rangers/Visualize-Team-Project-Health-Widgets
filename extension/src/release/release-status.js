define(["require", "exports", "ReleaseManagement/Core/Contracts"], function (require, exports, TFS_RM_Contracts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReleaseStatus = /** @class */ (function () {
        function ReleaseStatus() {
        }
        ReleaseStatus.getStatus = function (release, showRejectedAsFailed) {
            var _this = this;
            var status = TFS_RM_Contracts.DeploymentStatus.Succeeded;
            release.environments.forEach(function (environment) {
                var stepStatus = TFS_RM_Contracts.DeploymentStatus.Succeeded;
                environment.deploySteps.forEach(function (step) {
                    stepStatus = _this.getStepStatus(step, showRejectedAsFailed);
                    if (stepStatus !== TFS_RM_Contracts.DeploymentStatus.Succeeded) {
                        status = stepStatus;
                        return false;
                    }
                    return true;
                });
                if (stepStatus !== TFS_RM_Contracts.DeploymentStatus.Succeeded) {
                    status = stepStatus;
                    return false;
                }
                return true;
            });
            return status;
        };
        ReleaseStatus.getStepStatus = function (deploymentAttempt, showRejectedAsFailed) {
            if (deploymentAttempt.status === TFS_RM_Contracts.DeploymentStatus.Succeeded) {
                return TFS_RM_Contracts.DeploymentStatus.Succeeded;
            }
            switch (deploymentAttempt.operationStatus) {
                case TFS_RM_Contracts.DeploymentOperationStatus.Approved:
                case TFS_RM_Contracts.DeploymentOperationStatus.Deferred:
                case TFS_RM_Contracts.DeploymentOperationStatus.ManualInterventionPending:
                case TFS_RM_Contracts.DeploymentOperationStatus.Pending:
                case TFS_RM_Contracts.DeploymentOperationStatus.PhaseInProgress:
                case TFS_RM_Contracts.DeploymentOperationStatus.Queued:
                case TFS_RM_Contracts.DeploymentOperationStatus.QueuedForAgent:
                    return TFS_RM_Contracts.DeploymentStatus.InProgress;
                case TFS_RM_Contracts.DeploymentOperationStatus.Canceled:
                case TFS_RM_Contracts.DeploymentOperationStatus.PhaseCanceled:
                    return TFS_RM_Contracts.DeploymentStatus.NotDeployed;
                case TFS_RM_Contracts.DeploymentOperationStatus.Rejected:
                    if (showRejectedAsFailed) {
                        return TFS_RM_Contracts.DeploymentStatus.Failed;
                    }
                    return TFS_RM_Contracts.DeploymentStatus.Succeeded;
                case TFS_RM_Contracts.DeploymentOperationStatus.PhaseFailed:
                    return TFS_RM_Contracts.DeploymentStatus.Failed;
                case TFS_RM_Contracts.DeploymentOperationStatus.PhasePartiallySucceeded:
                    return TFS_RM_Contracts.DeploymentStatus.PartiallySucceeded;
            }
            return TFS_RM_Contracts.DeploymentStatus.Succeeded;
        };
        return ReleaseStatus;
    }());
    exports.ReleaseStatus = ReleaseStatus;
});
