import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import './userList.html';
import './userList.css';
import './userLine.js';

if (Meteor.isClient) {

	// Template.myTemplateName.helpers

	Template.userList.helpers({
		users: function () {
			// return Users.find();
			return Meteor.users.find();
		}
	});

	// Template.myTemplateName.events


};

if (Meteor.isServer) {
	// http://stackoverflow.com/questions/30961418/displaying-all-users-in-meteor
	Meteor.publish("userList", function () {
		return Meteor.users.find({}, {
			fields: {
				username: 1,
				emails: 1,
				profile: 1,
				createdAt: 1,
				services: 1,
				'type': 1
			}
		});
    })
};

Meteor.methods({
	// None currently defined
});