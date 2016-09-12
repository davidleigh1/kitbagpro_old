if (Meteor.isClient) {

	Template.menu.helpers({
		isOwner: function () {
			// return this.owner == Meteor.userId();
		}
	});

	Template.menu.events({
		// TODO: Check if menu has togDiv and toggle on that param
		'click .menu-option': function(event, template) {
			// console.log(event.target.dataset);
			// if (typeof event.target.dataset.toggle != "undefined"){
			// 	$('.screen-wrapper').hide();
			// 	$(event.target.dataset.toggle).toggle();
			// }
		},
		'click .delete': function(event) {
			// Meteor.call("deleteKitbag",this._id);
		},
		'click .toggle-private': function(event){
			// Meteor.call("setPrivate",this._id, !this.private);
		}
	});

};

Meteor.methods({
	// None currently defined
});