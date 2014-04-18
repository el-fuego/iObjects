describe('IAccount', function () {
    var masterCard = [
            new IAccount(5412712300087328),
            new IAccount(6762160024213156),
            new IAccount(5469380037292504),
            new IAccount(5101451323405573),
            new IAccount(6771919000805189)
        ],
        visa = [
            new IAccount('4644050642124878-4644050642124878'),
            new IAccount(4874100010418153),
            new IAccount(4787154407220009)
        ],
        customerAccounts = [
            new IAccount(26008139124001),
            new IAccount(26005060193063),
            new IAccount(464405064212487823),
            new IAccount(67719190008051),
            new IAccount(510145132340557324)
        ],
        invalidAccounts = [
            new IAccount(2600), // invalid min length
            new IAccount(5101451322405573), // invalid MasterCard
            new IAccount(464405) // invalid Account
        ];

    describe('#constructor', function () {
        it('incorrect values', function () {
            assert.strictEqual(new IAccount('ddasdasd').toString(), '');
            assert.strictEqual(new IAccount().toString(), '');
            assert.strictEqual(new IAccount(null).toString(), '');
        });

        it('correct values', function () {
            assert.strictEqual(masterCard[0].toString(), '5412712300087328');
            assert.strictEqual(visa[0].toString(), '4644050642124878');
        });
    });

    describe('#toString', function () {
        it('correct values', function () {
            assert.isString(masterCard[2].toString());
            assert.strictEqual(customerAccounts[0].toString('full'), '26008139124001-26008139124001');
        });
    });

    describe('#toNumber', function () {
        it('correct values', function () {
            assert.isNumber(masterCard[3].toNumber());
            assert.strictEqual(masterCard[1].toNumber(), 6762160024213156);
        });
    });

    describe('#toHtml', function () {
        it('correct values', function () {
            assert.isString(masterCard[3].toHtml());
        });

        it('full format', function () {
            assert.strictEqual(visa[1].toHtml(), '<span>4874</span><span>1000</span><span>1041</span><span>8153</span>');
            assert.strictEqual(visa[2].toHtml('full', '<div>'), '<div>4787</div><div>1544</div><div>0722</div><div>0009</div>');
            assert.strictEqual(visa[2].toHtml('full', ' '), '4787 1544 0722 0009');
        });

        it('hidden format', function () {
            assert.strictEqual(customerAccounts[2].toHtml('hidden', ' '), '4644 **** **** **78 00');
            assert.strictEqual(customerAccounts[3].toHtml('hidden'), '<span>6771</span><span>****</span><span>**80</span><span>51</span>');
        });

        it('short format', function () {
            assert.strictEqual(customerAccounts[0].toHtml('short'), '**4001');
        });

        it('incorrect values', function () {
            assert.strictEqual(masterCard[1].toHtml(1232), '');
            assert.strictEqual(masterCard[1].toHtml('undefinedFormat'), '');
        });
    });

    describe('#isVisa', function () {
        var i = 0,
            j = 0;

        it('correct values', function () {
            for (i; i < visa.length; i++) {
                assert.isTrue(visa[i].isVisa());
            }
        });

        it('incorrect values', function () {
            for (j; j < masterCard.length; j++) {
                assert.isFalse(masterCard[j].isVisa());
            }
        });
    });

    describe('#isMasterCard', function () {
        var i = 0,
            j = 0;

        it('incorrect values', function () {
            for (i; i < visa.length; i++) {
                assert.isFalse(visa[i].isMasterCard());
            }
        });

        it('correct values', function () {
            for (j; j < masterCard.length; j++) {
                assert.isTrue(masterCard[j].isMasterCard());
            }
        });
    });

    describe('#isAccount', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < customerAccounts.length; i++) {
                assert.isTrue(customerAccounts[i].isAccount());
            }
        });
    });

    describe('#validate', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < customerAccounts.length; i++) {
                assert.isTrue(customerAccounts[i].validate());
            }
            i = 0;
            for (i; i < masterCard.length; i++) {
                assert.isTrue(masterCard[i].validate());
            }
            i = 0;
            for (i; i < visa.length; i++) {
                assert.isTrue(visa[i].validate());
            }
            i = 0;
        });

        it('incorrect values', function () {
            for (i; i < invalidAccounts.length; i++) {
                assert.isFalse(invalidAccounts[i].validate());
            }
        });
    });

    describe('#is', function () {

        it('incorrect values', function () {
            assert.isFalse(masterCard[0].is(visa[1]));
            assert.isFalse(masterCard[0].is(4874100010418153));
        });

        it('correct values', function () {
            assert.isTrue(customerAccounts[0].is(customerAccounts[0]));
            assert.isTrue(visa[0].is('4644050642124878-4644050642124878'));
        });
    });
});