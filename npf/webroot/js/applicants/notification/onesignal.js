/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    if (typeof jsVars.pushNotification['api_id'] != 'undefined') {
        var OneSignal = window.OneSignal || [];
        OneSignal.push(function () {
            OneSignal.init({
                appId: jsVars.pushNotification['api_id'],
                autoRegister: true,
                notifyButton: {
                    enable: true,
                },
            });
        });
    }
});