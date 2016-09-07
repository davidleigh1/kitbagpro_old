if (Meteor.isClient) {

// objects = orgList = orgList

	// on create, initialize our filter as a ReactiveVar
	// need to meteor add reactive-var to use this
	Template.orgList.created = function(){
		console.log("Template.orgList.created");
		this.filter = new ReactiveVar();
		console.log("this.filter: "+this.filter);
	};


	// Template.orgList.helpers

	Template.orgList.helpers({
//		orgs: function () {
//			if (Session.get('hideFinished')) {
//				return MyCollections["Orgs"].find({checked: {$ne: true}});
//			} else {
//				return MyCollections["Orgs"].find();
//			}
//		},
		// value of the filter to initialize the HTML input
		filter:function(){
			return Template.instance().filter.get();
		},
		// reactively return the objects who are older than the input value
		objectsFiltered:function(CollectionName){
			filterVar = Template.instance().filter.get();
			console.log("filter:",CollectionName,filterVar,typeof filterVar);
			// TODO: Make a better validation than this!
			// See: http://stackoverflow.com/questions/30314447 in place of .isNaN!
			if (typeof filterVar == "undefined"){
			// Return all!
				filterVar = ".*";
			// return Persons.find({sort: {"name": "asc"}});
			}
			var docFound = MyCollections[CollectionName].find({
				orgTitle:{
					$regex: new RegExp(filterVar, "i")
				}
			});
			// },{sort: {"name": "asc"}});
			// console.log("docFound!",docFound);
			return docFound;
		}
	});

	// Template.orgList.events
	  // bind the value of the input to the underlying filter
	  Template.orgList.events({
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
	    }
	  });



};

if (Meteor.isServer) {
	// None currently defined
};

Meteor.methods({
	// None currently defined
});