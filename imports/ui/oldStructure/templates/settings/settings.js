if (Meteor.isClient) {

	Template.settings.helpers({
		thisUser: function (attr) {
			if (!Meteor.user()){
				var retString = 'guestUser ('+attr+')';
				return retString;
			}
			try {
				switch(attr) {
					case 'userId':
						return Meteor.userId();
						break;
					case 'profileName':
						// console.log(Meteor.user());
						return Meteor.user().profile.name;
						break;
					case 'userName':
						return Meteor.user().username;
						break;
					case 'firstName':
						return Meteor.user().profile.first_name;
						break;
					default:
						return 'noRequestedParam';
				}
			} catch(e) {
				return 'Error ('+e+')';
			}
		}
	});

};

if (Meteor.isServer) {
	// None currently defined
};