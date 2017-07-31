'use strict';

module.exports = layerSelectionElement => ({
    get visible () {
        return dp.visible(layerSelectionElement);
    },

    close: layerSelectionElement.element(by.css('.qa-layer-selection-close')).click,

    get baselayers () {
        return categoryPageObject(
            layerSelectionElement.element(by.css('.qa-baselayers')),
            'baseLayer in vm.allBaseLayers'
        );
    },

    get overlays () {
        return {
            categories: function (index) {
                return categoryPageObject(
                    layerSelectionElement.element(by.repeater('category in vm.allOverlays').row(index)),
                    'overlay in category.overlays'
                );
            }
        };
    }
});

function categoryPageObject (categoryElement, repeatBy) {
    return {
        get header () {
            return categoryElement.element(by.css('.qa-category-header')).getText();
        },
        options: function (index) {
            return optionPageObject(categoryElement.element(by.repeater(repeatBy).row(index)));
        }
    };
}

function optionPageObject (optionElement) {
    return {
        get label () {
            return optionElement.element(by.css('.qa-option-label')).getText();
        }
    };
}
