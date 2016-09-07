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
import '../../ui/layouts/mainLayout.html';
import '../../ui/pages/startScreen/startScreen.html';
import '../../ui/components/mainLayout/footer.html';
import '../../ui/components/mainLayout/headerMenuItems.html';
import '../../ui/components/mainLayout/navbarHeader.html';
import '../../ui/components/mainLayout/navigation.html';
import '../../ui/components/mainLayout/sidebarMenuItems.html';
// import '../../ui/components/mainLayout/headerMenuItems.html';
import '../../ui/components/menus/menu.html';
import '../../ui/components/menus/userMenu.html';
/*
import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/lists-show-page.js';
import '../../ui/pages/app-not-found.js';

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


FlowRouter.route('/', {
	name: 'home',
	action: function(params, queryParams) {
		console.log("This is the home page!", params, queryParams);
		BlazeLayout.render("mainLayout", {
			mainContent: "startScreen",
			mainNav: "navigation",
			mainFooter: "footer"
		});
	}
});


// Router = {
// 	route : function (arg) {
// 		console.log("route: ",arg);
// 	}
// };

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
Router.route('/org/:orgId', function () {
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

*/