MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};
MyCollections.Orgs = new Mongo.Collection("orgs");

MyCollections.listOrgStatuses = ["Active","Unlisted","Deleted"];

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

let OrgSchema = new SimpleSchema({
	"orgId": {
		type: String,
		optional: false,
		max: 20,
		label: "Organisation ID"
	},
	"orgStatus": {
		type: String,
		allowedValues: MyCollections.listOrgStatuses,
		optional: true,
		defaultValue: "Active",
		autoValue: function () {
			if (this.isSet == true){
				return this.value;
			} else {
				return "Active";
			}
			// return (this.isSet == true) ? this.value : "Unlisted";
		},
		label: "Organisation Status"
	},
	"orgTitle": {
		type: String,
		optional: false,
		label: "Organisation Name"
	},
	"orgDesc": {
		type: String,
		optional: true,
		max: 400,
		label: "Organisation Description"
	},
	"orgUrl": {
		type: String,
		optional: true,
		label: "Organisation Website"
	},
	"orgContactPerson": {
		type: String,
		optional: true,
		label: "Contact Person"
	},
	"orgContactPhone": {
		type: String,
		optional: true,
		label: "Contact Phone Number"
	},
	"orgContactEmail": {
		type: String,
		optional: true,
		label: "Contact Email Address"
	},
	"orgImgLarge": {
		type: String,
		optional: true,
		label: "Profile Photo"
	},
	"orgImgSmall": {
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

// console.log(OrgSchema);
MyCollections.Orgs.attachSchema( OrgSchema );