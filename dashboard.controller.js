angular.module('dashboardApp',[]);

angular.module('dashboardApp').controller('dashboardController',dashboardController);

dashboardController.$inject=['$scope','$http'];

function dashboardController($scope,$http){
    $scope.title = "Dashboard";
}
