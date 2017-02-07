(function () {
    'use strict';

    angular
        .module('dpMap')
        .constant('LEAFLET_DRAW_TRANSLATIONS', {
            draw: {
                toolbar: {
                    actions: {
                        title: '',
                        text: ''
                    },
                    finish: {
                        title: '',
                        text: ''
                    },
                    undo: {
                        title: '',
                        text: ''
                    },
                    buttons: {
                        polyline: '',
                        polygon: '',
                        rectangle: '',
                        circle: '',
                        marker: ''
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: ''
                        },
                        radius: ''
                    },
                    marker: {
                        tooltip: {
                            start: ''
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
                            start: '',
                            cont: '',
                            end: ''
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: ''
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: ''
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: '',
                            text: ''
                        },
                        cancel: {
                            title: '',
                            text: ''
                        }
                    },
                    buttons: {
                        edit: '',
                        editDisabled: '',
                        remove: '',
                        removeDisabled: ''
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
                            text: ''
                        }
                    }
                }
            }
        });
})();
