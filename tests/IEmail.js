describe('IEmail', function () {
    var validEmail = "test@gmail.com";

    describe('#toString', function () {
        assert.isString(new IEmail(validEmail).toString());
        assert.lengthOf(new IEmail(validEmail).toString(), 14);
    });

    describe('#toHtml', function () {
        assert.isString(new IEmail(validEmail).toHtml());
        assert.equal(new IEmail(validEmail).toHtml(), "<span>" + validEmail + "</span>");
    });

    describe('#constructor', function () {
        assert.equal(new IEmail(validEmail).toString(), validEmail);
        assert.equal(new IEmail('test@').toString(), '');
    });

    describe('#is', function () {
        assert.isTrue(new IEmail(validEmail).is(validEmail));
        assert.isFalse(new IEmail('@gmail.com').is(validEmail));
    });
});