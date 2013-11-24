var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled, search;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, searchValue, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              searchValue = $(attrs.infiniteScrollSearchControl.toString())[0].value;
              return scope.$eval(attrs.infiniteScroll, {
                searchText: searchValue
              });
            } else {
              searchValue = $(attrs.infiniteScrollSearchControl.toString())[0].value;
              return scope.$eval(attrs.infiniteScroll, {
                searchText: searchValue
              });
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        search = function() {
          var searchValue;
          searchValue = $(attrs.infiniteScrollSearchControl.toString())[0].value;
          return scope.$eval(attrs.infiniteScroll, {
            searchText: searchValue,
            overrideBusy: true
          });
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          if (attrs.infiniteScrollSearchControl != null) {
            $(attrs.infiniteScrollSearchControl).off('keyup', search);
          }
          return $window.off('scroll', handler);
        });
        if (attrs.infiniteScrollSearchControl != null) {
          $(attrs.infiniteScrollSearchControl).on('keyup', search);
        }
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);
