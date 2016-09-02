listSorter = function (thisObj,sortElem,sortField,sortOrder) {
  console.log(thisObj,sortElem,sortField,sortOrder);
  // listSorter("ul.listOfObjects","li","name","ztoa");
  // $("ul.listOfObjects li").sort(sortList).appendTo('ul.listOfObjects');

    // Internal function to do the compare
    var sorter = function (a, b){
        if (sortOrder == "asc"){
          return ($(b).data(sortField)) < ($(a).data(sortField)) ? 1 : -1;
        } else {
          return ($(b).data(sortField)) > ($(a).data(sortField)) ? 1 : -1;
        }
    }

    // Internal date function to do the compare
    var dateSorter = function (a, b){
        if (sortOrder == "asc"){
          return ($(new Date(b)).data(sortField)) < ($(new Date(a)).data(sortField)) ? 1 : -1;
        } else {
          return ($(new Date(b)).data(sortField)) > ($(new Date(a)).data(sortField)) ? 1 : -1;
        }
    }

    // All the magic happens here with no return as the DOM update is already done!

    if (sortField == "updated" || sortField == "created"){
      console.log("Using dateSorter");
      $(sortElem,thisObj).sort(dateSorter).appendTo(thisObj);
    } else {
      console.log("Using (non date) sorter");
      $(sortElem,thisObj).sort(sorter).appendTo(thisObj);
    }

};