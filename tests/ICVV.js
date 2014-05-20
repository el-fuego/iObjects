describe('ICVV', function () {
    describe('#toString', function () {
        assert.isString(new ICVV(123).toString());
        assert.lengthOf(new ICVV(123).toString(), 3);
    });

    describe('#toHtml', function () {
        assert.isString(new ICVV(123).toHtml());
        assert.equal(new ICVV(123).toHtml(), "<span>123</span>");
    });

    describe('#constructor', function () {
        assert.equal(new ICVV('123').toString(), '123');
        assert.equal(new ICVV(512).toString(), '512');
        assert.equal(new ICVV(1234).toString(), '1234');
        assert.lengthOf(new ICVV(1).toString(), 0);
        assert.lengthOf(new ICVV('11111').toString(), 0);
    });

    describe('#is', function () {
        assert.isTrue(new ICVV('123').is('123'));
        assert.isTrue(new ICVV('444').is(new ICVV('444')));
        assert.isFalse(new ICVV('123').is('12'));
        assert.isFalse(new ICVV('1111').is('11'));
        assert.isTrue(new ICVV(555).is(555));
        assert.isTrue(new ICVV(123).is('123'));
        assert.isTrue(new ICVV('123').is(123));
    });
});