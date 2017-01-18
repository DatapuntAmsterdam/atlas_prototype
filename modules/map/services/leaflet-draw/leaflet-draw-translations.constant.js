(function () {
    'use strict';

    angular
        .module('dpMap')
        .constant('LEAFLET_DRAW_TRANSLATIONS', {
            draw: {
                toolbar: {
                    actions: {
                        title: 'Cancel drawing',
                        text: 'Cancel'
                    },
                    finish: {
                        title: 'Finish drawing',
                        text: 'Finish'
                    },
                    undo: {
                        title: 'Delete last point drawn',
                        text: 'Delete last point'
                    },
                    buttons: {
                        polyline: 'Draw a polyline',
                        polygon: 'Draw a polygon',
                        rectangle: 'Draw a rectangle',
                        circle: 'Draw a circle',
                        marker: 'Draw a marker'
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: 'Click and drag to draw circle.'
                        },
                        radius: 'Radius'
                    },
                    marker: {
                        tooltip: {
                            start: 'Click map to place marker.'
                        }
                    },
                    polygon: {
                        tooltip: {
                            start: '',
                            cont: '',
                            end: ''
                        }
                    },
                    polyline: {
                        error: '',
                        tooltip: {
                            start: 'Click to start drawing line.',
                            cont: 'Click to continue drawing line.',
                            end: 'Click last point to finish line.'
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: 'Click and drag to draw rectangle.'
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: 'Release mouse to finish drawing.'
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: 'Save changes.',
                            text: 'Save'
                        },
                        cancel: {
                            title: 'Cancel editing, discards all changes.',
                            text: 'Cancel'
                        }
                    },
                    buttons: {
                        edit: 'Edit layers.',
                        editDisabled: 'No layers to edit.',
                        remove: 'Delete layers.',
                        removeDisabled: 'No layers to delete.'
                    }
                },
                handlers: {
                    edit: {
                        tooltip: {
                            text: '',
                            subtext: ''
                        }
                    },
                    remove: {
                        tooltip: {
                            text: 'Click on a feature to remove'
                        }
                    }
                }
            }
        });
})();
