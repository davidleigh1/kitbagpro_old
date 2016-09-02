import { Meteor } from 'meteor/meteor';

Meteor.startup( () => {
	// code to run on server at startup

	Meteor.publish("orgs",function() {
		console.log('Publishing orgs!');
			return MyCollections["Orgs"].find({
				$or: [
					// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
					{ private: {$ne: true} },
					// Or the owner of the entry is the current user -- regardless of the private setting
					{ owner: this.userId }
				]
			});
	});

	Meteor.publish("kitbags",function() {
		console.log('Publishing kitbags!');
			return MyCollections["Kitbags"].find({
				$or: [
					// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
					{ private: {$ne: true} },
					// Or the owner of the entry is the current user -- regardless of the private setting
					{ owner: this.userId }
				]
			});
	});

});


Meteor.methods({
	/* -- KITBAG METHODS -- */
	addKitbag: function(kitbagObj){
		if(typeof kitbagObj != "object" || kitbagObj == false){
			return "false";
		}

		// We return the method in order to be able to passback and reuse the _id generated when the doc is created in the database
		// http://stackoverflow.com/questions/16439055
		var dbNewKB = MyCollections["Kitbags"].insert(kitbagObj);
		// console.log(dbNewKB);
		return dbNewKB;
	},
	updateKitbag: function(id,checked){
		var res = MyCollections["Kitbags"].findOne(id);

		if (res.owner !== Meteor.userId()){
			//throw new Meteor.Error('You are not authorized to update items owned by other users (error code: 34.7)');
			console.log('ERROR: You are not authorized to update items owned by other users [error code: 347]');
			return false;
		}else{
			MyCollections["Kitbags"].update(id, { $set: {checked: checked}});
		}
	},
	// Meteor.call("assignKBtoOrg", newKB.kitbagAssocOrg, newKB._id);
	assignKBtoOrg: function(orgId, bagId){
		// console.log("assignKBtoOrg adding bag: '"+bagId+"' to org: '"+orgId+"'");
		// badInCode - MyCollections["Orgs"].update(orgId, { $push: { "orgAssocKitbags": bagId }});
		// GoodInDBConsole - db.orgs.update({orgId:"org_be44df86cb2f"}, { $push: { orgAssocKitbags: "kb_ccaa81f04fc6" }});
		MyCollections["Orgs"].update(
			{ orgId: ""+orgId },
			{ $push: { orgAssocKitbags: ""+bagId }}
		);
	},
	deleteKitbag: function(id){
		var res = MyCollections["Kitbags"].findOne(id);
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to delete items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to delete items owned by other users [error code: 34.6]');
			return false;
		}else{
			MyCollections["Kitbags"].remove(id);
		}
	},
	setPrivateKitbag: function(id,private){
		var res = MyCollections["Kitbags"].findOne(id);
		console.log("setPrivateKitbag("+id,private+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			MyCollections["Kitbags"].update(id, { $set: {private: private}});
			console.log("Kitbag privacy set: ",MyCollections["Kitbags"].findOne(id));
		}
	},
	setStatus: function(id,newStatus){
		var res = MyCollections["Kitbags"].findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.6]');
		}else{
			MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
		}
	},
	/* -- ORGANISATION METHODS -- */
	addOrg: function(orgObj){
		console.log('fn Meteor.methods.addOrg()',orgObj);
		if(typeof orgObj != "object" || orgObj == false){
			console.log('ERROR: No orgObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 909]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}
		var dbNewORG = MyCollections["Orgs"].insert(orgObj);
		console.log('added Org: ',orgObj);
		return dbNewORG;
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
