// # methods related to this collection
console.log("RUNNING orgs > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

// import { Orgs } from './orgs.js';
import { Orgs } from '/imports/api/orgs/orgs.js';


// Meteor.publish("orgs",function() {
// 	console.log('Publishing orgs!');
// //    return MyCollections["Orgs"].find({
// 		return MyCollections["Orgs"].find({
// 			$or: [
// 				// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
// 				{ private: {$ne: true} },
// 				// Or the owner of the entry is the current user -- regardless of the private setting
// 				{ owner: this.userId }
// 			]
// 		});
// });


Meteor.methods({

	/* -- ORGANISATION METHODS -- */
	addOrg: function(orgObj){
		console.log('fn Meteor.methods.addOrg()',orgObj);
		if(typeof orgObj != "object" || orgObj == false){
			console.log('ERROR: No orgObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 909]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}
    // var dbNewORG = MyCollections["Orgs"].insert(orgObj);
		var dbNewORG = Orgs.insert(orgObj);
		console.log('added Org: ',orgObj);
		return dbNewORG;
	},
	updateOrg: function(updatedObj,checked){
		console.log("fn updateOrg()");
		// var res = MyCollections["Orgs"].findOne(id);
    // var dbOrg = MyCollections["Orgs"].findOne({orgId:updatedObj.orgId});
		var dbOrg = Orgs.findOne({orgId:updatedObj.orgId});
		var editId = dbOrg._id;
		console.log("OrgId to be updated: ",editId);
		console.log("updatedObj: ",updatedObj);

		if (updatedObj._id) {
			// http://stackoverflow.com/questions/24103966/
			console.log("deleting: ",updatedObj._id);
			delete updatedObj._id;
		}

    // MyCollections["Orgs"].update(editId, { $set: updatedObj});
		Orgs.update(editId, { $set: updatedObj});

		// TODO: Add "LastUpdatedAt" and "LastUpdatedBy" fields - will be used for debugging and sorting

		//		TODO: Restore protection to avoid non-associated users from updating objects
		//		if (res.owner !== Meteor.userId()){
		//			//throw new Meteor.Error('You are not authorized to update items owned by other users (error code: 34.7)');
		//			console.log('ERROR: You are not authorized to update items owned by other users [error code: 347]');
		//			return false;
		//		}else{
    // //      MyCollections["Orgs"].update(id, { $set: {checked: checked}});
		//			MyCollections["Orgs"].update(id, { $set: {checked: checked}});
		//		}
	},
	deleteOrg: function(id){
    // var res = MyCollections["Orgs"].findOne(id);
		var res = Orgs.findOne(id);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to delete items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to delete items owned by other users [error code: 34.6]');
			return false;
		}else{
      // MyCollections["Orgs"].remove(id);
			Orgs.remove(id);
		}
	},
	setPrivateOrg: function(id,private){
    // var res = MyCollections["Orgs"].findOne(id);
		var res = Orgs.findOne(id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
      // Kitbags.update(id, { $set: {private: private}});
			Kitbags.update(id, { $set: {private: private}});
		}
	}



});



/*

const LIST_ID_ONLY = new SimpleSchema({
  listId: { type: String },
}).validator();

export const insert = new ValidatedMethod({
  name: 'lists.insert',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Lists.insert({});
  },
});

export const makePrivate = new ValidatedMethod({
  name: 'lists.makePrivate',
  validate: LIST_ID_ONLY,
  run({ listId }) {
    if (!this.userId) {
      throw new Meteor.Error('lists.makePrivate.notLoggedIn',
        'Must be logged in to make private lists.');
    }

    const list = Lists.findOne(listId);

    if (list.isLastPublicList()) {
      throw new Meteor.Error('lists.makePrivate.lastPublicList',
        'Cannot make the last public list private.');
    }

    Lists.update(listId, {
      $set: { userId: this.userId },
    });
  },
});

export const makePublic = new ValidatedMethod({
  name: 'lists.makePublic',
  validate: LIST_ID_ONLY,
  run({ listId }) {
    if (!this.userId) {
      throw new Meteor.Error('lists.makePublic.notLoggedIn',
        'Must be logged in.');
    }

    const list = Lists.findOne(listId);

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('lists.makePublic.accessDenied',
        'You don\'t have permission to edit this list.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    Lists.update(listId, {
      $unset: { userId: true },
    });
  },
});

export const updateName = new ValidatedMethod({
  name: 'lists.updateName',
  validate: new SimpleSchema({
    listId: { type: String },
    newName: { type: String },
  }).validator(),
  run({ listId, newName }) {
    const list = Lists.findOne(listId);

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('lists.updateName.accessDenied',
        'You don\'t have permission to edit this list.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Lists.update(listId, {
      $set: { name: newName },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'lists.remove',
  validate: LIST_ID_ONLY,
  run({ listId }) {
    const list = Lists.findOne(listId);

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('lists.remove.accessDenied',
        'You don\'t have permission to remove this list.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    if (list.isLastPublicList()) {
      throw new Meteor.Error('lists.remove.lastPublicList',
        'Cannot delete the last public list.');
    }

    Lists.remove(listId);
  },
});

// Get list of all method names on Lists
const LISTS_METHODS = _.pluck([
  insert,
  makePublic,
  makePrivate,
  updateName,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(LISTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
*/