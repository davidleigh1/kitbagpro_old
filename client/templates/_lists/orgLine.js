if (Meteor.isClient) {

	Template.orgLine.helpers({
		isOwner: function () {
			return this.owner == Meteor.userId();
		},
	    // TODO: Make this global!
	    toLower: function (str) {
	      // console.log(str,str.toLowerCase());
	      if (!str) { return str }
	      return str.toLowerCase();
	    },
	    highlight: function(foundThis,searchString) {
	      // console.log("highlight",foundThis,filterVar);
	      re = new RegExp(filterVar, "i");
	      // http://stackoverflow.com/questions/2647867/
	      if ( filterVar == null || filterVar == "" || filterVar == ".*"  ) {
	        return foundThis;
	      } else {
	        highlighted = foundThis.replace(re, "<span class='filterHighlight'>$&</span>")
	        // Spacebars.SafeString() tells Handlebars that this string is presumed to be safe, and to use
	        // the riskier method of inserting the returned vales as HTML directly into the DOM rather than
	        // more safely (and by default) limiting the inserted values to be text only.
	        // http://stackoverflow.com/questions/23415182/
	        return Spacebars.SafeString(highlighted);
	      }
	    }
	});

	Template.orgLine.events({
		'click .showDetail': function(event) {
			// et = event.target;
			// console.log(et);
			// $( et.parentElement.parentElement ).children( '.orgDetails' ).toggle();
			var o = $(event.target).data("org");
			Router.go("/orgView/"+o);
			// $(".objView-"+o).toggle();
		},
		'click .edit': function(event) {
			// TODO: Don't set in global scope!
			// et = event.target;
			// console.log(et);
			// TODO: Replace this show/hide/toggle bit with a global view controller!
			// $('.screen-wrapper').hide();
			// $('.orgAddEdit').toggle();
			// var findOne = {orgId:event.target.dataset.org};
			// var formId = "add-edit-org";
			Router.go("/org/"+event.target.dataset.org);
			// editOrg(findOne,formId);
		},
		'click .toggle-checked': function(event) {
			var checked = event.target.checked;
			Meteor.call("updateOrg",this._id,!this.checked);
		},
		'click .delete': function(event) {
			Meteor.call("deleteOrg",this._id);
		},
		'click .toggle-private': function(event){
			Meteor.call("setPrivateOrg",this._id, !this.private);
		}
	});



};

if (Meteor.isServer) {
	// None currently defined
};

Meteor.methods({
	// None currently defined
});