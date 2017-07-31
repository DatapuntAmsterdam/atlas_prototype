describe('The markdown parser', () => {
    let markdownParser;

    beforeEach(() => {
        angular.mock.module('dpShared',
            $provide => {
                $provide.constant('marked', (text) => 'marked' + text);
            }
        );

        angular.mock.inject(_markdownParser_ => {
            markdownParser = _markdownParser_;
        });
    });

    it('uses the marked library to parse markdown text', () => {
        expect(markdownParser.parse('text')).toBe('markedtext');
    });
});
