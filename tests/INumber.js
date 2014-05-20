describe('INumber', function () {
    var int = new INumber(249),
        float = new INumber(249.99),
        negativeInt = new INumber(-249),
        negativeFloat = new INumber(-249.99),
        string = new INumber('249'),
        negativeString = new INumber('-249'),
        bigFloat = new INumber(100500.99),
        bigInt = new INumber(100500);

    describe('#constructor', function () {
        it('incorrect values', function () {
            assert.strictEqual(new INumber('ddasdasd').toFloat(), 0);
            assert.strictEqual(new INumber(undefined).toFloat(), 0);
            assert.strictEqual(new INumber(null).toFloat(), 0);
        });

        it('correct values', function () {
            assert.strictEqual(int.toFloat(), 249);
            assert.strictEqual(string.toFloat(), 249);
        });
    });

    describe('#toString', function () {
        it('string type', function () {
            assert.isString(int.toString());
        });

        it('default format', function () {
            assert.strictEqual(bigInt.toString(), '100 500.00');
        });

        it('custom delimiters', function () {
            assert.strictEqual(bigInt.toString(',', ' thousand '), '100 thousand 500,00');
        });

        it('short format', function () {
            assert.strictEqual(bigInt.toString(',', ' thousand ', true), '100 thousand 500');
        });

        it('fixed flag', function () {
            assert.strictEqual(bigFloat.toString(',', ' thousand ', false, 3), '100 thousand 500,990');
        });

        it('absolute flag', function () {
            assert.strictEqual(negativeInt.toString(',', ' ', false, 3, true), '249,000');
        });
    });

    describe('#toHtml', function () {
        it('string type', function () {
            assert.isString(int.toHtml());
        });

        it('default format', function () {
            assert.strictEqual(bigInt.toHtml(), '100&nbsp;500.<small>00</small>');
        });

        it('custom delimiters', function () {
            assert.strictEqual(bigInt.toHtml(',', ' thousand '), '100&nbsp;thousand&nbsp;500,<small>00</small>');
        });

        it('custom html tag', function () {
            assert.strictEqual(bigInt.toHtml(',', ' thousand ', 'span'), '100&nbsp;thousand&nbsp;500,<span>00</span>');
        });

        it('short format without html fraction', function () {
            assert.strictEqual(bigInt.toHtml(',', ' thousand ', 'span', true), '100&nbsp;thousand&nbsp;500');
        });

        it('short format with html fraction', function () {
            assert.strictEqual(bigInt.toHtml(',', ' thousand ', 'span', false), '100&nbsp;thousand&nbsp;500,<span>00</span>');
        });

        it('fixed flag', function () {
            assert.strictEqual(bigFloat.toHtml(',', ' thousand ', 'span', false, 3), '100&nbsp;thousand&nbsp;500,<span>990</span>');
        });

        it('absolute flag', function () {
            assert.strictEqual(negativeFloat.toHtml(',', ' ', 'span', false, 3, true), '249,<span>990</span>');
        });
    });

    describe('#isNull', function () {
        it('incorrect', function () {
            assert.isFalse(int.isNull());
            assert.isFalse(string.isNull());
        });

        it('correct', function () {
            assert.isTrue(new INumber().isNull());
            assert.isTrue(new INumber(0).isNull());
        });
    });

    describe('#isNegative', function () {
        it('incorrect', function () {
            assert.isFalse(int.isNegative());
            assert.isFalse(string.isNegative());
        });

        it('correct', function () {
            assert.isTrue(negativeInt.isNegative());
            assert.isTrue(negativeString.isNegative());
        });
    });

    describe('#getAbs', function () {
        it('correct values', function () {
            assert.strictEqual(negativeFloat.getAbs().toFloat(), 249.99);
            assert.strictEqual(negativeString.getAbs().toFloat(), 249);
        });
    });

    describe('#getInverted', function () {
        it('correct values', function () {
            assert.strictEqual(negativeFloat.getInverted().toFloat(), 249.99);
            assert.strictEqual(negativeString.getInverted().toFloat(), 249);
            assert.strictEqual(bigInt.getInverted().toFloat(), -100500);
            assert.strictEqual(float.getInverted().toFloat(), -249.99);
        });
    });

    describe('#validate', function () {
        it('correct', function () {
            assert.isTrue(new INumber().validate());
            assert.isTrue(negativeString.validate());
        });
    });

    describe('#toFixed', function () {
        it('correct values', function () {
            assert.strictEqual(int.toFixed(), 249);
            assert.strictEqual(float.toFixed(1), 250);
            assert.strictEqual(negativeFloat.toFixed(1), -250);
        });
    });

    describe('#isDefault', function () {
        it('correct', function () {
            assert.isTrue(new INumber().isDefault());
            assert.isFalse(int.isDefault());
            assert.isFalse(new INumber(new INumber()).isDefault());
        });
    });

    describe('#is', function () {
        it('correct values', function () {
            assert.isTrue(int.is(249));
            assert.isTrue(negativeInt.is(-249));
            assert.isTrue(float.is('249.99'));
            assert.isFalse(float.is(null));
        });
    });

    describe('#floating numbers division problem', function () {
        var n1 = new INumber(64.32 - 0.32).toFloat(),
            n2 = new INumber(8.04 - 0.04).toFloat(),
            n3 = new INumber(16.08 - 0.08).toFloat(),
            n4 = new INumber(32.16 - 0.16).toFloat();

        it('correct values', function () {
            assert.strictEqual(n1, 64);
            assert.strictEqual(n2, 8);
            assert.strictEqual(n3, 16);
            assert.strictEqual(n4, 32);
        });
    });
});