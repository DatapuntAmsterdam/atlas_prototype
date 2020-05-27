import angular from 'angular'

angular.module('dpShared').directive('dpExpandCollapse', DpExpandCollapseDirective)

DpExpandCollapseDirective.$inject = ['$compile', '$interval']

function DpExpandCollapseDirective($compile, $interval) {
  return {
    restrict: 'A',
    link: linkFn,
    scope: true,
  }

  function linkFn(scope, element) {
    // NB: `$timeout` is required to await the element's rendering
    $interval(
      () => {
        const initialHeight = element[0].offsetHeight
        const { scrollHeight } = element[0]

        if (scrollHeight <= initialHeight) {
          return
        }

        scope.collapsed = true
        setClass()

        const showMoreButton = $compile(
          [
            // eslint-disable-next-line
            "<button class=\"c-show-more{{ collapsed ? '' : '--less' }}\">",
            '{{ collapsed ? "Toon meer" : "Toon minder" }}',
            '</button>',
          ].join(''),
        )(scope)

        showMoreButton.on('click', () => {
          if (scope.collapsed) {
            element.css('max-height', `${scrollHeight}px`)
          } else {
            element.css('max-height', `${initialHeight}px`)
          }

          scope.$apply('collapsed = !collapsed')
          setClass()
        })

        function setClass() {
          angular.element(element).addClass('c-show-more__container')

          if (scope.collapsed) {
            angular.element(element).addClass('c-show-more__container--collapsed')
          } else {
            angular.element(element).removeClass('c-show-more__container--collapsed')
          }
        }

        element.after(showMoreButton)
      },
      0,
      1,
    )
  }
}
