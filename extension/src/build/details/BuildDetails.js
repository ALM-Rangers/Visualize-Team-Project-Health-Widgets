define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildDetails = /** @class */ (function () {
        function BuildDetails(status, result, name, queuedBy, buildNumber, completed, testCoverage) {
            this.status = status;
            this.result = result;
            this.name = name;
            this.queuedBy = queuedBy;
            this.buildNumber = buildNumber;
            this.completed = completed;
            this.testCoverage = testCoverage;
        }
        return BuildDetails;
    }());
});
