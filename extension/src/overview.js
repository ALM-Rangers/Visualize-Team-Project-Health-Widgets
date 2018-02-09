// ---------------------------------------------------------------------
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
//    code for the configuration page of the details widget.
// </summary>
// ---------------------------------------------------------------------
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Overview = /** @class */ (function () {
        function Overview(Failed, Succeeded, InProgress) {
            this.Failed = Failed;
            this.Succeeded = Succeeded;
            this.InProgress = InProgress;
        }
        return Overview;
    }());
    exports.Overview = Overview;
});
