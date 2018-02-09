import TFS_Build_Contracts = require("TFS/Build/Contracts");

class BuildDetails {
	constructor(
		public status: TFS_Build_Contracts.BuildStatus,
		public result: TFS_Build_Contracts.BuildResult,
		public name: string,
		public queuedBy: string,
		public buildNumber: string,
		public completed: Date,
		public testCoverage: number,
	) { }
}
