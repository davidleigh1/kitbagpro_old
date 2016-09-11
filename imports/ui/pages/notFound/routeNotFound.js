
import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import './routeNotFound.html';
import './routeNotFound.css';
// import './components/pageHeader.js';
import '../../../ui/components/pageHeader.js';

Template.routeNotFound.helpers({
	titleText: function (attr) {
		var t = "<span class='blockText'>404 - Page Not Found</span>";
		// https://forums.meteor.com/t/how-to-return-html-tag-from-template-helper/2791/2
		return Spacebars.SafeString(t);
	},
	subTitleText: function (attr) {
		// alert(FlowRouter.getQueryParam("reqUrl"));
		var failedUrl = ( FlowRouter.getQueryParam("reqUrl") ) ? FlowRouter.getQueryParam("reqUrl") : FlowRouter.current().path;
		var s = "<br>We couldn't find <code><a href='"+failedUrl+"' target='_blank' id='failedUrl'>" + failedUrl + "</a></code>";
		// https://forums.meteor.com/t/how-to-return-html-tag-from-template-helper/2791/2
		return Spacebars.SafeString(s);
	}
});