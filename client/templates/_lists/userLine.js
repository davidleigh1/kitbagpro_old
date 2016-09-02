if (Meteor.isClient) {

// Template.userLine.helpers

	Template.userLine.helpers({
		log: function() {
			// console.log(this);
		},
		userEmail: function() {
			/* console.log(
				typeof this.emails == "array",
				"(" + typeof this.emails + ")",
				typeof this.emails[0].address == "string",
				"(" + typeof this.emails[0].address + ")"
			); */

			// Native User
			if (typeof this.emails == "object" && typeof this.emails[0].address == "string"){
				return this.emails[0].address;
			}

			// Facebook User
			if (typeof this.services == "object") {
				if ( typeof this.services.facebook == "object" && typeof this.services.facebook.email == "string") {
					return this.services.facebook.email;
				}
				if ( typeof this.services.google == "object" && typeof this.services.google.email == "string") {
					return this.services.google.email;
				}
				if ( typeof this.services.github == "object" && typeof this.services.github.email == "string") {
					return this.services.github.email;
				}
			}
		},
		userProfileName: function(){
			if (typeof this.profile == "object" && typeof this.profile.name == "string"){
				return this.profile.name;
			} else {
				return false;
			}
		},
		isCurrentUser: function() {
			if (Meteor.userId() == this._id) {
				return true;
			} else {
				return false;
			}
		},
		userGetService: function(varRequired) {
			var s = {};
			s.serviceName = "Unknown";
			s.serviceUsername = "Unknown";
			s.serviceProfileUrl = "Unknown";
			s.serviceProfileImageUrl = "Unknown";
			s.serviceLang = "Unknown";
			s.serviceEmail = "Unknown";

			if (typeof this.services !== "object") {
				return false;
			}

			s.serviceName = ('twitter' in this.services) ? 'Twitter' : ('facebook' in this.services) ? 'Facebook' : ('google' in this.services) ? 'Google' : ('github' in this.services) ? 'Github' : 'Unknown';

			switch(s.serviceName) {
				case 'Twitter':
					s.serviceUsername = this.services.twitter.screenName;
					s.serviceProfileImageUrl = this.services.twitter.profile_image_url;
					s.serviceLang = this.services.twitter.lang;
					break;
				case 'Facebook':
					s.serviceUsername = this.services.facebook.name;
					s.serviceProfileUrl = this.services.facebook.link;
					s.serviceLang = this.services.facebook.locale;
					s.serviceEmail = this.services.facebook.email;
					break;
				case 'Google':
					s.serviceUsername = this.services.google.name;
					s.serviceProfileImageUrl = this.services.google.picture;
					s.serviceLang = this.services.google.locale;
					s.serviceEmail = this.services.google.email;
					break;
				case 'Github':
					s.serviceUsername = this.services.github.username;
					s.serviceEmail = this.services.github.email;
					break;
				default:
					return;
			}

			if ( typeof s[varRequired] == "string" ) {
				return s[varRequired];
			} else {
				return s;
			}

		},
		isSuperAdmin: function() {
			if (typeof this.type != "string") {
				return "Not Set";
			} else {
				return this.type;
			}
		}
	});

// Template.userLine.events


};

if (Meteor.isServer) {
	// None currently defined
};

Meteor.methods({
	// None currently defined
});