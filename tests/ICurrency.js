describe('ICurrency', function () {
    describe('#toString', function () {
        assert.isString(new ICurrency('UAH').toString());
        assert.lengthOf(new ICurrency('UAH').toString(), 3);
    });

    describe('#toHtml', function () {
        assert.isString(new ICurrency('UAH').toHtml());
        assert.equal(new ICurrency('EUR').toHtml(), "<span>EUR</span>");
    });

    describe('#constructor', function () {
        assert.equal(new ICurrency('098').toString(), 'АИ-98');
        assert.equal(new ICurrency('980').toString(), 'UAH');
        assert.equal(new ICurrency('гривень').toString(), 'UAH');
        assert.equal(new ICurrency('EUR').toString(), 'EUR');
        assert.equal(new ICurrency('euro').toString(), 'EUR');
        assert.equal(new ICurrency('евро').toString(), 'EUR');
        assert.equal(new ICurrency('доллар').toString(), 'USD');
        assert.equal(new ICurrency('030').toString(), 'Газ');
    });

    describe('#is', function () {
        assert.isTrue(new ICurrency('098').is('АИ-98'));
        assert.isTrue(new ICurrency('980').is(new ICurrency('UAH')));
        assert.isFalse(new ICurrency('гривень').is('USD'));
        assert.isFalse(new ICurrency('EUR').is('USD'));
        assert.isTrue(new ICurrency('euro').is('EUR'));
        assert.isTrue(new ICurrency('евро').is('EUR'));
        assert.isTrue(new ICurrency('доллар').is('USD'));
    });
});