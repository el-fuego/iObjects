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
        assert.equal(new ICurrency('980').toString(), 'UAH');
        assert.equal(new ICurrency('гривень').toString(), 'UAH');
        assert.equal(new ICurrency('EUR').toString(), 'EUR');
        assert.equal(new ICurrency('euro').toString(), 'EUR');
        assert.equal(new ICurrency('евро').toString(), 'EUR');
        assert.equal(new ICurrency('доллар').toString(), 'USD');
        assert.equal(new ICurrency('099').toString(), 'UAH');
        assert.equal(new ICurrency('095').toString(), 'А-95');
        assert.equal(new ICurrency('95').toString(), 'А-95');
        assert.equal(new ICurrency('076').toString(), 'А-76');
        assert.equal(new ICurrency('76').toString(), 'А-76');
        assert.equal(new ICurrency('080').toString(), 'А-80');
        assert.equal(new ICurrency('80').toString(), 'А-80');
        assert.equal(new ICurrency('091').toString(), 'ДТ Energy');
        assert.equal(new ICurrency('91').toString(), 'ДТ Energy');
        assert.equal(new ICurrency('092').toString(), 'А-92');
        assert.equal(new ICurrency('92').toString(), 'А-92');
        assert.equal(new ICurrency('098').toString(), 'А-95 Energy');
        assert.equal(new ICurrency('98').toString(), 'А-95 Energy');
        assert.equal(new ICurrency('098').toString(), 'А-95 Energy');
        assert.equal(new ICurrency('98').toString(), 'А-95 Energy');
        assert.equal(new ICurrency('030').toString(), 'Газа');
        assert.equal(new ICurrency('30').toString(), 'Газа');
        assert.equal(new ICurrency('090').toString(), 'ДТ Евро');
        assert.equal(new ICurrency('90').toString(), 'ДТ Евро');
        assert.equal(new ICurrency('094').toString(), 'E-95 S');
        assert.equal(new ICurrency('94').toString(), 'E-95 S');
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