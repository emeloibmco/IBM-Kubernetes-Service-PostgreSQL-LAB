/*
 © Copyright IBM Corp. 2018
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

angular.module('App', ['ui.router', 'MainView'])
.config(function($stateProvider, $urlRouterProvider)  {
  'ngInject';
  $stateProvider.state('MainState', {
    url : '',
    templateUrl: '/templates/component.html',
    controller: 'MainCtrl'
  });
  $urlRouterProvider.otherwise('/');
});

angular.module('MainView', [])
.controller('MainCtrl', ['$scope','$http', function($scope,$http) {
  $scope.id = "";
  $scope.title = "";
  $scope.director = "";
  $scope.description = "";
  $scope.year = "";

  $scope.data = "";

  $scope.add = function() {

    $http({
      method:'POST',
      url: '/api/movies/',
      data: {
        'id': $scope.id,
        'title': $scope.title,
        'director': $scope.director,
        'description': $scope.description,
        'year': $scope.year
      }
    })
      .then(function(response) {
        $scope.get();

      }, function(error) {
        console.error('get movies failed : %s', error.message);
      });

  };

  $scope.get = function() {

    $http({
      method:'GET',
      url:'/api/movies/'

    })
      .then(function(response) {

        $scope.movies = response.data;
        $scope.data = $scope.movies[0].title;

        console.info('get movies sussess : %s', $scope.movies[0].title);

      }, function(error) {

        $scope.data = error.message;
        console.info('get movies failed : %s', error.message);
      });
  };


  $scope.update = function() {

    $http({
      method:'PUT',
      url:'/api/movies/' + $scope.id,
      data: {
        'id': $scope.id,
        'title': $scope.title,
        'director': $scope.director,
        'description': $scope.description,
        'year': $scope.year
      }
    })
      .then(function(response) {
        $scope.get();

      }, function(error) {
        console.error('update movies failed : %s', error.message);
      });
  };



  $scope.delete = function() {

    $http({
      method: 'DELETE',
      url: '/api/movies/' + $scope.id,
      data: {
        'id': $scope.id,
      }
    })
      .then(function(response) {
        $scope.get();

      }, function(error) {
        console.error('delete movies failed : %s', error.message);
      });
  };
}]);