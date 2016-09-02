if (Meteor.isClient) {

Template.orgAddEdit.onRendered(function(){

	// TODO: THIS IS UGLY! Need to find a way to check against a route name not template name
	// http://stackoverflow.com/questions/31006474/meteor-onrendered-doesnt-get-fired-again-after-second-render-iron-route
	var aoe = (typeof addOrEdit != "undefined") ? addOrEdit : "dunno";
	var torg = (typeof thisOrg == "object") ? thisOrg.orgId : 'dunno';
	var ttitle = (typeof thisOrg == "object") ? thisOrg.orgTitle : 'dunno';
	var a = "Rendered!\nRoute: "+Router.current().route.getName()+"\naddOrEdit: "+aoe+"\norgId: "+torg+"\norgTitle: "+ttitle;
	console.log(a);
	editOrg(thisOrg,"add-edit-org");
	// alert(a);
	if (typeof addOrEdit == "string" && addOrEdit == "edit"){
		alert("EDIT!");
	}
});

// NOT HELPERS!

	getObjFromForm = function(formId,addOrUpdate){
		// console.log('fn getObjFromForm');
		var fields = document.getElementById(formId).elements;
		formObj = {};

		for ( var i = 0; i < fields.length; i++ ) {
			var e = fields[i];
			if (e.dataset.submit !== "true") {
				// console.log("Skipping form field: '" + e.name + "' because 'submit' = '" + e.dataset.submit + "'");
				continue;
			} else {

				if (e.type=="hidden" && e.dataset.type=="array"){
					formObj[e.name] = [];
				}else{
					formObj[e.name] = e.value;
				}

			}
		}
		// Check to see if this is an add or edit form
		if (formObj.createdAt == "") {
			if (addOrUpdate == "add") {
				// All good!
				formObj.createdAt = new Date();
			} else {
				alert("Missing 'createdAt' value");
			}
		}
		// Always update the UpdatedAt timestamp!
		formObj.updatedAt = new Date();
		formObj.owner = Meteor.userId();

		// Validation
		if((typeof formObj.orgTitle != "undefined" && formObj.orgTitle == "") || (typeof formObj.kitbagTitle != "undefined" && formObj.kitbagTitle == "")){
			console.log('Failed validation!',formObj);
			return false;
		}else{
			console.log('Passed validation!',formObj);
			return formObj;
		}
	}

	editOrg = function(thisOrg,formId){

		var formId = (typeof formId !== "undefined") ? formId : "add-edit-org";

		console.log('fn getObjFromForm','orgId:'+thisOrg.orgId,'formId:'+formId);

		// MyCollections["Orgs"].findOne({orgId: ""+});

		myOrg = thisOrg;
		// myOrg = MyCollections["Orgs"].findOne({orgId: ""+orgId});
		// console.log(myOrg);


		var formFields = document.getElementById(formId).elements;
		// console.log(formFields);

		// console.log("Org found: ",myOrg);
		// console.log("Form found: ",formFields);

		//formObj = {};

		for ( let i = 0; i < formFields.length; i++ ) {
			let e = formFields[i];

			if (e.name == "owner") {
				let un = GlobalHelpers.lookupNameFromUser(myOrg[e.name],"name");
				e.value = un + " (" + myOrg[e.name] + ")";
				continue;
			}

			if (e.dataset.submit !== "true") {
				// console.log("Skipping form field: '" + e.name + "' because 'submit' = '" + e.dataset.submit + "'");
				continue;
			} else {

				// Skip undefined (rather than "undefined") responses which now return since we added the schema
				console.log(e.name + " TYPE: " + typeof myOrg[e.name]);
				if (typeof myOrg[e.name] == "undefined"){
					console.log("continue");
					continue;
				}

				// Add the values from myOrg
				if (e.type=="hidden" && e.dataset.type=="array"){
					e.value = myOrg[e.name];
				}else{
					e.value = myOrg[e.name];
				}

			}
		}
	};


// Template.myTemplateName.helpers
	Template.orgAddEdit.helpers({
		title: function () {
			var aoe = (typeof addOrEdit != "undefined" && addOrEdit == "edit" ) ? "Edit: " : "Register New Organisation";
			var org = (typeof thisOrg == "object" && thisOrg.orgTitle && thisOrg.orgTitle !== "") ? thisOrg.orgTitle : "";
			var title = aoe + org
			return title;
		},
		listOrgStatuses: function () {
			return listOrgStatuses;
		},
		getSchemaVar: function (param) {
			// console.log('getSchemaVar: ',param);
			return MyCollections[param];
		}
	});


// Template.myTemplateName.events

	Template.orgAddEdit.events({
		//'submit .add-edit-org': function(event) {
		'click button.submit': function(event) {
			console.log('cside - clicked!');
			// var orgTitle = event.target.orgTitle.value;
			event.preventDefault();
			// console.log('submit button!');
			// console.log(getObjFromForm("add-edit-org"));

			var formObj;

			// CHECK TO SEE IF THIS FORM REQUIRES AN ADD OR AN UPDATE - CHECK FOR AN EXISTING ID
			if ( $("#orgId").val() == false ) {
				console.log('cside - false!');
				// An OrgID was *not* found in the form so assume this is a new Org
				$("#orgId").val("org_"+GlobalHelpers.idGenerator());
				formObj = getObjFromForm("add-edit-org","add");
				if (typeof formObj == "object") {
					console.log('cside - typeof formObj == object');
					Meteor.call("addOrg", formObj );
				} else {
					console.log('ERROR: getObjFromForm() failed to provide formObj{}. DB insert action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 924]');
				}
				// outcome = Meteor.call("addOrg", getObjFromForm("add-edit-org","add") );
			} else {
				console.log('cside - true!');
				// An OrgID *was* found in the form so assume this is an edit to an existing Org
				// TODO - Catch a case where there is an ID in the form but it's not found in the DB.  This could happen as we have multiple users who could affect this object at any time.
				formObj = getObjFromForm("add-edit-org","update");
				if (typeof formObj == "object") {
					Meteor.call("updateOrg", formObj );
				} else {
					console.log('ERROR: getObjFromForm() failed to provide formObj{}. DB update action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 925]');
				}
				// outcome = Meteor.call("updateOrg", getObjFromForm("add-edit-org","update") );
			}

			console.log('cside - returned!');

			// Add to Collection
			// TODO - delete outcome
			// Meteor.call("addOrgFromForm","add-edit-org");
			// console.log("outcome: ",outcome);

			// Clear the input field which is not required when using non-CSS UI
			// event.target.orgTitle.value = "";
			$(".add-edit-org")[0].reset();
			// $(".orgAddEdit").hide();
			// Prevent the default page refresh which occurs when clicking submit
			Router.go("/orgView/"+formObj.orgId);
			return false;
		},
		'click button.cancel': function(event) {
			event.preventDefault();
			$(".add-edit-org")[0].reset();
			// $(".orgAddEdit").hide();
			Router.go("/orgView/"+formObj.orgId);
			// Prevent the default page refresh which occurs when clicking submit
			return false;
		}
	});

};

if (Meteor.isServer) {


};


/* Moved to main.js
Meteor.methods({
	addOrg: function(orgObj){
		console.log('fn addOrg()');

		if(typeof orgObj != "object" || orgObj == false){
			console.log('ERROR: No orgObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 909]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}

		MyCollections["Orgs"].insert(orgObj);
		console.log('added Org: ',orgObj);
		return true;
	},
	updateOrg: function(updatedObj,checked){
		console.log("fn updateOrg()");
		// var res = MyCollections["Orgs"].findOne(id);
		var dbOrg = MyCollections["Orgs"].findOne({orgId:updatedObj.orgId});
		var editId = dbOrg._id;
		console.log("OrgId to be updated: ",editId);
		console.log("updatedObj: ",updatedObj);

		if (updatedObj._id) {
			// http://stackoverflow.com/questions/24103966/
			console.log("deleting: ",updatedObj._id);
			delete updatedObj._id;
		}

		MyCollections["Orgs"].update(editId, { $set: updatedObj});

		// TODO: Add "LastUpdatedAt" and "LastUpdatedBy" fields - will be used for debugging and sorting

//		TODO: Restore protection to avoid non-associated users from updating objects
//		if (res.owner !== Meteor.userId()){
//			//throw new Meteor.Error('You are not authorized to update items owned by other users (error code: 34.7)');
//			console.log('ERROR: You are not authorized to update items owned by other users [error code: 347]');
//			return false;
//		}else{
//			MyCollections["Orgs"].update(id, { $set: {checked: checked}});
//		}
	},
	deleteOrg: function(id){
		var res = MyCollections["Orgs"].findOne(id);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to delete items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to delete items owned by other users [error code: 34.6]');
			return false;
		}else{
			MyCollections["Orgs"].remove(id);
		}
	},
	setPrivateOrg: function(id,private){
		var res = MyCollections["Orgs"].findOne(id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			MyCollections["Orgs"].update(id, { $set: {private: private}});
		}

	}
});
*/