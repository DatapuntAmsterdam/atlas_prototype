describe('The dp-wkpb-download-link directive', function() {
  let api
  let $compile
  let $q
  let $rootScope

  beforeEach(function() {
    angular.mock.module('dpDetail')

    angular.mock.inject(function(_$compile_, _$q_, _$rootScope_, _api_) {
      $compile = _$compile_
      $q = _$q_
      $rootScope = _$rootScope_
      api = _api_
    })

    spyOn(api, 'createUrlWithToken').and.callFake($q.resolve) // wrap url in promise
  })

  function getComponent(url, label) {
    const element = document.createElement('dp-wkpb-download-link')
    element.setAttribute('url', url)
    element.setAttribute('label', label)

    const scope = $rootScope.$new()

    const component = $compile(element)(scope)
    scope.$apply()

    return component
  }

  it('renders the attributes', function() {
    const component = getComponent('https"//api.com/my-api', 'download file')

    expect(component.attr('url')).toBe('https"//api.com/my-api')
    expect(component.attr('label')).toBe('download file')
  })

  // Angular issue where the component doesn't get rendered in the tests
  // Skip this test for now untill component is refactored to React
  xit('enriches the download url with the access token', function() {
    api.createUrlWithToken.and.returnValue($q.resolve('tokenUrl'))
    const component = getComponent('https"//api.com/my-api', 'download file')

    const scope = component.isolateScope()

    scope.$digest()

    expect(component.find('a').text()).toBe('download file')
    expect(component.find('a').attr('ng-href')).toBe('tokenUrl')
  })
})
