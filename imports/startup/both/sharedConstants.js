// Truely global variables available in BOTH CLIENT and SERVER scopes

console.log("RUNNING /imports/startup/both/sharedConstants.js");


/* Prefixes used by the unique keys generators e.g. GlobalHelper.idGenerator() */
/* These Prefixes used for validating user-exposed content, routing etc  */
uniqueIds = {
	orgPrefix      : "1221",
	kbPrefix       : "2470",
	userPrefix     : "5530",
	uniqueIdLength : "16"
};

listOrgStatuses1              = ["sharedConstantsNoVar","Unlisted","Deleted"];
let listOrgStatuses2          = ["sharedConstantsLet","Unlisted","Deleted"];
const listOrgStatuses3        = ["sharedConstantsConst","Unlisted","Deleted"];
var listOrgStatuses4          = ["sharedConstantsVarThenExport","Unlisted","Deleted"];
export const listOrgStatuses5 = listOrgStatuses4;

