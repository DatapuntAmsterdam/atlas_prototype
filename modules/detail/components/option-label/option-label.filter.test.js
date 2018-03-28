describe('The optionLabel filter', () => {
    let optionLabelFilter;
    const searchList = [];

    beforeEach(() => {
        angular.mock.module('dpDetail');

        angular.mock.inject((_optionLabelFilter_) => {
            optionLabelFilter = _optionLabelFilter_;
        });

        searchList.push({
            id: 'id1',
            label: 'label1'
        });
        searchList.push({
            id: 'id2',
            label: 'label2'
        });
    });

    it('returns the corect label', () => {
        expect(optionLabelFilter('id1', searchList)).toBe('label1');
        expect(optionLabelFilter('id2', searchList)).toBe('label2');
        expect(optionLabelFilter('theme:id1', searchList, 'theme')).toBe('label1');
    });

    it('returns the id when the value can\'t be found', () => {
        expect(optionLabelFilter('id3', searchList)).toBe('id3');
    });
});
