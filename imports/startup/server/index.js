// # import server startup through a single index entry point

console.log("RUNNING server.index.js");


// import { Meteor } from 'meteor/meteor';

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
// import '../imports/startup/server/fixtures.js';
import './fixtures.js';
// import '../imports/startup/server/schema-kitbags.js';
// import './schema-kitbags.js';
// import '../imports/startup/server/schema-orgs.js';
// import './schema-orgs.js';

/* 
	// Not loaded... 
	import '../imports/startup/server/kadira.js';
*/


// This file configures the Accounts package to define the UI of the reset password email.
	// import '../imports/startup/server/reset-password-email.js';

// Set up some rate limiting and other important security settings.
	// import '../imports/startup/server/security.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
//console.log('SKIPPING api.js');
console.log("IMPORT register-api.js");
import './register-api.js';