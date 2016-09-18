// # methods related to this collection
console.log("RUNNING kitbags > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';



// Meteor.publish("kitbags",function() {
// 	console.log('Publishing kitbags!');
// 		return Kitbags.find({
// 			$or: [
// 				// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
// 				{ private: {$ne: true} },
// 				// Or the owner of the entry is the current user -- regardless of the private setting
// 				{ owner: this.userId }
// 			]
// 		});
// });


Meteor.methods({

	/* -- KITBAG METHODS -- */
	addKitbag: function(kitbagObj){
		if(typeof kitbagObj != "object" || kitbagObj == false){
			return "false";
		}

		// We return the method in order to be able to passback and reuse the _id generated when the doc is created in the database
		// http://stackoverflow.com/questions/16439055
    // var dbNewKB = MyCollections["Kitbags"].insert(kitbagObj);
		var dbNewKB = Kitbags.insert(kitbagObj);
		// console.log(dbNewKB);
		return dbNewKB;
	},
	updateKitbag: function(id,checked){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);

		if (res.owner !== Meteor.userId()){
			//throw new Meteor.Error('You are not authorized to update items owned by other users (error code: 34.7)');
			console.log('ERROR: You are not authorized to update items owned by other users [error code: 347]');
			return false;
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {checked: checked}});
			Kitbags.update(id, { $set: {checked: checked}});
		}
	},
	// Meteor.call("assignKBtoOrg", newKB.kitbagAssocOrg, newKB._id);
	assignKBtoOrg: function(orgId, bagId){
		// console.log("assignKBtoOrg adding bag: '"+bagId+"' to org: '"+orgId+"'");
		// badInCode - MyCollections["Orgs"].update(orgId, { $push: { "orgAssocKitbags": bagId }});
		// GoodInDBConsole - db.orgs.update({orgId:"org_be44df86cb2f"}, { $push: { orgAssocKitbags: "kb_ccaa81f04fc6" }});
		Orgs.update(
			{ orgId: ""+orgId },
			{ $push: { orgAssocKitbags: ""+bagId }}
		);
	},
	deleteKitbag: function(id){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to delete items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to delete items owned by other users [error code: 34.6]');
			return false;
		}else{
      // MyCollections["Kitbags"].remove(id);
			Kitbags.remove(id);
		}
	},
	setPrivateKitbag: function(id,private){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);
		console.log("setPrivateKitbag("+id,private+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {private: private}});
			Kitbags.update(id, { $set: {private: private}});
      // console.log("Kitbag privacy set: ",MyCollections["Kitbags"].findOne(id));
			console.log("Kitbag privacy set: ",Kitbags.findOne(id));
		}
	},
	setStatus: function(id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.6]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			Kitbags.update(id, { $set: {kitbagStatus: newStatus}});
      // console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
			console.log("kitbagStatus set: ",Kitbags.findOne(id));
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