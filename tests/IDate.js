describe('IDate', function () {
    var today = new IDate('18 апреля 2014'),
        time = new IDate('31.01.2014 23:59:59.999'),
        now = new IDate('now'),
        date = new Date(),
        dateToday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
        dateTomorrow = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() + 1, 0, 0, 0, 0),
        dateYesterday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() - 1, 0, 0, 0, 0);



    describe('#constructor', function () {
        it('correct values', function () {
            assert.strictEqual(new IDate(1397820098000).date(), '18.04.2014');
            assert.strictEqual(new IDate('today').getMilliseconds(), dateToday.getTime());
            assert.strictEqual(new IDate('tomorrow').getMilliseconds(), dateTomorrow.getTime());
            assert.strictEqual(new IDate('yesterday').getMilliseconds(), dateYesterday.getTime());
            assert.strictEqual(new IDate('May 31, 2013').date(), '31.05.2013');
            assert.strictEqual(new IDate('1999-01-25').date(), '25.01.1999');
            assert.strictEqual(new IDate('19990125').date(), '25.01.1999');
            assert.strictEqual(new IDate('199901').date(), '01.01.1999');
            assert.strictEqual(new IDate('28 янв 2010').date(), '28.01.2010');
            assert.strictEqual(new IDate('28 января 2010').date(), '28.01.2010');
            assert.strictEqual(new IDate('28 jan 2010').date(), '28.01.2010');
            assert.strictEqual(new IDate('28 січ 2010').date(), '28.01.2010');
            assert.strictEqual(new IDate('28 січ 2010 12:59:59.999').toString('dd.mm.yyyy HH:MM:ss mmm'), '28.01.2010 12:59:59 999');
            assert.strictEqual(new IDate('28 січ 2010 12:59:59').toString('dd.mm.yyyy HH:MM:ss'), '28.01.2010 12:59:59');
            assert.strictEqual(new IDate('28 січ 2010 12:59').toString('dd.mm.yyyy HH:MM'), '28.01.2010 12:59');
        });
    });

    describe('#getMonthName', function () {
        it('correct values', function () {
            assert.strictEqual(today.getMonthName(), 'Апрель');
        });
    });

    describe('#set', function () {
        it('correct values', function () {
            assert.strictEqual(new IDate('25.01.1988').set({year: 2015}).date(), '25.01.2015');
        });
    });

    describe('#get', function () {
        it('correct values', function () {
            assert.strictEqual(today.get('date'), 18);
            assert.strictEqual(today.get('getdayofweek'), 5);
        });
    });

    describe('#toHtml', function () {
        it('correct values', function () {
            assert.strictEqual(today.toHtml(), '<span>18.04.2014 00:00</span>');
        });
    });

    describe('#toDate', function () {
        it('correct values', function () {
            assert.instanceOf(today.toDate(), Date);
            assert.strictEqual(today.toDate().getFullYear(), 2014);
        });
    });

    describe('#date', function () {
        it('correct values', function () {
            assert.strictEqual(today.date(), '18.04.2014');
        });
    });

    describe('#time', function () {
        it('correct values', function () {
            assert.strictEqual(time.time(), '23:59');
        });
    });

    describe('#timestamp', function () {
        it('correct values', function () {
            assert.strictEqual(time.timestamp(), '2014-01-31T23:59:59Z');
        });
    });

    describe('#getMilliseconds', function () {
        it('correct values', function () {
            assert.strictEqual(time.getMilliseconds(), 1391209199000);
        });
    });

    describe('#getDifference', function () {
        it('correct values', function () {
            var diff = time.getDifference(today);

            assert.strictEqual(diff.days, 13);
            assert.strictEqual(diff.hours, 23);
            assert.strictEqual(diff.minutes, 59);
            assert.strictEqual(diff.months, -3);
            assert.strictEqual(diff.ms, 999);
            assert.strictEqual(diff.seconds, 59);
            assert.strictEqual(diff.years, 0);
        });
    });

    describe('#getUnitDifference', function () {
        it('correct values', function () {
            assert.strictEqual(time.getUnitDifference(today), -75.95834490740741);
        });
    });

    describe('#getDaysInMonth', function () {
        it('correct values', function () {
            assert.strictEqual(time.getDaysInMonth(), 31);
        });
    });

    describe('#getShifted', function () {
        it('correct values', function () {
            assert.strictEqual(time.getShifted({years: 2}).get('year'), 2016);
        });
    });

    describe('#getDayOfWeek', function () {
        it('correct values', function () {
            assert.strictEqual(time.getDayOfWeek(), 5);
        });
    });

    describe('#validate', function () {
        it('correct values', function () {
            assert.isTrue(time.validate());
        });
    });

    describe('#is', function () {
        it('correct values', function () {
            assert.isTrue(today.is('18.04.2014'));
        });

        it('incorrect values', function () {
            assert.isFalse(today.is('25.04.2014'));
        });
    });
});