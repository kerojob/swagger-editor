'use strict';

PhonicsApp.controller('PreviewCtrl', [
  'Storage',
  '$scope',
  '$stateParams',
  PreviewCtrl
]);

function PreviewCtrl(Storage, $scope, $stateParams) {
  function updateSpecs(latest){
    if ($stateParams.path && latest.paths[$stateParams.path]) {
      $scope.specs = { paths: _.pick(latest.paths, $stateParams.path) };
      $scope.isSinglePath = true;
    } else {
      $scope.specs = latest;
    }
  }
  function updateError(latest){
    $scope.error = latest;
  }

  Storage.addChangeListener('specs', updateSpecs);
  Storage.addChangeListener('error', updateError);

  var storedSpecs = Storage.load('specs');
  if (storedSpecs) {
    updateSpecs(storedSpecs);
  }
  var storedError = Storage.load('error');
  if (storedError) {
    updateError(storedError);
  }

  $scope.pathListedStatus = Object.create(null);
  $scope.$watch('specs', function (){
    if ($scope.specs && $scope.specs.paths){
      Object.keys($scope.specs.paths).forEach(function (pathName){
        if (typeof $scope.pathListedStatus[pathName] === 'undefined') {
          $scope.pathListedStatus[pathName] = !$scope.isSinglePath;
        }
      });
    }
  });

  $scope.setAllPathsListed = function (value){
    for (var pathName in $scope.pathListedStatus) {
      $scope.pathListedStatus[pathName] = value;
    }
  };

  $scope.isPathListed = function (pathName) {
    return $scope.pathListedStatus[pathName];
  };

  $scope.areAllPathsListed = function () {
    return Object.keys($scope.pathListedStatus).reduce(function (memory, pathName) {
      return $scope.pathListedStatus[pathName] && memory;
    }, true);
  };

  $scope.toggleAllPathsListed = function () {
    var allListed = $scope.areAllPathsListed();
    for (var pathName in $scope.pathListedStatus) {
      $scope.pathListedStatus[pathName] = !allListed;
    }
  };
}
