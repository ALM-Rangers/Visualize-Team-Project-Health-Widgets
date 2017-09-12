//---------------------------------------------------------------------
// <copyright file="release-status.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the TPHealth widget
//    from the ALM Rangers. This file contains the TypeScript 
//    code for getting the status of a release.
// </summary>
//---------------------------------------------------------------------
import TFS_RM_Contracts = require("ReleaseManagement/Core/Contracts");
import TFS_RM_Client = require("ReleaseManagement/Core/RestClient");

export class ReleaseStatus
{
	static getStatus(release: TFS_RM_Contracts.Release, showRejectedAsFailed: boolean): TFS_RM_Contracts.DeploymentStatus {

		var status: TFS_RM_Contracts.DeploymentStatus = TFS_RM_Contracts.DeploymentStatus.Succeeded;

		release.environments.forEach(environment => {

			var stepStatus: TFS_RM_Contracts.DeploymentStatus = TFS_RM_Contracts.DeploymentStatus.Succeeded;

			environment.deploySteps.forEach(step => {

				stepStatus = this.getStepStatus(step, showRejectedAsFailed);

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
	}

	static getStepStatus(deploymentAttempt: TFS_RM_Contracts.DeploymentAttempt, showRejectedAsFailed: boolean): TFS_RM_Contracts.DeploymentStatus {

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
				//case TFS_RM_Contracts.DeploymentOperationStatus.QueuedForPipeline:

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
}