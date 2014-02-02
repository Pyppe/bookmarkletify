'use strict';

var app = angular.module('bookmarkletify', []);
var $app = $('#app');

app.filter('rawCode', ['$sce', function($sce) {
  return function(val) {
    //return $sce.trustAs('js', val);
    return $sce.trustAsHtml(val);
  };
}]);

app.controller('MainCtrl', ['$scope', '$http', '$timeout', '$q', function($scope, $http, $timeout, $q) {
  $scope.libs = [
    { name: 'jQuery', version: 'Latest', url:'https://code.jquery.com/jquery.min.js', selected: true },
    { name: 'Lodash', version: '2.4.1', url:'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.compat.min.js', selected: true }
  ];
  $scope.customLibs = [];

  $scope.addLib = function() {
    $scope.customLibs.push({url: ''});
  };

  $scope.removeCustomLib = function(lib) {
    $scope.customLibs = _.filter($scope.customLibs, function(l) {
      return l.$$hashKey !== lib.$$hashKey;
    });
  };

  function selectedLibs() {
    return _.filter($scope.libs, function(x) {
      return x.selected
    });
  }

  $scope.$watch('javascript', function(newVal, oldVal) {
    $timeout(function() {
      $('#code').each(function(i, el) {hljs.highlightBlock(el)});
    }, 10);
  });

  // https://github.com/chriszarate/bookmarkleter

  $scope.bookmarkJs = function () {
    var libs = _.compact(_.map(selectedLibs().concat($scope.customLibs), takeUrl));
    var quotedLibs =_.map(libs, function(u) { return "'" + u + "'";});
    var sep = quotedLibs.length > 1 ? '\n' : '';
    var js = 'var ls = [' + sep + quotedLibs.join(','+sep) + sep + '];\n';
    js += "var s = document.createElement('script');";
    /*
    s.setAttribute('src', 'http://code.jquery.com/jquery.min.js');
    document.getElementsByTagName('body')[0].appendChild(s);
    alert('thank you for using jquery!');
    void(s);
    */


    $scope.javascript = js;
    $scope.bookmarklet = toBookmarklet(js);
    return js;
  };

  function toBookmarklet(js) {
    return 'javascript:' +
        uglify(js).replace(/ /g, '%20').
            replace(/"/g, '%22').
            replace(/%/g, '%25');
  }

  function takeUrl(x) {
    return x.url;
  }

  $app.fadeIn();
}]);

