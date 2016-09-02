

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


/* This is included in all new Meteor Projects... 1.3? */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/*import './main.html';*/

Router.configure({
	// Defining here application-wide layouts.
	// Here we can define a header and a footer that will appear on every page of the application
	// without manually including any templates
	// http://meteortips.com/second-meteor-tutorial/iron-router-part-1/
	layoutTemplate: 'mainLayout'
});

 // Register the homepage template that will appear within the {{>yield}} of our layout template
 // Note '/' = Homepage
Router.route('/', {
	name: 'home',
	template: 'startScreen',
//	loadingTemplate: 'loading', // Optional loading template.
//	subscriptions: function() {
// 		// We can return a single subscription, or an array of subscriptions here.
//		return [
//			/* Meteor.subscribe( 'inbox', chatUserStatus ), */
// 			Meteor.subscribe("orgs"),
// 			Meteor.subscribe("kitbags"),
// 			Meteor.subscribe("userList")
//		];
//	}
});

// Kitbag Routes
Router.route('/kitbagList');
Router.route('/kitbagAddEdit');
Router.route('/orgList');

Router.route('/newOrg', function () {
	this.render('orgAddEdit', {
		name: 'newOrg',
		data: function () {
			addOrEdit = "add";
			thisOrg = {};
		}
	});
});
Router.route('/org/:orgId', function () {
	this.render('orgAddEdit', {
		name: 'editOrg',
		data: function () {
			addOrEdit = "edit";
			thisOrg = MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});
		}
	});
});


// SEE HERE! https://github.com/iron-meteor/iron-router/issues/174
// this.route('Event', {
//             template: 'eventHomePage',
//             path: '/:ehash',
//             action: function () {
//                 var onWait = function() {
//                     this.render('loading');
//                     this.render('Header', {to: 'header'});
//                 };
//                 var onReady = function() {
//                     this.render();
//                     this.render('Header', {to: 'header'});
//                     this.render('eventBox', {to: 'eventbox'});
//                     this.render('Footer', {to: 'footer'});
//                 };
//                 var subs = [ Meteor.subscribe('events') ];
//                 this.wait(subs, onReady, onWait);
//             },
//             data: function() { return [ singleevent = Events.find({ehash: this.params.ehash}).fetch()[0], foo = 123 ]; },
//             before: function() { Session.set('ehash', this.params.ehash) }
//         });



Router.route('/users', {
	name: 'users',
	template: 'userList'
});
Router.route('/settings');
// SB-Admin Routes
Router.route('/admin', {
	name: 'sbAdmin',
	template: 'sbAdmin'
});
Router.route('/charts');
Router.route('/tables');
Router.route('/forms');
Router.route('/bootstrapElements');
Router.route('/bootstrapGrid');
Router.route('/blankPage');
Router.route('/indexRTL');

Router.route('/kitbag/:someParameter', {
	data: function(){
		console.log("This is an kitbag page.",this.params.someParameter);
	}
});
// Router.route('/orgView/:orgId', {
// 	data: function(){
// 		console.log("This is an organisation page.",this.params.someParameter);
// 	}
// });
Router.route('/orgView/:orgId', function () {
	console.log("This is an organisation page.",this.params);
	this.render('orgView', {
		data: function () {
			//return Posts.findOne({orgId: this.params.orgId});
			return MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});
		}
	});
});






if (Meteor.isClient) {

	// console.log("Subscribing to collections");
	Meteor.subscribe("orgs");
	Meteor.subscribe("kitbags");
	Meteor.subscribe("userList");


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
		idGenerator: function(){
			// console.log('Global idGenerator '+new Date());
			var S4 = function() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
			return (S4()+S4()+S4());
		},
		// Takes an Organisation ID and responds with the value of the requested field for that organisation e.g. {{lookupOrg kitbagAssocOrg 'orgTitle'}}
		lookupFieldFromOrg: function(orgId,requiredField){
			// console.log(orgId,requiredField);
			// var fieldObj = {};
			// fieldObj[requiredField] = 1;
			var localOrg = MyCollections["Orgs"].findOne({orgId: ""+orgId});
			// console.log("returned org: ",localOrg);
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
			var localKb = MyCollections["Kitbags"].findOne({kitbagId: ""+kitbagId});
			// console.log("returned kitbag: ",localKb);
			if (typeof localKb == "object"){
				return localKb[requiredField];
			} else {
				return "Unknown Kitbag ("+kitbagId+")";
			}
		}
	};

	Template.registerHelper('formatDate', function(timestamp) {
		// console.log(timestamp);
		if (!timestamp){
			return;
		}
		var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
		return timestamp.toLocaleDateString('en-GB') + " " + timestamp.toLocaleTimeString();
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

} //ends Meteor.isClient

//if (Meteor.isServer) {
	/* Meteor isServer code relocated to '/server/main.js' file */
//}

Meteor.methods({
	// Moved to /components/kitbags/kitbag.js
});