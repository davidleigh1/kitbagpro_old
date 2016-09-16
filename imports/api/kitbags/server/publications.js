// # definition of this collection

import { Kitbags } from '/imports/api/kitbags/kitbags.js';

Meteor.publish("kitbags",function() {
	console.log('Publishing "kitbags" from apis > kitbags > server > publications.js!');
		return Kitbags.find({

			/* TODO - Do we want to allow Server to publish all fields of the Org record? */

			// $or: [
			// 	// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
			// 	{ private: {$ne: true} },
			// 	// Or the owner of the entry is the current user -- regardless of the private setting
			// 	{ owner: this.userId }
			// ]
		});
});