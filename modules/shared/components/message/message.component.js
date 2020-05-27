import angular from 'angular'

/**
 * The dpMessage component displays a message about any missing data
 * Although this component is yet without any behaviour (it simply styles the message)
 * it is implemented as a component to allow any future functionality
 * An example is to allow for the display of standard messages to prevent duplicating message texts in the code
 */
angular.module('dpShared').component('dpMessage', {
  transclude: true,
  templateUrl: 'modules/shared/components/message/message.html',
})
