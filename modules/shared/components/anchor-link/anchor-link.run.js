((() => {
    angular
        .module('dpShared')
        .run(['$anchorScroll', 'ANCHOR_LINK_SCROLL_OFFSET', ($anchorScroll, scrollOffset) => {
            $anchorScroll.yOffset = scrollOffset;   // always scroll by this amount of extra pixels
        }]);
}))();
