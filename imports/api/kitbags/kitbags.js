// # definition of this collection

import { Mongo } from 'meteor/mongo';
// import { Factory } from 'meteor/factory';
// import faker from 'faker';

// import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Kitbags } from '../kitbags/kitbags.js';
import { Orgs } from '../orgs/orgs.js';

console.log(">>>>> 'MyCollections.Kitbags' is defined here!");

MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};

MyCollections.Kitbags = new Mongo.Collection("kitbags");
MyCollections.listKitbagStatuses = ["Active","Unlisted","Trashed"];

