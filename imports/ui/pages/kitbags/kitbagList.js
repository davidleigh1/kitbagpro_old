import './kitbagList.html';
import './kitbagLine.js';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Orgs } from '/imports/api/orgs/orgs.js';

import '../../../ui/components/lists/listFilter.js'; // Is this also required for Kitbags??

// Template.kitbagLine.onCreated(function () {

//   // 1. Initialization

//   var instance = this;

//   // initialize the reactive variables
//   instance.loaded = new ReactiveVar(0);
//   instance.limit = new ReactiveVar(5);

//   // 2. Autorun

//   // will re-run when the "limit" reactive variables changes
//   instance.autorun(function () {

//     // get the limit
//     var limit = instance.limit.get();

//     console.log("Asking for "+limit+" kitbags...");

//     // subscribe to the posts publication
//     var subscriptionKitbags = instance.subscribe('kitbags', limit);
//     var subscriptionOrgs = instance.subscribe('orgs', limit);

//     // if subscription is ready, set limit to newLimit
//     if (subscriptionKitbags.ready()) {
//       console.log("> Received "+limit+" kitbags. \n\n")
//       instance.loaded.set(limit);
//     } else {
//       console.log("> Subscription is not ready yet. \n\n");
//     }
//   });

//   // 3. Cursor

//   instance.posts = function() { 
//     return Posts.find({}, {limit: instance.loaded.get()});
//   }

// });


// Template.kitbagList.helpers

	Template.kitbagList.helpers({
		kitbags: function () {
			if (Session.get('hideFinished')) {
				// return MyCollections["Kitbags"].find({checked: {$ne: true}});
				return Kitbags.find({checked: {$ne: true}});
			} else {
				// return MyCollections["Kitbags"].find();
				return Kitbags.find();
			}
		}
	});

// Template.kitbagList.events


