describe('ICardExpiry', function () {
    describe('#validate', function () {
        assert.isTrue(new ICardExpiry('11/14').validate());
        assert.isFalse(new ICardExpiry('02/14').validate());
        assert.isTrue(new ICardExpiry(' 1 / 15 ').validate());
        assert.isTrue(new ICardExpiry(' 09 / 15 ').validate());
        assert.isTrue(new ICardExpiry(' 9 / 15').validate());
        assert.isTrue(new ICardExpiry(' 01 / 15 ').validate());
        assert.isTrue(new ICardExpiry('11 / 15').validate());
        assert.isTrue(new ICardExpiry(' 01 / 2015 ').validate());
        assert.isFalse(new ICardExpiry('0.1/14').validate());
        assert.isFalse(new ICardExpiry('1/1.4').validate());
        assert.isFalse(new ICardExpiry('1/4').validate());
        assert.isFalse(new ICardExpiry('1/9').validate());
        assert.isFalse(new ICardExpiry('1/12').validate());
        assert.isFalse(new ICardExpiry('1/2013').validate());
        assert.isFalse(new ICardExpiry('1/999').validate());
    });

    describe('#toString', function () {
        assert.equal(new ICardExpiry('11/14').toString('', ' / '), '11 / 14');
        assert.equal(new ICardExpiry('02/15').toString('', ' / '), '02 / 15');
        assert.equal(new ICardExpiry('01/14').toString('', ' / '), '01 / 14');
        assert.equal(new ICardExpiry('1/14').toString('', ' / '), '01 / 14');
        assert.equal(new ICardExpiry('3/14').toString('', ' / '), '03 / 14');
        assert.equal(new ICardExpiry('11/2014').toString('short', ' / '), '11 / 14');
        assert.equal(new ICardExpiry('11/2014').toString('full', ' / '), '11 / 2014');
        assert.notEqual(new ICardExpiry('11/14').toString('full', ' / '), '11 / 2014');
        assert.equal(new ICardExpiry('11/14').toString('full', ' / '), '11 / 14');
    });

    describe('#format', function () {
        assert.equal(ICardExpiry.format('11/14', ' / '), '11 / 14');
        assert.equal(ICardExpiry.format('01', ' / '), '01 / ');
        assert.equal(ICardExpiry.format('1', ' / '), '1');
        assert.equal(ICardExpiry.format('011', ' / '), '01 / 1');
        assert.equal(ICardExpiry.format('0/', ' / '), '0');
        assert.equal(ICardExpiry.format('2', ' / '), '02 / ');
        assert.equal(ICardExpiry.format('2/', ' / '), '02 / ');
        assert.equal(ICardExpiry.format('1/', ' / '), '01 / ');
        assert.equal(ICardExpiry.format('1/1', ' / '), '01 / 1');
        assert.equal(ICardExpiry.format('1/1', ' / '), '01 / 1');
        assert.equal(ICardExpiry.format('1/14', ' / '), '01 / 14');
        assert.equal(ICardExpiry.format('1/14', ' / '), '01 / 14');
    });
});