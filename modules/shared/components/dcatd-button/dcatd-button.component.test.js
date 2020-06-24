describe('The dp-dcatd-button component', () => {
  let $compile
  let $rootScope
  let $window
  let origSessionStorage

  beforeEach(() => {
    angular.mock.module('dpShared')

    angular.mock.inject(function (_$compile_, _$rootScope_, _$window_) {
      $compile = _$compile_
      $rootScope = _$rootScope_
      $window = _$window_
    })

    origSessionStorage = $window.sessionStorage
    $window.sessionStorage = {
      setItem: angular.noop,
    }

    spyOn($window.location, 'assign')
    spyOn($window.sessionStorage, 'setItem')
  })

  afterEach(() => {
    $window.sessionStorage = origSessionStorage
  })

  function getComponent(transcluded, id) {
    const element = document.createElement('dp-dcatd-button')
    element.setAttribute('id', id)
    element.innerText = transcluded

    const scope = $rootScope.$new()
    const component = $compile(element)(scope)
    scope.$digest()

    return component
  }

  it('renders button', () => {
    const component = getComponent('Wijzigen', 'id-van-te-wijzigen-dataset')

    expect(component.text().trim()).toBe('Wijzigen')
  })

  it('when clicking the button', () => {
    const component = getComponent('Wijzigen', 'id-van-te-wijzigen-dataset')
    component.find('button').click()

    expect($window.sessionStorage.setItem).toHaveBeenCalledWith(
      'DCATD_DETAIL_REDIRECT_URL',
      jasmine.any(String),
    )
    expect($window.sessionStorage.setItem).toHaveBeenCalledWith(
      'DCATD_LIST_REDIRECT_URL',
      jasmine.any(String),
    )

    expect($window.location.assign).toHaveBeenCalledWith(
      '/dcatd_admin/#/datasets/id-van-te-wijzigen-dataset',
    )
  })
})
