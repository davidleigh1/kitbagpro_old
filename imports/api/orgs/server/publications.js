// # definition of this collection

import { Orgs } from '/imports/api/orgs/orgs.js';

Meteor.publish("orgs",function() {
	console.log('Publishing "orgs" from apis > orgs > server > publications.js!');
		return Orgs.find({

			/* TODO - Do we want to allow Server to publish all fields of the Org record? */

			// $or: [
			// 	// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
			// 	{ private: {$ne: true} },
			// 	// Or the owner of the entry is the current user -- regardless of the private setting
			// 	{ owner: this.userId }
			// ]
		});
});

