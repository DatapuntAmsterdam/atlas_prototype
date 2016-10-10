describe('The atlas application is an es6 application and', function () {

    it('supports arrow functions', function () {
        var lambda = () => { return 'arrow function'; };
        expect(lambda()).toBe('arrow function');

        lambda = () => 'arrow function';
        expect(lambda()).toBe('arrow function');
    });

    it('supports template strings', function () {
        var template = 'template';
        var s = `I am a ${template}`;

        expect(s).toBe('I am a template');
    });

    it('supports destructuring', function () {
        var [a, ,b] = [1,2,3];

        expect(a).toBe(1);
        expect(b).toBe(3);
    });

    it('supports the let statement', function () {
        {
            let x = 1;
            expect(x).toBe(1);
        }
        expect(typeof x).toBe('undefined');
    });

    it('supports the const statement', function () {
        const x = 5;
        expect(x).toBe(5);
    });

    it('supports default parameters', function () {
        function f(x, y = 12) {
            // y is 12 if not passed (or passed as undefined)
            return x + y;
        }
        expect(f(3)).toBe(15);
    });

    it('supports the spread operator', function () {
        function myFunction(v, w, x, y, z) {
            return v + w + x + y + z;
        }

        var args = [2, 3];
        expect(myFunction(1,...args, 2,...[3])).toBe(11);
    });

    it('supports classes', function () {
        class Polygon {
            constructor(height, width) {
                this.height = height;
                this.width = width;
            }

            get area() {
                return this.calcArea();
            }

            calcArea() {
                return this.height * this.width;
            }
        }

        const square = new Polygon(10, 10);

        expect(square.area).toBe(100);
    });

    it('supports extended parameters', function () {
        function f (x, y, ...a) {
            return (x + y) * a.length;
        }

        expect(f(1, 2, 'hello', true, 7)).toBe(9);
    });

    it('supports binary and octal literals', function () {
        expect(0b111110111).toBe(503);
        expect(0o767).toBe(503);
    });

    it('supports property shorthands', function () {
        var x = 1;
        var y = 2;
        var obj = { x, y };

        expect(obj.x).toBe(1);
        expect(obj.y).toBe(2);
    });

    it('supports computed property names', function () {
        var x = 1;
        var y = 'y';
        var obj = { x, [y + '1']: 2 };

        expect(obj.x).toBe(1);
        expect(obj.y1).toBe(2);
    });

    it('supports method properties', function () {
        var obj = { x () { return 'xxx'; } };

        expect(obj.x()).toBe('xxx');
    });

    it('supports symbols', function () {
        // This requires the inclusion of polyfills
        expect(Symbol('foo') === Symbol('foo')).toBe(false);
    });

});