import './mainLayout.html';

import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
import { Orgs } from '/imports/api/orgs/orgs.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';

// import { insert } from '../../api/orgs/methods.js';

import '/imports/ui/components/loading/loading.js';

import '/imports/ui/pages/startScreen/startScreen.html';
import '/imports/ui/components/footer.html';
import '/imports/ui/components/headerMenuItems.html';
import '/imports/ui/components/navbarHeader.html';
import '/imports/ui/components/navigation.html';
import '/imports/ui/components/sidebarMenuItems.html';
// import '../../ui/components/mainLayout/headerMenuItems.html';
import '/imports/ui/components/menus/menu.html';
import '/imports/ui/components/menus/userMenu.html';


const CONNECTION_ISSUE_TIMEOUT = 5000;

// A store which is local to this file?
const showConnectionIssue = new ReactiveVar(false);

// Meteor.startup(() => {
// 	// Only show the connection error box if it has been 5 seconds since
// 	// the app started
// 	setTimeout(() => {
// 		// FIXME:
// 		// Launch screen handle created in lib/router.js
// 		// dataReadyHold.release();

// 		// Show the connection error box
// 		showConnectionIssue.set(true);
// 	}, CONNECTION_ISSUE_TIMEOUT);

// });






Template.mainLayout.onCreated(function(){
  	var that = this;
  		that.subscribe('kitbags');
  		that.subscribe('orgs');
  		// that.subscribe('companies');
  		// that.subscribe('workjournals');
  	that.autorun(function(){
    		if (/*libProfilesHandle.ready() &&*/ that.subscriptionsReady()) {
      //init data structures
      console.log(" =========== READY NOW ================== ");
    }
  });
});

// Template.mainLayout.onCreated(function mainLayoutOnCreated() {

	// console.log("----->> Added Subscriptions");

	// const handle = Meteor.subscribe("orgs", {
	// 	onReady: function () { console.log("====>>>> onReady And the Items actually Arrive", arguments); },
	// 	onError: function () { console.log("====>>>> onError", arguments); }
	// });

	// const handle = Meteor.subscribe('orgs');
	// Tracker.autorun(() => {
	//   const isReady = handle.ready();
	//   var status =  isReady ? 'ready' : 'not ready';
	//   console.log("\nHandle for orgs is " + status + "\n\n");
	// })



	// this.autorun(() => {
	// 	this.subscribe('orgs');
	// });




	//Meteor.subscribe("kitbags");
	// Meteor.subscribe("userList");

	// this.subscribe('orgs.public');
	// this.subscribe('orgs.private');

	// console.log( "MYCOLLECTIONS - AUTORUN: ", Orgs.findOne({orgId: "122123eb85456a66"}) );

	// this.state = new ReactiveDict();
	// this.state.setDefault({
	// 	menuOpen: false,
	// 	userMenuOpen: false,
	// });
// });


/*
Template.App_body.helpers({
	menuOpen() {
		const instance = Template.instance();
		return instance.state.get('menuOpen') && 'menu-open';
	},
	cordova() {
		return Meteor.isCordova && 'cordova';
	},
	emailLocalPart() {
		const email = Meteor.user().emails[0].address;
		return email.substring(0, email.indexOf('@'));
	},
	userMenuOpen() {
		const instance = Template.instance();
		return instance.state.get('userMenuOpen');
	},
	lists() {
		return Lists.find({ $or: [
			{ userId: { $exists: false } },
			{ userId: Meteor.userId() },
		] });
	},
	activeListClass(list) {
		const active = ActiveRoute.name('Lists.show')
			&& FlowRouter.getParam('_id') === list._id;

		return active && 'active';
	},
	connected() {
		if (showConnectionIssue.get()) {
			return Meteor.status().connected;
		}

		return true;
	},
	templateGestures: {
		'swipeleft .cordova'(event, instance) {
			instance.state.set('menuOpen', false);
		},
		'swiperight .cordova'(event, instance) {
			instance.state.set('menuOpen', true);
		},
	},
});



Template.App_body.events({
	'click .js-menu'(event, instance) {
		instance.state.set('menuOpen', !instance.state.get('menuOpen'));
	},
	'click .content-overlay'(event, instance) {
		instance.state.set('menuOpen', false);
		event.preventDefault();
	},
	'click .js-user-menu'(event, instance) {
		instance.state.set('userMenuOpen', !instance.state.get('userMenuOpen'));
		// stop the menu from closing
		event.stopImmediatePropagation();
	},
	'click #menu a'(event, instance) {
		instance.state.set('menuOpen', false);
	},
	'click .js-logout'() {
		Meteor.logout();
		// if we are on a private list, we'll need to go to a public one
		if (ActiveRoute.name('Lists.show')) {
			// TODO -- test this code path
			const list = Lists.findOne(FlowRouter.getParam('_id'));
			if (list.userId) {
				FlowRouter.go('Lists.show', Lists.findOne({ userId: { $exists: false } }));
			}
		}
	},
	'click .js-new-list'() {
		const listId = insert.call((err) => {
			if (err) {
				// At this point, we have already redirected to the new list page, but
				// for some reason the list didn't get created. This should almost never
				// happen, but it's good to handle it anyway.
				FlowRouter.go('App.home');
				alert(TAPi18n.__('Could not create list.')); // eslint-disable-line no-alert
			}
		});

		FlowRouter.go('Lists.show', { _id: listId });
	},
});

*/
