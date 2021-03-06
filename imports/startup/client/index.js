console.log("RUNNING /imports/startup/client/index.js");
/* Imports are included in all new Meteor Projects... since 1.3? */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/* import './main.html'; */

import { Orgs } from '/imports/api/orgs/orgs.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { listOrgStatuses } from '/imports/api/orgs/orgs.js';


import './routes.js';


Template.body.onRendered(function() {

	const orgHandle = Meteor.subscribe('orgs');
	Tracker.autorun(() => {
		const isReady = orgHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		console.log("**** Handle for orgs is " + status + "");
		// if (status == "ready") { 
		// 	allSubscriptionsReady("orgHandle"); 
		// }
	});

	const kbHandle = Meteor.subscribe('kitbags');
	Tracker.autorun(() => {
		const isReady = kbHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		console.log("**** Handle for kitbags is " + status + "");
		// if (status == "ready") { 
		// 	allSubscriptionsReady("kbHandle"); 
		// }
	});

});

// allSubscriptionsReady = function (handleName) {
// 	console.log("\nallSubscriptionsReady:");
// 	console.log("kbHandle.ready(): "+kbHandle.ready(),"orgHandle.ready(): "+orgHandle.ready());

// 	if(kbHandle.ready() && orgHandle.ready()){
// 		console.log("**** Not all ready!");
// 		return false;
// 	}else{
// 		console.log("**** All ready!");
// 		initGlobalHelpers();
// 	}
// 	// body...
// }



/* configuration for collections */
// MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};

// console.log(">>>>> 'MyCollections' is defined here!");

// MyCollections.Kitbags = new Mongo.Collection("kitbags");
// MyCollections.Orgs    = new Mongo.Collection("orgs");

// MyCollections.listKitbagStatuses = ["Active","Unlisted","Trashed"];
// MyCollections.listOrgStatuses    = ["Active","Unlisted","Deleted"];





/*Template.hello.onCreated(function helloOnCreated() {
	// counter starts at 0
	this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
	counter() {
		return Template.instance().counter.get();
	},
});

Template.hello.events({
	'click button'(event, instance) {
		// increment the counter when button is clicked
		instance.counter.set(instance.counter.get() + 1);
	},
});*/








// if (Meteor.isClient) {

	// console.log("Subscribing to collections");
/*
	Meteor.subscribe("orgs");
	Meteor.subscribe("kitbags");
	Meteor.subscribe("userList");
*/


	Meteor.startup(function() {
		// console.log("Loading Google fonts");
		WebFontConfig = {
			google: { families: [ 'Open+Sans:400,300,600,700:latin' ] }
		};
		(function() {
			var wf = document.createElement('script');
			wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
			wf.type = 'text/javascript';
			wf.async = 'true';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(wf, s);
		})();
	});

	GlobalHelpers = {
		// Random number generator for object IDs (to avoid using the Mongo doc Id)
		// http://stackoverflow.com/questions/105034/
		// See: http://stackoverflow.com/questions/894860/ for ES6/ES2015, default parameters
		idGenerator: function(prefix="", suffix="", reqLength=uniqueIds.uniqueIdLength){
			// console.log('Global idGenerator ' , prefix , suffix , reqLength);
			var S4 = function() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
			// return prefix+(S4()+S4()+S4());
			var guid = ""; 
			for (var i = Number( Math.ceil(reqLength/4) ) - 1; i >= 0; i--) {
				guid += "" + S4();
			}
			// Count the characters in headers/footers and truncate random string to total length is met
			var randomCharsNeeded = Number(reqLength) - prefix.length - suffix.length; 
			guid = prefix + guid.substring(0,randomCharsNeeded) + suffix;
			return guid;
		},
		isValidId: function (id,typeOfId) {

				// alert("Remove this function if not required!\nShould allow more flexible Org IDs")

			if ( FlowRouter.getQueryParam("force") == "true" ) {
				console.log("isValidId('"+id+"','"+typeOfId+"') - Alert: Overridden");
				return true;
			}

			if (!id || id == "" || !typeOfId || typeOfId == "") {
				console.log("isValidId('"+id+"','"+typeOfId+"') - Error: Insufficient arguments provided");
				return false;
			}
			// uniqueIds.orgPrefix      : "1221"
			// uniqueIds.kbPrefix       : "2470"
			// uniqueIds.userPrefix     : "5530"
			// uniqueIds.uniqueIdLength : "16"

			/* Check if string of ID is required length */
			if ( id.toString().length != uniqueIds.uniqueIdLength ) {
				console.log("isValidId('"+id+"','"+typeOfId+"') - Error: Value is incorrect length. - expected '"+uniqueIds.uniqueIdLength+"' chars but got '"+id.toString().length+"'");
				return false;
			}

			/* Check if ID is a valid integer */
			if ( /^\+?[0-9]+$/.test(id) == false ) {
				console.log("isValidId('"+id+"','"+typeOfId+"') - Warning: Value might not a valid '"+uniqueIds.uniqueIdLength+" ID'.  May contain letters or spaces");
				// return false;
			}

			/* Check if ID has correct prefix and suffix */
			var prefixToCheck = (typeOfId == "org") ? uniqueIds.orgPrefix :  (typeOfId == "kb" || typeOfId == "kitbag") ? uniqueIds.kbPrefix : (typeOfId == "user") ? uniqueIds.userPrefix : false;			// uniqueIds.orgPrefix      : "1221"
			if ( prefixToCheck != id.substr( 0 , prefixToCheck.length ) ) {
				console.log("isValidId('"+id+"','"+typeOfId+"') - Error: Value does not have a valid prefix - expected '"+prefixToCheck+"' but found '"+id.substr( 0 , prefixToCheck.length )+"'");
				return false;
			}

			/* Otherwise - Mazal tov! */
			return true;

		},
		// Takes an Organisation ID and responds with the value of the requested field for that organisation e.g. {{lookupOrg kitbagAssocOrg 'orgTitle'}}
		lookupFieldFromOrg: function(orgId,requiredField){
			console.log(">>> lookupFieldFromOrg("+orgId+","+requiredField+")");
			// console.log(orgId,requiredField);
			// var fieldObj = {};
			// fieldObj[requiredField] = 1;
			// var localOrg = MyCollections["Orgs"].findOne({orgId: ""+orgId});
			var localOrg = Orgs.findOne({orgId: ""+orgId});
			console.log("returned org: ",localOrg);
			return localOrg[requiredField];
		},
		// Takes a User ID and responds with the value of the requested field for that user e.g. {{lookupUser owner 'name'}}
		lookupNameFromUser: function(userId,requiredField){
			// console.log(userId,requiredField);
			if (!userId || userId == "") {
				console.log("lookupNameFromUser() - userId not provided");
				return false;
			}
			if (requiredField == "name" || !requiredField) {
				var userObj = Meteor.users.find().collection._docs._map[userId];
				// console.log(userId,userObj);
				// User not found!
				if ( jQuery.isEmptyObject(userObj) ){
					var message = "Error: User '" + userId + "' not found";
					console.log(message);
					return message;
				}
				var uname = jQuery.isEmptyObject(userObj.profile) ? (typeof userObj.username == "string" ? userObj.username : "Unknown") : (typeof userObj.profile.name == "string" ? userObj.profile.name : "Unknown");
				return uname;
			}
			// TODO - RETURN SERVICE TOO!
		},
		// Takes a kitbag ID and responds with the value of the requested field for that kitbag e.g. {{lookupKb orgAssocKitbags 'kitbagTitle'}}
		lookupFieldFromKb: function(kitbagId,requiredField){
			// console.log(kitbagId,requiredField);
			// var localKb = MyCollections["Kitbags"].findOne({kitbagId: ""+kitbagId});
			var localKb = Kitbags.findOne({kitbagId: ""+kitbagId});
			// console.log("returned kitbag: ",localKb);
			if (typeof localKb == "object"){
				return localKb[requiredField];
			} else {
				return "Unknown Kitbag ("+kitbagId+")";
			}
		}
	};

	Template.registerHelper('formatDate', function(timestamp, defaultText) {
		// console.log("formatDate() "+timestamp, defaultText);
		if (!timestamp || timestamp == "Unknown"){
			if (!defaultText) {
				return timestamp;
			}
			return defaultText;
		}
		var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
		try {
			return timestamp.toLocaleDateString('en-GB') + " " + timestamp.toLocaleTimeString();
		} catch (err) {
			// TODO: Replace with translatable string
			console.log("Date error!\nReceived: "+timestamp+"\nError: "+err);
			return Spacebars.SafeString("<div class='alert-danger'>Date Error</div>");
		}
		//return new Date(timestamp).toString('yyyy-MM-dd')
	});

	// http://stackoverflow.com/questions/15035363
	Template.registerHelper('arrayFromObj',function(obj){
		result = [];
		// console.log(obj);
		for (var key in obj){
			// Map kitbag IDs to names
			if (typeof obj[key] == "object" && key == "orgAssocKitbags"){
				var newkey = [];
				$.each( obj[key] , function( key, value ) {
					// console.log( key + ": " + value );
					var kbt = GlobalHelpers.lookupFieldFromKb( value ,"kitbagTitle");
					newkey.push(kbt);
				});
				// var newKey = GlobalHelpers.lookupFieldFromKb(obj[key],"kitbagTitle");
				// console.log("newKey: "+newkey);
				result.push({
					arrayObjName: key,
					arrayObjValue: newkey
				});
			}else{
				result.push({
					arrayObjName: key,
					arrayObjValue: obj[key]
				});
			}
		}
		// console.log(result);
		return result;
	});

	Template.registerHelper('log',function(logTxt,showThis){
		if (showThis == true){
			console.log(logTxt,this);
		}else{
			console.log(logTxt);
		}
	});


	Template.registerHelper('highlight',function(foundThis,searchString){
		console.log("highlight",foundThis,filterVar);
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
	});


	Template.registerHelper('objectsFiltered',function(CollectionName){
	// reactively return the objects who are older than the input value
		// console.log("objectsFiltered()", typeof filterVar );
		filterVar = Template.instance().filter.get();
		console.log("filter:",CollectionName,filterVar,typeof filterVar);
		// TODO: Make a better validation than this!
		// See: http://stackoverflow.com/questions/30314447 in place of .isNaN!
		if (typeof filterVar == "undefined"){
		// Return all!
			filterVar = ".*";
		// return Persons.find({sort: {"name": "asc"}});
		}

		// if (CollectionName == "Orgs"){
		// 	var docFound = Orgs.find({
		// 		orgTitle:{
		// 			$regex: new RegExp(filterVar, "i")
		// 		}
		// 	});
		// 	// },{sort: {"name": "asc"}});
		// 	// console.log("docFound!",docFound);
		// 	return docFound;	
		// }
		if (CollectionName == "Orgs"){
			var docsFound = Orgs.find({
				$or: [
					{orgTitle: 	{ $regex: new RegExp(filterVar, "i") }},
					{orgId: 	{ $regex: new RegExp(filterVar, "i") }}
				]
			});
			return docsFound;
		}
		// if (CollectionName == "Kitbags"){
		// 	var docsFound = Kitbags.find({
		// 		kitbagTitle:{
		// 			$regex: new RegExp(filterVar, "i")
		// 		}
		// 	});
		// 	return docsFound;
		// }
		if (CollectionName == "Kitbags"){
			var docsFound = Kitbags.find({
				$or: [
					// {expires: {$gte: new Date()}},
					// {expires: null}
					{kitbagTitle: 	{ $regex: new RegExp(filterVar, "i") }},
					{kitbagId: 		{ $regex: new RegExp(filterVar, "i") }},
					{kitbagSku: 	{ $regex: new RegExp(filterVar, "i") }},
					{kitbagAssocOrgTitle: 	{ $regex: new RegExp(filterVar, "i") }}
				]
			});
			return docsFound;
		}
		// if (CollectionName == "Kitbags"){
			
		// 	// Returns any doc where there is a match in either collection
		// 	kbArray = Kitbags.find({	kitbagTitle:{	$regex: new RegExp(filterVar, "i")	}	}).fetch();
		// 	orgArray =	Orgs.find({		orgTitle:{		$regex: new RegExp(filterVar, "i")	}	}).fetch()
		// 	mergedArray = kbArray.concat(orgArray);

		// 	console.log("mergedArray: ",mergedArray);
		// 	return mergedArray;
		// }



	});

	


	Template.body.helpers({
	//		orgs: function () {
	//			if (Session.get('hideFinished')) {
	//				return Orgs.find({checked: {$ne: true}});
	//			} else {
	//				return Orgs.find();
	//			}
	//		},
		hideFinished: function () {
			/* https://www.youtube.com/watch?v=7xl-U71_CpA&list=PLLnpHn493BHECNl9I8gwos-hEfFrer7TV&index=9 */
			/* As he says in the video at around 9 minutes, adding the helper for hideFinished doesn't actually add any visible functionality beyond what you already see. In-fact, you can remove the handlebar for hideFinished from the checkbox and it will still work. He is simply adding the helper so the checked state of the checkbox is actually kept in sync. The filtering actually happens with the Session, so adding the helper doesn't accomplish anything extra functionality wise for this video, it's just a good practice.﻿ */
			return Session.get('hideFinished');
		},
		userId: function () {
			return Meteor.userId();
		}

	}); //ends Template.body.helpers

	Template.body.events({
		'change .hide-finished': function(event) {
			Session.set('hideFinished', event.target.checked);
		} //ends 'submit .hide-finished';
	}); //ends Template.body.events

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
		// One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
	});

// } //ends Meteor.isClient

//if (Meteor.isServer) {
	/* Meteor isServer code relocated to '/server/main.js' file */
//}