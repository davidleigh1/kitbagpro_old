console.log("Route: RUNNING clients.routes.js");


// # set up all routes in the app

// Start with requirements
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
// import meteor add zimme:active-route (https://github.com/zimme/meteor-active-route)
/*  TODO: is this the package we use??
import { AccountsTemplates } from 'meteor/useraccounts:core';
*/


// Import to load these templates
// import '../../ui/';
import '../../ui/layouts/mainLayout.js';
FlowRouter.route("/", {
	name:"root",
	action: function(params, queryParams) {
		console.log("Route: Root", params, queryParams);
		BlazeLayout.render("mainLayout", {
			mainNav: "navigation",
			mainFooter: "footer"
		});
	}
});


// Import Loading component
import '../../ui/components/loading/loading.js';
FlowRouter.route("/loading",				{name:"loading",		action: function(params, queryParams) { console.log("Route: Loading... (Test 'Loading' template)",				params, queryParams);BlazeLayout.render("mainLayout", 	{mainContent: "app_loading",	mainNav: "navigation",		mainFooter: "footer"});}});



// Import Pages
import '../../ui/pages/sbAdmin/sbAdmin.js';
FlowRouter.route("/sbAdmin",				{name:"sbAdmin",		action: function(params, queryParams) { console.log("Route: Admin (sbAdmin)",									params, queryParams);BlazeLayout.render("mainLayout", 	{mainContent: "sbAdmin",		mainNav: "navigation",		mainFooter: "footer"});}});

import '../../ui/pages/users/userList.js';
FlowRouter.route("/users/list",				{name:"userList",		action: function(params, queryParams) { console.log("Route: Users > User List (User List)",					params, queryParams);BlazeLayout.render("mainLayout", 	{mainContent: "userList",		mainNav: "navigation",		mainFooter: "footer"});}});


import '../../ui/pages/settings/settings.js';
FlowRouter.route("/settings",				{name:"mySettings",		action: function(params, queryParams) { console.log("Route: Profile > Settings (My Settings)",					params, queryParams);BlazeLayout.render("mainLayout", 	{mainContent: "settings",		mainNav: "navigation",		mainFooter: "footer"});}});



/* ORGS */


	/* GROUP - ORGS */
	var orgsRoutes = FlowRouter.group({
		prefix: '/orgs',
		name: 'orgs',
		triggersEnter: [function(context, redirect) {
			console.log('Route: Running /orgs GROUP triggers');
		}]
	});


			import '../../ui/pages/orgs/orgAddEdit.js';
			/* ORGS ADD */
			orgsRoutes.route("/create", {
				name:"orgAdd",
				action: function(params, queryParams) {
					console.log("Route: Orgs > Create Org (Create New Org)", params, queryParams);
					BlazeLayout.render("mainLayout", {
						mainContent: "orgAddEdit",
						mainNav: "navigation",
						mainFooter: "footer"});
				}
			});

			import '../../ui/pages/orgs/orgList.js';
			/* ORGS LIST */
			orgsRoutes.route("/list", {
				name:"orgList",
				action: function(params, queryParams) {
					console.log("Route: Organizations > Org List (Org List)", params, queryParams);
					BlazeLayout.render("mainLayout", {
						mainContent: "orgList",
						mainNav: "navigation",
						mainFooter: "footer"});
				}
			});




			/* ORGS HOME */
			orgsRoutes.route('/:_command', {
				name:"orgMissingCommand",
				action: function(params) {
					// console.log("REDIRECT",params)

					// if ( params._command == "/create" ){
					// 	var newUrl = "/orgs/" + params._command + "/view";
					// 	FlowRouter.go(newUrl);
					// }

					/* Check to see if valid Org ID before redirecting to VIEW page */
					/* NOTE - This doesn't check if ID is FOUND in DB, it only checks if ID has valid pattern */
					if ( GlobalHelpers.isValidId( params._command ,"org") || FlowRouter.getQueryParam("force") == "true" ) {
						var newUrl = "/orgs/" + params._command + "/view";
						FlowRouter.go(newUrl);
					} else {
						/* Go to 404 */
						// FlowRouter.go('/404?reqUrl='+FlowRouter.current().path+"&referrer="+document.referrer);
						FlowRouter.go('/404');
					}
				},
				triggersEnter: [function(context, redirect) {
					// console.log('Route: Running /orgs **orgMissingCommand** trigger -- REDIRECTING!');
				}]
			});



	/* GROUP - ORGS + ORGID */
	var orgsWithId = orgsRoutes.group({
		// prefix: '/:_orgId([0-9]*)?',
		//prefix: '/:_orgId(^(?=\\d{16}$)(1221)\\d+)',
		prefix: '/:_orgId',
		name: 'NEW2_orgsWithId',
		triggersEnter: [function(context, redirect) {
			console.log('Route: Running /orgs/:_id GROUP triggers <<--------------------');
		}]
	});


		/* ORGS VIEW */
		orgsWithId.route("/:command", {
			name:"orgView",
			action: function(params, queryParams) {
				console.log("Route: Orgs > View (Org Profile View)", params, queryParams);
				BlazeLayout.render("mainLayout", {
					mainContent: "orgAddEdit",
					mainNav: "navigation",
					mainFooter: "footer"});
			}
		});

		/* ORGS EDIT */
		orgsWithId.route("/edit", {
			name:"orgEdit",
			action: function(params, queryParams) {
				console.log("Route: Organizations > Edit (Org Profile Edit)", params, queryParams);
				BlazeLayout.render("mainLayout", {
					mainContent: "orgAddEdit",
					mainNav: "navigation",
					mainFooter: "footer"});
			}
		});




/* PHASE ONE */
FlowRouter.route("/bags/create/:_orgId",	{name:"kitbagAdd ",		action: function(params, queryParams) { console.log("Route: Kitbags > Create New Kitbag (Create New Kitbag )",	params, queryParams);BlazeLayout.render("mainLayout", 	{mainContent: "kitbagAddEdit",	mainNav: "navigation",		mainFooter: "footer"});}});
FlowRouter.route("/bags/list",				{name:"kitbagList",		action: function(params, queryParams) { console.log("Route: Kitbags > Kitbag List (Kitbag List)", 				params, queryParams);BlazeLayout.render("mainLayout", 	{mainContent: "kitbagList",		mainNav: "navigation",		mainFooter: "footer"});}});


// the routeNotFound template is used for unknown routes and missing lists

import '../../ui/pages/notFound/routeNotFound.js';

FlowRouter.route("/404", {
	name:"404",
	action: function(params, queryParams) {
		console.log("Route: Page not known / not found!", params, queryParams);
		BlazeLayout.render("mainLayout", {
			mainContent: "routeNotFound",
			mainNav: "navigation",
			mainFooter: "footer"});
	}
});



FlowRouter.notFound = {
	name: "notFound",
	action(params, queryParams) {
		// BlazeLayout.render('mainLayout', {
		// 	mainContent: 'routeNotFound',
		// 	mainNav: "navigation",
		// 	mainFooter: "footer"
		// });
		console.log("REDIRECTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
		// FlowRouter.redirect('/404?reqUrl='+FlowRouter.current().path+"&referrer="+document.referrer);
		// FlowRouter.setQueryParams();
		FlowRouter.go('/404',{},{ 
			requestedUrl: FlowRouter.current().path,
			referrerUrl: document.referrer
		});

	}
};




/*
// Import to override accounts templates
import '../../ui/accounts/accounts-templates.js';

*/
// Below here are the route definitions



/*Router.configure({
	// Defining here application-wide layouts.
	// Here we can define a header and a footer that will appear on every page of the application
	// without manually including any templates
	// http://meteortips.com/second-meteor-tutorial/iron-router-part-1/
	layoutTemplate: 'mainLayout'
});*/

/* Register the homepage template that will appear within the {{>yield}} of our layout template
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
//	} }); */


// FlowRouter.route('/', {
// 	name: 'home',
// 	action: function(params, queryParams) {
// 		console.log("Route: This is the home page!", params, queryParams);
// 		BlazeLayout.render("mainLayout", {
// 			mainContent: "startScreen",
// 			mainNav: "navigation",
// 			mainFooter: "footer"
// 		});
// 	}
// });


/* PHASE TWO */

FlowRouter.route("/", {name:"home",action: function(params, queryParams) { console.log("Route: Home > Start (Splash Screen)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/bags/:_bagId", {name:"Kitbag Profile View",action: function(params, queryParams) { console.log("Route: Kitbags > N/A (Kitbag Profile View)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/bags/:_bagId/edit", {name:"Kitbag Profile Edit",action: function(params, queryParams) { console.log("Route: Kitbags > N/A (Kitbag Profile Edit)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/cart/in", {name:"Checkin",action: function(params, queryParams) { console.log("Route: My Gear > Checkin (Checkin)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/cart/out", {name:"Checkout",action: function(params, queryParams) { console.log("Route: My Gear > Checkout (Checkout)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/inbox", {name:"Notifications / Inbox",action: function(params, queryParams) { console.log("Route: Notifications > Inbox (Notifications / Inbox)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/items/<itemId>", {name:"Item View",action: function(params, queryParams) { console.log("Route: Equipment > N/A (Item View)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/items/<itemId>/edit", {name:"Item Edit",action: function(params, queryParams) { console.log("Route: Equipment > N/A (Item Edit)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/items/create/:_orgId", {name:"Create New Item",action: function(params, queryParams) { console.log("Route: Equipment > N/A (Create New Item)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/items/list", {name:"Item List",action: function(params, queryParams) { console.log("Route: Equipment > List of Items (Item List)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/quick/in", {name:"Quick Checkin",action: function(params, queryParams) { console.log("Route: My Gear > Quick Checkin (Quick Checkin)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/quick/out", {name:"Quick Checkout",action: function(params, queryParams) { console.log("Route: My Gear > Quick Checkout (Quick Checkout)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/review", {name:"Bag Check",action: function(params, queryParams) { console.log("Route: Actions > Check Kitbag (Bag Check)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/review/history", {name:"Bag Check History",action: function(params, queryParams) { console.log("Route: Kitbag > Bag History (Bag Check History)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/share", {name:"Share Bag Status",action: function(params, queryParams) { console.log("Route: Actions > Share Bag Status (Share Bag Status)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/status/(me)", {name:"My Status",action: function(params, queryParams) { console.log("Route: Home > User Status (My Status)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/status/orgs/(myprimary)", {name:"Org Status",action: function(params, queryParams) { console.log("Route: Home > Org Status (Org Status)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/status/system", {name:"System Status",action: function(params, queryParams) { console.log("Route: Home > System Status (System Status)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/users/:_userId", {name:"User Profile View",action: function(params, queryParams) { console.log("Route: Users > N/A (User Profile View)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/users/:_userId/edit", {name:"User Profile Edit",action: function(params, queryParams) { console.log("Route: Users > N/A (User Profile Edit)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/users/create/:_orgId", {name:"Create New Org User",action: function(params, queryParams) { console.log("Route: Users > Create User (Create New Org User)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/users/create/new", {name:"Request New User Login",action: function(params, queryParams) { console.log("Route: Users > Create Non-Org User (Request New User Login)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route("/users/list/edit", {name:"User Bulk Edit",action: function(params, queryParams) { console.log("Route: Users > N/A (User Bulk Edit)", params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "startScreen", mainNav: "navigation",mainFooter: "footer"});}});

/* THEME CONTENT */

FlowRouter.route('/charts', 			{name:"charts",				action: function(params, queryParams) { console.log("Route: charts", 			params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "charts", 			mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route('/tables', 			{name:"tables",				action: function(params, queryParams) { console.log("Route: tables", 			params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "tables", 			mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route('/forms', 				{name:"forms",				action: function(params, queryParams) { console.log("Route: forms", 			params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "forms", 			mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route('/bootstrapElements', 	{name:"bootstrapElements",	action: function(params, queryParams) { console.log("Route: bootstrapElements",params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "bootstrapElements",mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route('/bootstrapGrid', 		{name:"bootstrapGrid",		action: function(params, queryParams) { console.log("Route: bootstrapGrid", 	params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "bootstrapGrid", 	mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route('/blankPage', 			{name:"blankPage",			action: function(params, queryParams) { console.log("Route: blankPage", 		params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "blankPage", 		mainNav: "navigation",mainFooter: "footer"});}});
FlowRouter.route('/indexRTL', 			{name:"indexRTL",			action: function(params, queryParams) { console.log("Route: indexRTL", 		params, queryParams);BlazeLayout.render("mainLayout", {mainContent: "indexRTL", 		mainNav: "navigation",mainFooter: "footer"});}});


/*

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
Router.route('/orgs/:orgId', function () {
	this.render('orgAddEdit', {
		name: 'editOrg',
		data: function () {
			addOrEdit = "edit";
			thisOrg = MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});
		}
	});
});





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


Router.route('/kitbag/:someParameter', {
	data: function(){
		console.log("Route: This is an kitbag page.",this.params.someParameter);
	}
});
// Router.route('/orgView/:orgId', {
// 	data: function(){
// 		console.log("Route: This is an organisation page.",this.params.someParameter);
// 	}
// });
Router.route('/orgView/:orgId', function () {
	console.log("Route: This is an organisation page.",this.params);
	this.render('orgView', {
		data: function () {
			//return Posts.findOne({orgId: this.params.orgId});
			return MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});
		}
	});
});

*/