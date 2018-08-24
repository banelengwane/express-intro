module.exports = function CalculateSettingBill() {

  //rlet totalSettings = document.querySelector(".totalSettings");

  // create a variables that will keep track of all the settings
  var settingCall = 0;
  var settingSMS = 0;
  var settingWarning = 0;
  var settingCritical = 0;

  // create a variables that will keep track of all three totals.
  var settingCallTotal = 0;
  var settingSMSTotal = 0;
  var settingTotal = 0;

  //new total
  var newTotal = 0;

  let actionList = [];

  function updateCall(new_call) {
    settingCall = parseFloat(new_call);
  }
  function updateSMS(new_sms) {
    settingSMS = parseFloat(new_sms);
  }

  function updateWarning(new_warning) {
    settingWarning = parseFloat(new_warning);
  }

  function updateCritical(new_critical) {
    settingCritical = parseFloat(new_critical);
  }

  function settingEntry(entry) {
    let cost = 0;
    settingCall = Number(settingCall);
    settingSMS = Number(settingSMS);
    if (entry === "call") {
      cost = settingCall;
      settingCallTotal += settingCall;
    } else if (entry === "sms") {
      cost = settingSMS;
      settingSMSTotal += settingSMS;
    }

    actionList.push({
      type: entry,
      cost,
      timestamp: new Date()
    });
  }
  function getSettings() {
    return {
      settingCall,
      settingSMS,
      settingWarning,
      settingCritical
    }
  }
  function settingCriticalBill() {
    return settingCritical;
  }
  function settingWarningBill() {
    return settingWarning.toFixed(2);
  }

  function settingsCallBill() {
    return settingCallTotal.toFixed(2);
  }

  function settingSMSBill() {
    return settingSMSTotal.toFixed(2);
  }

  function settingsTotalBill() {
    settingTotal = settingCallTotal + settingSMSTotal;
    return settingTotal.toFixed(2);
  }

  function criticalLevelReached() {
    let total = grandTotal();
    return total >= settingCritical;
  }

  function warningLevelReached() {
    let total = grandTotal()
    return total >= settingWarning && total < settingCritical;
  }

  //Borrowed Code
  function actions() {
    return actionList;
  }

  function actionsFor(type) {
    const filteredActions = [];

    // loop through all the entries in the action list 
    for (let index = 0; index < actionList.length; index++) {
      const action = actionList[index];
      // check this is the type we are doing the total for 
      if (action.type === type) {
        // add the action to the list
        filteredActions.push(action);
      }
    }

    return filteredActions;

    // return actionList.filter((action) => action.type === type);
  }

  function getTotal(type) {
    let total = 0;
    // loop through all the entries in the action list 
    for (let index = 0; index < actionList.length; index++) {
      const action = actionList[index];
      // check this is the type we are doing the total for 
      if (action.type === type) {
        // if it is add the total to the list
        total += action.cost;
      }
    }
    return total;

    // the short way using reduce and arrow functions

    // return actionList.reduce((total, action) => { 
    //     let val = action.type === type ? action.cost : 0;
    //     return total + val;
    // }, 0);
  }

  function grandTotal() {
    return getTotal('sms') + getTotal('call');
  }

  function totals() {
    let smsTotal = getTotal('sms').toFixed(2);
    let callTotal = getTotal('call').toFixed(2);
    return {
      smsTotal,
      callTotal,
      grandTotal: grandTotal()
    }
  }

  function colorChange(){
    let total = grandTotal();

    if (total >= settingWarning && total < settingCritical){
      // adding the danger class will make the text red
      return 'warning';
    }else if (total >= settingCritical && total !== 0) {
      return 'danger';
    }else if (total < settingWarning) {
      return '';
    }
  }

  return {
    actions,
    actionsFor,
    grandTotal,
    totals,
    criticalLevelReached,
    warningLevelReached,
    updateCall,
    updateSMS,
    updateWarning,
    updateCritical: updateCritical,
    settingEntry: settingEntry,
    settingCriticalBill,
    settingWarningBill: settingWarningBill,
    callsTotal: settingsCallBill,
    smsTotal: settingSMSBill,
    total: settingsTotalBill,
    getSettings,
    getResult: function () {
      return {
        settingCall,
        settingSMS,
        settingCritical,
        settingWarning,
        settingCallTotal,
        settingSMSTotal,
        color: colorChange()
      };
    },
  };
}
