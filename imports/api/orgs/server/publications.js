// # definition of this collection

Meteor.publish("orgs",function() {
	console.log('Publishing orgs from server/publications.js!');
		return MyCollections["Orgs"].find({

			/* TODO - Do we want to allow Server to publish all fields of the Org record? */

			// $or: [
			// 	// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
			// 	{ private: {$ne: true} },
			// 	// Or the owner of the entry is the current user -- regardless of the private setting
			// 	{ owner: this.userId }
			// ]
		});
});

