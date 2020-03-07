(function () {
'use strict';
console.log("Init IIFE");

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownCtrl',NarrowItDownController)
.directive('foundItems', FoundItemsDirective)
.service('MenuSearchSvc', MenuSearchService);
console.log("Init controllers and service");

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchSvc'];
function NarrowItDownController(MenuSearchSvc) {
     console.log("Init NarrowItDownController");
     var list = this;
     list.ctrSearchTerm = "";
     list.matches = [];

     list.removeItem = function(item){
         list.matches.splice(item,1);
     }

     list.foundItem = function(searchTerm){
          list.ctrSearchTerm = searchTerm;
          console.log("Search Item: ",list.ctrSearchTerm);
          MenuSearchSvc.getMatchedMenuItems().then(function (result) {

             list.found = result.data.menu_items;
             list.matches = [];

             console.log("list.found",list.found);
             console.log("Search Item: ",list.ctrSearchTerm);
             for(var i=0;i<list.found.length;i++){
                  if( list.found[i].description.indexOf(list.ctrSearchTerm) > -1){
                        list.matches.push({
                        "id": list.found[i].id,
                        "short": list.found[i].name,
                        "name": list.found[i].description
                      });
                      //console.log("Match: ",list.found[i].description);
                  }
             }
             console.log("Found arrays",list.matches);
          });
     };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
    console.log("Init MenuSearchService");
    var service = this;
    service.url = "https://davids-restaurant.herokuapp.com/menu_items.json";
    service.foundItems = [];

    service.getMatchedMenuItems = function(){
         return $http(
            {
                method: "GET",
                url: service.url
            }
          )
    }

    service.getFoundItems = function(){
        return service.foundItems;
    }
 }

})();
