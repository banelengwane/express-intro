let assert = require('assert');
let CalculateSettingBill = require('../settingbill');

describe('the settingbill', function(){
    it('should return 3.40 as total, for one call and an sms' , function(){
        const settingbill = CalculateSettingBill();
        settingbill.updateCall(2.75);
        settingbill.updateSMS(0.65);
        settingbill.updateWarning(10);
        settingbill.updateCritical(20);

        settingbill.settingEntry('sms');
        settingbill.settingEntry('call');

        assert.equal(settingbill.totals().smsTotal, 0.65);
        assert.equal(settingbill.totals().callTotal, 2.75);
        assert.equal(settingbill.totals().grandTotal, 3.40);
      });
      
      it('should return notice when the warning level has been reached' , function(){
        const settingbill = CalculateSettingBill();
        settingbill.updateCall(3.00);
        settingbill.updateSMS(1.50);
        settingbill.updateWarning(10);
        settingbill.updateCritical(20);

        settingbill.settingEntry('sms');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');

        assert.equal(settingbill.totals().smsTotal, 1.50);
        assert.equal(settingbill.totals().callTotal, 9.00);
        assert.equal(settingbill.totals().grandTotal, 10.50);
        assert.equal(true, settingbill.warningLevelReached());
      });  

      it('should return notice when the critical level has been reached' , function(){
        const settingbill = CalculateSettingBill();
        settingbill.updateCall(4.00);
        settingbill.updateSMS(2.50);
        settingbill.updateWarning(10);
        settingbill.updateCritical(20);

        settingbill.settingEntry('sms');
        settingbill.settingEntry('sms');
        settingbill.settingEntry('sms');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');

        assert.equal(settingbill.totals().smsTotal, 7.50);
        assert.equal(settingbill.totals().callTotal, 16.00);
        assert.equal(settingbill.totals().grandTotal, 23.50);
        assert.equal(true, settingbill.criticalLevelReached());
      }); 

      it('should return notice other strings and not count' , function(){
        const settingbill = CalculateSettingBill();
        settingbill.updateCall(4.00);
        settingbill.updateSMS(2.50);
        settingbill.updateWarning(10);
        settingbill.updateCritical(20);

        settingbill.settingEntry('sms');
        settingbill.settingEntry('sms');
        settingbill.settingEntry('sms');
        settingbill.settingEntry('call');
        settingbill.settingEntry('banele');
        settingbill.settingEntry('1000');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');
        settingbill.settingEntry('call');

        assert.equal(settingbill.totals().smsTotal, 7.50);
        assert.equal(settingbill.totals().callTotal, 16.00);
        assert.equal(settingbill.totals().grandTotal, 23.50);
        assert.equal(true, settingbill.criticalLevelReached());
      }); 
});