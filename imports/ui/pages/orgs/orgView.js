// import { Session } from 'meteor/session'

import './orgView.html';
import './orgView.css';

import { Orgs } from '/imports/api/orgs/orgs.js';
import { listOrgStatuses } from '/imports/api/orgs/orgs.js';


Template.orgView.onCreated(function() {

	// this.subscribe("orgs", {
	// 	onReady: function () {
	// 		console.log("onReady and the items actually Arrive", Orgs.find().count() );
	// 		// viewOrg( FlowRouter.getParam('_orgId') );
	// 	},
	// 	onError: function () {
	// 		console.log("onError", arguments);
	// 	}
	// });


// var handle = Meteor.subscribe('posts');
// Tracker.autorun(function() {
});


Template.orgView.onRendered(function(){

	// TODO: THIS IS UGLY! Need to find a way to check against a route name not template name
	// http://stackoverflow.com/questions/31006474/meteor-onrendered-doesnt-get-fired-again-after-second-render-iron-route

/*

	console.log("--- onRendered ------------------------------------------");
	console.log("FlowRouter: ",FlowRouter);
	console.log("getRouteName: " + FlowRouter.getRouteName());
	console.log("getParam: " + FlowRouter.getParam('_orgId'));
	console.log("getQueryParam: " + FlowRouter.getQueryParam());
	console.log("---------------------------------------------------------");
*/

});

// NOT HELPERS!

// viewOrg = function (thisOrgId) {
// 	var myOrg = Orgs.findOne({orgId: ""+thisOrgId});

// 	console.log("viewOrg",myOrg);
// };

// Template.myTemplateName.helpers
Template.orgView.helpers({
	thisOrg: function (thisOrgId) {
		var myOrg = Orgs.findOne({orgId: FlowRouter.getParam('_orgId') });
		//console.log("orgProfile",myOrg);
		return myOrg;
	},
	// getTitle: function(context){
	// 	var c = (!context) ? isAddViewOrEdit( FlowRouter.getRouteName() ) : context;
	// 	switch( c ) {
	// 		case "view":
	// 			return Spacebars.SafeString("View Organisation Profile");
	// 			break;
	// 		case "edit":
	// 			return Spacebars.SafeString("Update Organisation Profile");
	// 			break;
	// 		case "add":
	// 		default:
	// 			return Spacebars.SafeString("Register New Organisation");
	// 	}
	// },
	// getIcon: function(context){
	// 	var c = (!context) ? isAddViewOrEdit( FlowRouter.getRouteName() ) : context;
	// 	switch( c ) {
	// 		case "view":
	// 			return Spacebars.SafeString("fa fa-building");
	// 			break;
	// 		case "edit":
	// 			return Spacebars.SafeString("fa fa-pencil-square");
	// 			break;
	// 		case "add":
	// 		default:
	// 			return Spacebars.SafeString("fa fa-plus-square");
	// 	}
	// },
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
	},
	userNameLookup: function (userId, paramRequired) {
		var myUser = Meteor.users.findOne({_id: userId });
		// Orgs.findOne({orgId: FlowRouter.getParam('_orgId') });
		// console.log("myUser",myUser.profile.name);

		var data = {};
		data.uname = (myUser && myUser.profile.name)?myUser.profile.name:"Profile Name not found";
		data.dbId  = userId;
		data.apiId = (myUser && myUser.profile.externalId)?myUser.profile.externalId:"API-ID not found";
		data.url   = "/users/"+userId+"/view";
		data.html  = "<a href='"+data.url+"'>"+data.uname+"</a>";

		return Spacebars.SafeString( data[paramRequired] );
	}
});


// Template.myTemplateName.events
Template.orgView.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});