if (Meteor.isClient) {

// Template.kitbagLine.helpers

	Template.kitbagLine.helpers({
		lookupOrgTitle: function(orgId,reqField) {
			var ot = GlobalHelpers.lookupFieldFromOrg(orgId,reqField);
			return ot;
		},
		isOwner: function () {
			return this.owner == Meteor.userId();
		},
		isSuperAdmin: function () {
			console.log("TODO: Return correct value for SuperAdmin");
			return true;
		},
		changeKitbagStatus: function () {
			var kbs = (this.kitbagStatus == "Active") ? "Unlisted" : "Active";
			var icon = (kbs == "Active") ? "eye" : "eye-slash";
			var html = " Make "+kbs;
			return {'icon':icon, 'html':html};
		},
		getKitbagStatusTag: function () {
			var labelClass, labelText;

			switch(this.kitbagStatus) {
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


showKbDetails = function (clickObj) {
	// console.log('showKbDetails: ',clickObj,clickObj.bagObj);
};

editKbDetails = function (clickObj) {
	// console.log('editKbDetails: ',clickObj);
	// body...
};

toggleStatus = function (clickObj) {
	// console.log('toggleStatus / currently:'+clickObj.bagObj.kitbagStatus);
	var kbs = (clickObj.bagObj.kitbagStatus == "Active") ? "Unlisted" : "Active";
	Meteor.call("setStatus",clickObj.bagObj._id, kbs);
};

trashKb = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	Meteor.call("setStatus",clickObj.bagObj._id, "Trashed");
};

deleteKb = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	// TODO: Modal confirm - http://stackoverflow.com/questions/8982295/confirm-delete-modal-dialog-with-twitter-bootstrap
	// TODO: Check the original theme/bootstrap to see if modal plugin is already here
	var bagName = (clickObj.bagObj.kitbagTitle != "") ? clickObj.bagObj.kitbagTitle : "<undefined>";
	var c = confirm("Are you sure you want to delete kitbag '"+bagName+"'?\n\nWARNING: This action cannot be undone.");
	if (c == true) {
		Meteor.call("deleteKitbag",clickObj.bagObj._id);
		alert("Kitbag '"+bagName+"' was deleted");
		return true;
	} else {
		alert("Your delete request was cancelled");
		return false;
	}
}


// Template.kitbagLine.events

	Template.kitbagLine.events({
		// TODO - We could make this global to handle all dropdowns!
		'click .dropdown-menu a': function(event) {
			// console.log('a click: ',this,$(event.target).data('action'));
			var clickObj = {
				action: $(event.target).data('action'),
				bagId: $(event.target).data('bag'),
				bagObj: this
			};
			if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
				window[$(event.target).data('action')](clickObj);
			} else {
				console.log("Error: 'action' function was not found (code: 0147)");
			};
//		},
//		'click .toggle-checked': function(event) {
//			var checked = event.target.checked;
//			Meteor.call("updateKitbag",this._id,!this.checked);
//		}, //ends 'click .toggle-checked';
//		'click .delete': function(event) {
//			Meteor.call("deleteKitbag",this._id);
//		}, //ends 'click .delete';
//		'click .toggle-private': function(event){
//			Meteor.call("setPrivateKitbag",this._id, !this.private);
		}
	});

};

if (Meteor.isServer) {
	// None currently defined
};

Meteor.methods({
	// None currently defined
});