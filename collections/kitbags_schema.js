MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};
MyCollections.Kitbags = new Mongo.Collection("kitbags");

MyCollections.listKitbagStatuses = ["Active","Unlisted","Trashed"];

/*
Orgs2.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Orgs2.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});
*/

// https://atmospherejs.com/aldeed/simple-schema

let KitbagSchema = new SimpleSchema({
	"kitbagId": {
		type: String,
		optional: false,
		max: 20,
		label: "Kitbag ID"
	},
	"kitbagStatus": {
		type: String,
		allowedValues: MyCollections.listKitbagStatuses,
		optional: true,
		defaultValue: "Active",
		autoValue: function () {
			if (this.isSet == true){
				return this.value;
			} else {
				return "Active";
			}
		},
		label: "Kitbag Status"
	},
	"kitbagTitle": {
		type: String,
		optional: false,
		label: "Kitbag Name"
	},
	"kitbagDesc": {
		type: String,
		optional: true,
		max: 400,
		label: "Kitbag Description"
	},
	"kitbagSku": {
		type: String,
		optional: true,
		label: "Kitbag SKU/CustomID"
	},
	"kitbagAssocOrg": {
		type: String,
		optional: true,
		label: "Associated Organisation"
	},
//	"kitbagContactPerson": {
//		type: String,
//		optional: true,
//		label: "Contact Person"
//	},
//	"kitbagContactPhone": {
//		type: String,
//		optional: true,
//		label: "Contact Phone Number"
//	},
//	"kitbagContactEmail": {
//		type: String,
//		optional: true,
//		label: "Contact Email Address"
//	},
	"kitbagImgLarge": {
		type: String,
		optional: true,
		label: "Profile Photo"
	},
	"kitbagImgSmall": {
		type: String,
		optional: true,
		label: "Profile Icon"
	},
	"createdAt": {
		type: Date,
		optional: false,
		label: "Created Date"
	},
	"updatedAt": {
		type: Date,
		optional: false,
		label: "Last Updated Date"
	},
	"owner": {
		type: String,
		optional: false,
		label: "Owner"
	}
});

// console.log(KitbagSchema);
MyCollections.Kitbags.attachSchema( KitbagSchema );