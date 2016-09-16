import { ReactiveVar } from 'meteor/reactive-var';

import './kitbagList.html';
import './kitbagLine.js';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';

import '/imports/ui/components/lists/listFilter.js';

// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this
Template.kitbagList.created = function(){
	console.log("Template.kitbagList.created");
	this.filter = new ReactiveVar();
	console.log("this.filter: "+this.filter);
};

// Template.kitbagList.helpers

Template.kitbagList.helpers({
	// value of the filter to initialize the HTML input
	filter:function(){
		return Template.instance().filter.get();
	}
});

// Template.kitbagList.events

	// bind the value of the input to the underlying filter
	Template.kitbagList.events({
		"input .filterInput": function(event,template){
			var currentValue = template.find(".filterInput").value;
			template.filter.set(currentValue);
		},
		"change .listSorter": function(event,template){
			// // Adding a check to only reorder if the new sort order != existing sort order
			// var newValue = $(event.target).val();
			// var oldValue = Session.get("sortOrder");
			// if (newValue != oldValue) {

				var thisObj = "ul.listOfObjects";
				var sortElem = "li";
				var sortField = $(event.target).val().split("_")[0];
				var sortOrder = $(event.target).val().split("_")[1];
				listSorter(thisObj,sortElem,sortField,sortOrder);

				// $("ul.listOfObjects li").sort(sortList).appendTo('ul.listOfObjects');
			// }
			// Session.set("sortOrder", newValue);
		},
		filter:function(){
			return Template.instance().filter.get();
		}
	});