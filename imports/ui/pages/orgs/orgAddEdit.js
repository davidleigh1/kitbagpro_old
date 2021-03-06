// import { Session } from 'meteor/session'

import './orgAddEdit.html';

import { Orgs } from '/imports/api/orgs/orgs.js';
import { listOrgStatuses } from '/imports/api/orgs/orgs.js';


Template.orgAddEdit.onCreated(function() {
	console.log("Template.orgAddEdit.onCreated -------------------------------------- onCreated");

// 	this.autorun(() => {
//     	this.subscribe('Orgs');
// 	});
// });

	// var handle2 = Meteor.subscribe('Orgs');

	// this.autorun(() => {
 //    	this.subscribe('Orgs');
 //    	if ( handle2.ready() ){
 //    		console.log("HANDLE2.READY!!!!!!!!!!!!!!!");
 //    	}else{
 //    		console.log("HANDLE2.NOT READY !!");
 //    	}
	// });

	this.subscribe("orgs", {
		onReady: function () { 

			console.log("onReady And the Items actually Arrive", arguments); 

			var oid = FlowRouter.getParam('_orgId');
			var avoe = isAddViewOrEdit( FlowRouter.getRouteName() );
			switch( avoe ) {
				case "view":
					console.log("Context VIEW - View Organisation Profile for: "+oid);
					editOrg( oid );
					break;
				case "edit":
					console.log("Context EDIT - Update Organisation Profile for: "+oid);
					editOrg( oid );
					break;
				case "add":
					console.log("Context ADD - Register New Organisation");
					break;
				default:
					console.log("Context NOTFOUND - Register New Organisation");
					return;
			}

		},
		onError: function () { console.log("onError", arguments); }
	});


// var handle = Meteor.subscribe('posts');
// Tracker.autorun(function() {
});


Template.orgAddEdit.onRendered(function(){

	// TODO: THIS IS UGLY! Need to find a way to check against a route name not template name
	// http://stackoverflow.com/questions/31006474/meteor-onrendered-doesnt-get-fired-again-after-second-render-iron-route

	console.log("---------------------------------------------------------");
	console.log("FlowRouter: ",FlowRouter);
	console.log("getRouteName: " + FlowRouter.getRouteName());
	console.log("getParam: " + FlowRouter.getParam('_orgId'));
	console.log("getQueryParam: " + FlowRouter.getQueryParam());
	console.log("---------------------------------------------------------");

	var rn = FlowRouter.getRouteName();
	var oid = FlowRouter.getParam('_orgId');
	var avoe = isAddViewOrEdit( FlowRouter.getRouteName() );
	var validOrgInUrl = ( typeof oid == "string" && oid.indexOf("org_")>=0  && (['view', 'edit'].indexOf(avoe) >= 0) );
	var thisOrg;

	// MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});


	console.log("Moved to onReady")
/*
	switch( avoe ) {
		case "view":
			console.log("Context VIEW - View Organisation Profile for: "+oid);
			editOrg( oid );
			break;
		case "edit":
			console.log("Context EDIT - Update Organisation Profile for: "+oid);
			editOrg( oid );
			break;
		case "add":
			console.log("Context ADD - Register New Organisation");
			break;
		default:
			console.log("Context NOTFOUND - Register New Organisation");
			return;
	}
*/



	// console.log("Route: "+FlowRouter.current().route.name);
	// editOrg(thisOrg,"add-edit-org");
	// alert(a);
});

// NOT HELPERS!

isAddViewOrEdit = function (routeName) {
	var rt = (!routeName) ? FlowRouter.getRouteName() : routeName;
	var contextStr = rt.replace("org","").toLowerCase();
	var isAddViewOrEdit = (['add', 'view', 'edit'].indexOf(contextStr) >= 0) ? contextStr : undefined;
	return isAddViewOrEdit;
};

getObjFromForm = function(formId,addOrUpdate){
	console.log('fn getObjFromForm');
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

			if ("kitbagAssocOrg" == e.name){
				formObj.kitbagAssocOrgTitle = $("select[name=kitbagAssocOrg] option:selected").text().trim();
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
};

editOrg = function(thisOrgId,formId){

	// alert("editOrg",thisOrgId,formId);

	var formId = (typeof formId !== "undefined") ? formId : "add-edit-org";

	console.log('fn getObjFromForm',' thisOrgId:'+thisOrgId,' formId:'+formId);

	// MyCollections["Orgs"].findOne({orgId: ""+});

	// myOrg = thisOrg;
	myOrg = Orgs.findOne({orgId: ""+thisOrgId});
	// testOrg = Orgs.findOne({orgId: "12210deb6402efb6"});
	//console.log(">>>>>>======>>>>>> myOrg: ", thisOrgId);


	var formFields = document.getElementById(formId).elements;
	console.log(formFields);

	console.log("Org found: ",myOrg);
	console.log("Form found: ",formFields);

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
			// console.log(e.name + " TYPE: " + typeof myOrg[e.name]);
			if (typeof myOrg[e.name] == "undefined"){
				// console.log("continue");
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
	getTitle: function(context){
		var c = (!context) ? isAddViewOrEdit( FlowRouter.getRouteName() ) : context;
		switch( c ) {
			case "view":
				return Spacebars.SafeString("View Organisation Profile");
				break;
			case "edit":
				return Spacebars.SafeString("Update Organisation Profile");
				break;
			case "add":
			default:
				return Spacebars.SafeString("Register New Organisation");
		}
	},
	getIcon: function(context){
		var c = (!context) ? isAddViewOrEdit( FlowRouter.getRouteName() ) : context;
		switch( c ) {
			case "view":
				return Spacebars.SafeString("fa fa-building");
				break;
			case "edit":
				return Spacebars.SafeString("fa fa-pencil-square");
				break;
			case "add":
			default:
				return Spacebars.SafeString("fa fa-plus-square");
		}
	},
	listOrgStatuses: function () {
		console.log(listOrgStatuses);
		return listOrgStatuses;
	},
	getSchemaVar: function (param) {
		console.log('getSchemaVar: ',param,"\n\n\nTODO - No better way to do this?????\n\n\n");
		return window[param];
	}
});


// Template.myTemplateName.events
Template.orgAddEdit.events({
	//'submit .add-edit-org': function(event) {
	'click button.submit': function(event) {
		// console.log('cside - clicked!');
		// var orgTitle = event.target.orgTitle.value;
		event.preventDefault();
		// console.log('submit button!');
		// console.log(getObjFromForm("add-edit-org"));

		var formObj;

		// CHECK TO SEE IF THIS FORM REQUIRES AN ADD OR AN UPDATE - CHECK FOR AN EXISTING ID
		if ( $("#orgId").val() == false ) {
			// console.log('cside - orgID value not found!');
			// An OrgID was *not* found in the form so assume this is a new Org
			$("#orgId").val( GlobalHelpers.idGenerator(uniqueIds.orgPrefix) );
			formObj = getObjFromForm("add-edit-org","add");
			if (typeof formObj == "object") {
				console.log('cside - typeof formObj == object');
				Meteor.call("addOrg", formObj );
			} else {
				// console.log('ERROR: getObjFromForm() failed to provide formObj{}. DB insert action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 924]');
			}
			// outcome = Meteor.call("addOrg", getObjFromForm("add-edit-org","add") );
		} else {
			// console.log('cside - true!');
			// An OrgID *was* found in the form so assume this is an edit to an existing Org
			// TODO - Catch a case where there is an ID in the form but it's not found in the DB.  This could happen as we have multiple users who could affect this object at any time.
			formObj = getObjFromForm("add-edit-org","update");
			if (typeof formObj == "object") {
				Meteor.call("updateOrg", formObj );
			} else {
				// console.log('ERROR: getObjFromForm() failed to provide formObj{}. DB update action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 925]');
			}
			// outcome = Meteor.call("updateOrg", getObjFromForm("add-edit-org","update") );
		}

		// console.log('cside - returned!');

		// Add to Collection
		// TODO - delete outcome
		// Meteor.call("addOrgFromForm","add-edit-org");
		// console.log("outcome: ",outcome);

		// Clear the input field which is not required when using non-CSS UI
		// event.target.orgTitle.value = "";
		$(".add-edit-org")[0].reset();
		// $(".orgAddEdit").hide();
		// Prevent the default page refresh which occurs when clicking submit
		/* TODO - Should we wait for the callback event to confirm org was created successfully? */
		//--- FlowRouter.go("/orgs/"+formObj.orgId+"/view", { _id: orgId });
		return false;
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		$(".add-edit-org")[0].reset();
		// $(".orgAddEdit").hide();
		//--- FlowRouter.go("/orgs/"+formObj.orgId+"/view");
		// Prevent the default page refresh which occurs when clicking submit
		return false;
	}
});




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