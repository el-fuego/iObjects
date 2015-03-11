describe('ICardExpiry', function () {
    var today = new Date(),
        currentYear = today.getFullYear(),
        nextYear = currentYear + 1,
        prevYear = currentYear - 1,
        currentMonth = today.getMonth() + 1,
        nextShortYear = +(String(nextYear).substring(2, 4)),
        currentShortYear = +(String(currentYear).substring(2, 4));

    describe('#validate', function () {
        assert.isTrue(new ICardExpiry(currentMonth + '/' + currentShortYear).validate());
        assert.isTrue(new ICardExpiry(' ' + currentMonth + ' / ' + currentShortYear).validate());
        assert.isTrue(new ICardExpiry(currentMonth + '  / ' + currentShortYear + ' ').validate());
        assert.isTrue(new ICardExpiry(' 9 / ' + nextYear).validate());
        assert.isTrue(new ICardExpiry(' 09 / ' + nextYear).validate());
        assert.isTrue(new ICardExpiry(' 01 / ' + nextYear + ' ').validate());
        assert.isTrue(new ICardExpiry('11 / ' + nextYear).validate());
        assert.isTrue(new ICardExpiry(' 01 / ' + nextYear + ' ').validate());

        assert.isFalse(new ICardExpiry('11/' + prevYear).validate());
        assert.isFalse(new ICardExpiry('14/' + currentShortYear).validate());
        assert.isFalse(new ICardExpiry('02/' + currentShortYear).validate());
        assert.isFalse(new ICardExpiry('0.1/' + currentShortYear).validate());
        assert.isFalse(new ICardExpiry('1/1.4').validate());
        assert.isFalse(new ICardExpiry('1/4').validate());
        assert.isFalse(new ICardExpiry('1/9').validate());
        assert.isFalse(new ICardExpiry('1/12').validate());
        assert.isFalse(new ICardExpiry('1/2013').validate());
        assert.isFalse(new ICardExpiry('1/999').validate());
    });

    describe('#toString', function () {
        assert.equal(new ICardExpiry('11/' + nextShortYear).toString('', ' / '), '11 / ' + nextShortYear);
        assert.equal(new ICardExpiry('02/' + nextShortYear).toString('', ' / '), '02 / ' + nextShortYear);
        assert.equal(new ICardExpiry('01/' + nextShortYear).toString('', ' / '), '01 / ' + nextShortYear);
        assert.equal(new ICardExpiry('1/' + nextShortYear).toString('', ' / '), '01 / ' + nextShortYear);
        assert.equal(new ICardExpiry('3/' + nextShortYear).toString('', ' / '), '03 / ' + nextShortYear);
        assert.equal(new ICardExpiry('11/' + nextYear).toString('short', ' / '), '11 / ' + nextShortYear);
        assert.equal(new ICardExpiry('11/' + nextYear).toString('full', ' / '), '11 / ' + nextYear);
        assert.equal(new ICardExpiry('11/' + nextShortYear).toString('full', ' / '), '11 / ' + nextShortYear);

        assert.notEqual(new ICardExpiry('11/' + nextShortYear).toString('full', ' / '), '11 / ' + nextYear);
    });

    describe('#format', function () {
        assert.equal(ICardExpiry.format('11/14', ' / '), '11 / 14');
        assert.equal(ICardExpiry.format('01', ' / '), '01 / ');
        assert.equal(ICardExpiry.format('1', ' / '), '1');
        assert.equal(ICardExpiry.format('14', ' / '), '1');
        assert.equal(ICardExpiry.format('011', ' / '), '01 / 1');
        assert.equal(ICardExpiry.format('0/', ' / '), '0');
        assert.equal(ICardExpiry.format('2', ' / '), '02 / ');
        assert.equal(ICardExpiry.format('2/', ' / '), '02 / ');
        assert.equal(ICardExpiry.format('1/', ' / '), '01 / ');
        assert.equal(ICardExpiry.format('1/1', ' / '), '01 / 1');
        assert.equal(ICardExpiry.format('1/1', ' / '), '01 / 1');
        assert.equal(ICardExpiry.format('1/14', ' / '), '01 / 14');
        assert.equal(ICardExpiry.format('1/14', ' / '), '01 / 14');
        assert.equal(ICardExpiry.format('-1', ' / '), '1');
    });
});