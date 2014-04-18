describe('IPhone', function () {
    var life = [
            new IPhone('0632654514'),
            new IPhone('+(380)93-265-45-14')
        ],
        mts = [
            new IPhone('+380502654514'),
            new IPhone('+380662654514')
        ],
        kyivStar = [
            new IPhone('+380672654514'),
            new IPhone('+380962654514')
        ],
        beeline = [
            new IPhone('+380682654514')
        ],
        ukrTelecom = [
            new IPhone('0442654514'),
            new IPhone('0612654514')
        ],

        peopleNet = [
            new IPhone('+380922654514')
        ],

        interTelecom = [
            new IPhone('+380456332000'),
            new IPhone('+380577576000')
        ],

        veltonTelecom = [
            new IPhone('0572654514')
        ],

        utel = [
            new IPhone('+380912654514')
        ],

        goldenTelecom = [
            new IPhone('+380392654514')
        ],

        vegaTelecom = [
            new IPhone('+380563711234')
        ],
        towns = [
            new IPhone('+380625945677'),
            new IPhone('+380486318834')
        ],
        invalidPhones = [
            new IPhone('+0992'),
            new IPhone('+38 000 111 22 33')
        ],
        russian = [
            new IPhone('+79054302211')
        ];


    describe('#constructor', function () {
        it('incorrect values', function () {
            assert.strictEqual(invalidPhones[0].toString(), '');
            assert.strictEqual(new IPhone().toString(), '');
            assert.strictEqual(new IPhone('dsadweq').toString(), '');
        });

        it('correct values', function () {
            assert.strictEqual(life[0].toString(), '+380632654514');
            assert.strictEqual(veltonTelecom[0].toString(), '+380572654514');
        });
    });

    describe('#isUkrTelecomPhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < ukrTelecom.length; i++) {
                assert.isTrue(ukrTelecom[i].isUkrTelecomPhone());
            }
        });
    });

    describe('#isUkrainianTownPhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < towns.length; i++) {
                assert.isTrue(towns[i].isUkrainianTownPhone());
            }
        });
    });

    describe('#isMobile', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < life.length; i++) {
                assert.isTrue(life[i].isMobile());
            }
            i = 0;
            for (i; i < mts.length; i++) {
                assert.isTrue(mts[i].isMobile());
            }
            i = 0;
            for (i; i < kyivStar.length; i++) {
                assert.isTrue(kyivStar[i].isMobile());
            }
            i = 0;
            for (i; i < beeline.length; i++) {
                assert.isTrue(beeline[i].isMobile());
            }
            i = 0;
        });
    });

    describe('#isUkrPhone', function () {

        it('correct values', function () {
            assert.isTrue(life[1].isUkrPhone());
        });

        it('incorrect values', function () {
            assert.isFalse(russian[0].isUkrPhone());
        });
    });

    describe('#isMtsPhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < mts.length; i++) {
                assert.isTrue(mts[i].isMtsPhone());
            }
        });
    });

    describe('#isKyivStarPhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < kyivStar.length; i++) {
                assert.isTrue(kyivStar[i].isKyivStarPhone());
            }
            i = 0;
            for (i; i < beeline.length; i++) {
                assert.isTrue(beeline[i].isKyivStarPhone());
            }
            i = 0;
            for (i; i < goldenTelecom.length; i++) {
                assert.isTrue(goldenTelecom[i].isKyivStarPhone());
            }
            i = 0;
        });
    });

    describe('#isPeopleNetPhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < peopleNet.length; i++) {
                assert.isTrue(peopleNet[i].isPeopleNetPhone());
            }
        });
    });

    describe('#isBeelinePhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < beeline.length; i++) {
                assert.isTrue(beeline[i].isBeelinePhone());
            }
        });
    });

    describe('#isLifePhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < life.length; i++) {
                assert.isTrue(life[i].isLifePhone());
            }
        });
    });

    describe('#isUtelPhone', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < utel.length; i++) {
                assert.isTrue(utel[i].isUtelPhone());
            }
        });
    });

    describe('#isInterTelecom', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < interTelecom.length; i++) {
                assert.isTrue(interTelecom[i].isInterTelecom());
            }
        });
    });

    describe('#isVeltonTelecom', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < veltonTelecom.length; i++) {
                assert.isTrue(veltonTelecom[i].isVeltonTelecom());
            }
        });
    });

    describe('#isGoldenTelecom', function () {
        var i = 0;

        it('correct values', function () {
            for (i; i < goldenTelecom.length; i++) {
                assert.isTrue(goldenTelecom[i].isGoldenTelecom());
            }
        });
    });

    describe('#getPhonePrefix', function () {
        it('correct values', function () {
            assert.strictEqual(life[0].getPhonePrefix(), '+38063');
            assert.strictEqual(interTelecom[0].getPhonePrefix(), '+38045');
            assert.strictEqual(towns[0].getPhonePrefix(), '');
        });
    });

    describe('#isFullFormat', function () {
        it('correct values', function () {
            assert.isTrue(life[0].isFullFormat());
            assert.isTrue(interTelecom[0].isFullFormat());
            assert.isTrue(towns[0].isFullFormat());
        });

        it('incorrect values', function () {
            assert.isFalse(russian[0].isFullFormat());
        });
    });

    describe('#isFullFormatAll', function () {
        it('correct values', function () {
            assert.isTrue(life[1].isFullFormatAll());
            assert.isTrue(interTelecom[1].isFullFormatAll());
            assert.isTrue(towns[1].isFullFormatAll());
            assert.isTrue(russian[0].isFullFormatAll());
        });
    });

    describe('#isDefault', function () {
        it('correct values', function () {
            assert.isFalse(life[1].isDefault());
        });

        it('incorrect values', function () {
            assert.isTrue(new IPhone().isDefault());
            assert.isTrue(invalidPhones[1].isDefault());
        });
    });

    describe('#validate', function () {
        it('correct values', function () {
            assert.isTrue(life[1].validate());
            assert.isTrue(mts[1].validate());
        });

        it('incorrect values', function () {
            assert.isFalse(invalidPhones[0].validate());
            assert.isFalse(invalidPhones[1].validate());
        });
    });

    describe('#getPhoneNumber', function () {
        it('correct values', function () {
            assert.strictEqual(life[1].getPhoneNumber(), '2654514');
            assert.strictEqual(towns[1].getPhoneNumber(), '+380486318834');
        });
    });

    describe('#toShortFormat', function () {
        it('correct values', function () {
            assert.strictEqual(life[1].toShortFormat(), '0932654514');
            assert.strictEqual(towns[1].toShortFormat(), '0486318834');
        });
    });

    describe('#getPhoneOperator', function () {
        it('correct values', function () {
            assert.strictEqual(life[1].getPhoneOperator(), '093');
            assert.strictEqual(towns[1].getPhoneOperator(), '048');
        });
    });

    describe('#getOnlyNumber', function () {
        it('correct values', function () {
            assert.strictEqual(life[1].getOnlyNumber(), '380932654514');
            assert.strictEqual(towns[1].getOnlyNumber(), '380486318834');
        });
    });

    describe('#find', function () {
        it('correct values', function () {
            assert.isTrue(life[1].find('26545'), '26545');
            assert.isTrue(towns[1].find('8631'), '8631');
        });
    });

    describe('#toString', function () {
        it('correct values', function () {
            assert.isString(mts[1].toString());
            assert.strictEqual(life[1].toString(), '+380932654514');
            assert.strictEqual(towns[1].toString(), '+380486318834');
        });
    });

    describe('#getUkrPhoneOperator', function () {
        it('correct values', function () {
            assert.strictEqual(life[1].getUkrPhoneOperator(), 'life');
            assert.strictEqual(mts[0].getUkrPhoneOperator(), 'mts');
            assert.strictEqual(beeline[0].getUkrPhoneOperator(), 'beeline');
            assert.strictEqual(kyivStar[0].getUkrPhoneOperator(), 'kyivstar');
            assert.strictEqual(peopleNet[0].getUkrPhoneOperator(), 'peoplenet');
            assert.strictEqual(utel[0].getUkrPhoneOperator(), 'utel');
            assert.strictEqual(interTelecom[0].getUkrPhoneOperator(), 'intertelecom');
            assert.strictEqual(ukrTelecom[0].getUkrPhoneOperator(), 'ukrTelecom');
            assert.strictEqual(vegaTelecom[0].getUkrPhoneOperator(), 'vegaTelecom');
            assert.strictEqual(veltonTelecom[0].getUkrPhoneOperator(), 'veltonTelecom');
            assert.strictEqual(goldenTelecom[0].getUkrPhoneOperator(), 'goldenTelecom');
            assert.strictEqual(towns[1].getUkrPhoneOperator(), 'ukrainianTowns');
        });
    });

    describe('#toHtml', function () {
        it('correct values', function () {
            assert.strictEqual(life[1].toHtml(), '<span>+</span>38&nbsp;(093)&nbsp;<span>265&nbsp;</span><span>45&nbsp;</span><span>14</span>');
            assert.strictEqual(towns[1].toHtml('short'), '<span>0486318834</span>');
            assert.strictEqual(new IPhone().toHtml(), '<span></span>');
        });
    });

    describe('#is', function () {
        it('correct values', function () {
            assert.isTrue(life[0].is('+380632654514'));
            assert.isTrue(vegaTelecom[0].is('+380563711234'));
        });
    });
});