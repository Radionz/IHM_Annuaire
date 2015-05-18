'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('ProjectsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects').success(function (data) {
      $scope.projects = data.data;
    });

    if ($routeParams.projectId) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId).success(function (data) {
        if (data.status == "success") {
          $scope.currentProject = data.data;
        }
      });
    }

    if ($routeParams.projectId) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId + '/Users').success(function (data) {
        if (data.status == "success") {
          $scope.currentProject.users = data.data;
        }
      });
    }
  }]);
