if (Meteor.isClient) {

// Template.kitbagList.helpers

	Template.kitbagList.helpers({
		kitbags: function () {
			if (Session.get('hideFinished')) {
				return MyCollections["Kitbags"].find({checked: {$ne: true}});
			} else {
				return MyCollections["Kitbags"].find();
			}
		}
	});

// Template.kitbagList.events


};

if (Meteor.isServer) {
	// None currently defined
};

Meteor.methods({
	// None currently defined
});