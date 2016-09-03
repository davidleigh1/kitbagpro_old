// Template.navbarHeader.onRendered(function(){

// 	$(document).on('click','.navbar-collapse.in',function(e) {
// 		if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
// 			$(this).collapse('hide');
// 		}
// 	});

// });

Template.sidebarMenuItems.helpers({
	activeIfTemplateIs: function (template) {
		/*var currentRoute = FlowRouter.current();*/
		var currentRoute = FlowRouter.getRouteName();
		//console.log("currentRoute: ",template,currentRoute.lookupTemplate());
		return currentRoute &&
			template.toLowerCase() === currentRoute.toLowerCase() ? 'active' : '';
	}
});

Template.sidebarMenuItems.events({
	'click .navbar-collapse.in': function(e) {
		console.log('Click!',$(this));
		/*
			TODO: Ensure this isnt because jquery or bootstrap is being loaded twice! see: http://stackoverflow.com/questions/21203111/
		*/
		if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
			// console.log('Hide!',$(this));
			$('.collapse').collapse('hide');
		}
	}
});