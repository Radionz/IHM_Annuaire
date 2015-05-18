'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the pooIhmExemplesApp
 */
var app = angular.module('pooIhmExemplesApp');

app.controller('UsersCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];

  $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users').success(function (users) {
    //USERS
    $scope.users = users.data;
    //FOR EACH USER, THESE PROJECTS
    angular.forEach($scope.users, function (user) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + user.id + '/Projects').success(function (userProjects) {
        user.projects = new Array();
        angular.forEach(userProjects.data, function (userProject) {
          userProject.roles = new Array();
          //FOR EACH PROJECTS, THESE ROLES
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Roles', {params: {ProjectId: userProject.id}}).success(function (userRoles) {
            angular.forEach(userRoles.data, function (userRole) {
              userProject.roles.push(userRole);
            });
            user.projects.push(userProject);
          });
        });
      });
    });
  });

  $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects').success(function (data) {
    $scope.projects = new Array();
    angular.forEach(data.data, function (project) {
      $scope.projects.push({id: project.id, title: project.title});
    });
  });

  $scope.submit = function (user) {
  };

  $scope.removeUser = function (userId, index) {
    $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + userId).success(function (data, status) {
      $scope.users.splice(index, 1);
    });
  };

  $scope.editUser = function (user, index) {
    $scope.formUser = angular.copy(user);

    $scope.formUser.projectsIds = new Array();
    angular.forEach(user.projects, function (userProject) {
      $scope.formUser.projectsIds.push(userProject.id);
    });
  };

  $scope.$watchCollection('formUser.projectsIds', function (newVal, oldVal) {
    $scope.formUser.projects = new Array();
    angular.forEach(newVal, function (projectId) {
      console.log(getObjects($scope.projects,'id',projectId)[0]);
      $scope.formUser.projects.push(getObjects($scope.projects,'id',projectId)[0]);
    });
  });


  //URL: #/users/userId
  if ($routeParams.userId) {
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId).success(function (data) {
      if (data.status == "success") {
        $scope.currentUser = data.data;
      }
    });

    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId + '/Roles').success(function (data) {
      if (data.status == "success") {
        $scope.currentUser.roles = data.data;
      }
    });

    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId + '/Projects').success(function (data) {
      if (data.status == "success") {
        $scope.currentUser.projects = data.data;
      }
    });
  }
}]);

function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else
    //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    if (i == key && obj[i] == val || i == key && val == '') { //
      objects.push(obj);
    } else if (obj[i] == val && key == ''){
      //only add if the object is not already in the array
      if (objects.lastIndexOf(obj) == -1){
        objects.push(obj);
      }
    }
  }
  return objects;
}
