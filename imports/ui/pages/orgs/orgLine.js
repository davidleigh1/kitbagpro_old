import './orgLine.html';

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
	getOrgStatusTag: function () {
		var labelClass, labelText;

		switch(this.orgStatus) {
			case "Active":
				labelClass = "label-success";
				labelText = "Active";
				break;
			case "Unlisted":
				labelClass = "label-warning";
				labelText = "Unlisted";
				break;
			case "Trashed":
				labelClass = "label-default";
				labelText = "Trashed";
				break;
			default:
				labelClass = "label-danger";
				labelText = "Unknown";
			break;
		}
		//var tag = '<span class="label '+labelClass+'">'+labelText+'</span>';
		return { 'labelClass': labelClass, 'labelText': labelText };
	}
});

Template.orgLine.events({
	'click .showDetail': function(event) {
		// et = event.target;
		// console.log(et);
		// $( et.parentElement.parentElement ).children( '.orgDetails' ).toggle();
		var o = $(event.target).data("org");
		FlowRouter.go("/orgs/"+o+"/view");
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
		FlowRouter.go("/orgs/"+event.target.dataset.org+"/edit");
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


