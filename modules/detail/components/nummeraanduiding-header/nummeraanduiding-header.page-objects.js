'use strict';

const glossaryHeader = dp.require('modules/detail/components/glossary/header/glossary-header.page-objects');

module.exports = nummeraanduidingHeaderElement => ({
    get glossaryHeader () {
        return glossaryHeader(nummeraanduidingHeaderElement.element(by.css('dp-glossary-header')));
    }
});
