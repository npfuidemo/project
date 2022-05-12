$(function () {
    var $chatWindow = $('#messages');
    var chatClient; // Our interface to the Chat service    
    var generalChannel; // A handle to the "general" chat channel - the one and only channel we will have
    var channelUniqueName = makeChannelName(10);
    var chatChaining = {};
    var lastMessageRecivedAt    = 0;
    var wehookLinkedWithChannel = false;
    var intervalIdleUserMessage1   = '';
    var intervalIdleUserMessage2   = '';
    var intervalIdleUserMessage3   = '';
    var intervalSessionEnd          = '';
    var intervalReStartChatBot =     '';
    var lastEventRecivedAt    = 0;
    var ignoreBotMessage    = false;
    var sessionEnded    = false;
    var freeTextDisabledBySessionOut    = false;

    function stripHTML(str){
        var strippedText = $("<div/>").html(str).text();
        return strippedText;
    }
    
    function sendFreeTextMessage(){
//        var message = $.trim($("#npfMsg-in").val());
        var message = stripHTML($.trim($("#npfMsg-in").val()));
        if(message!==''){
            $("#npfMsg-in").val('');
            printMessage("User", message);
            generalChannel.sendMessage(message);
        }
    }
    
    var initializeDefaultMessage = JSON.parse(jsVars.chatbotInitiateMessage);
    var chatbotInitiateMessageIndex = 0;
    // code for back-end preview mode
    if (jsVars.chatbotEnvironment == "preview") {
        $(document).on("click", "button.ac-pushButton", function (event) {
            printMessage(jsVars.chatbotIdentity, $(this).text());
            printMessage('system', "This is dummy bot response.");
            $("#__npfmessageWindow").find("button.ac-pushButton").attr("disabled", true);
        });
        $chatWindow.empty();
        $.each(initializeDefaultMessage, function (key, message) {
            printMessage("System", message);
        });
    }else{    // code for front-end actual chatbot
        // Initialize the Chat client
        $(document).on("click", "#sendClickBtn", function (event) {
            sendFreeTextMessage();
        });
        
        $("#npfMsg-in").on('keydown', function (e) {
            if (e.keyCode == 13) {
                sendFreeTextMessage();
            }
        });
        
        $(document).on("click", "button.ac-pushButton,a.ac-pushButton", function (event) {
            if (!$(this).hasClass('registrationButton')) {
//                if($("#npfmessage-input").is(":visible")==false){
                    var userMessage = $(this).text();
                    var botMessage  = $(this).text();
                    if(typeof $(this).data("botmessage") !=="undefined" && $(this).data("botmessage") !==""){
                        botMessage  = $(this).data("botmessage");
                    }
                    generalChannel.sendMessage(botMessage);
                    printMessage("User", userMessage);
//                }
            } else {

                var thisEvent = $("form[name='studentRequestForm']");
                var checkValidation = checkValidationRules(thisEvent[0]);

                if (checkValidation === false) {
                    var fieldName = fieldValue = '';
                    event.preventDefault();

                    var fieldNameObject = {
                        'action': 'register',
                        'campaignInfo': $("#campaignInfo").val(),
                        'npfUrl': $("#npfUrl").val(),
                        'referrerUrl': $("#referrerUrl").val(),
                        'chatBotID': jsVars.chatbotId,
                        'collegeID': jsVars.collegeId,
                        'collegeSecret': jsVars.collegeSecret
                    };
                    for (var i = 0; i < thisEvent[0].length; i++) {
                        fieldName = thisEvent[0].elements[i].name;
                        fieldValue = thisEvent[0].elements[i].value;
                        if(fieldName !== '' && fieldValue !== '') {
                            fieldNameObject[fieldName] = thisEvent[0].elements[i].value;
                        }
                    }

                    selectedOption = JSON.stringify(fieldNameObject);
                    $("form[name='studentRequestForm'] input").removeClass("formError");
                    $(this).prop('disabled', true);
                    $("form[name='studentRequestForm'] input").prop('disabled', true);
                }
            }
            $("#__npfmessageWindow").find("button.ac-pushButton").attr("disabled", true);
        });
    
        $(document).on("click", "#email_otp_verify", function (event) {
            var emailOTP   = $.trim($("#email_otp").val());
            if(emailOTP!==""){
                $(this).parents("div.__npfchatmsg_left").remove();
                printMessage("User", emailOTP);
                generalChannel.sendMessage('verify_email_otp :'+emailOTP);
            }
        });

        $(document).on("click", "#email_otp_resend", function (event) {
            $(this).parents("div.__npfchatmsg_left").remove();
            printMessage("User", "Resend OTP");
            generalChannel.sendMessage('email_otp_resend');
        });

        $(document).on("click", "#otp_email_change", function (event) {
            $(this).parents("div.__npfchatmsg_left").remove();
            printMessage("User", "Change Email");
            generalChannel.sendMessage('collect_email');
        });

        $(document).on("click", "#mobile_otp_verify", function (event) {
            var mobileOTP   = $.trim($("#mobile_otp").val());
            if(mobileOTP!==""){
                $(this).parents("div.__npfchatmsg_left").remove();
                printMessage("User", mobileOTP);
                generalChannel.sendMessage('verify_mobile_otp :'+mobileOTP);
            }
        });

        $(document).on("click", "#mobile_otp_resend", function (event) {
            printMessage("User", "Resend OTP");
            generalChannel.sendMessage('mobile_otp_resend');
        });

        $(document).on("click", "#otp_mobile_change", function (event) {
            $(this).parents("div.__npfchatmsg_left").remove();
            printMessage("User", "Change Mobile");
            generalChannel.sendMessage('collect_mobile');
        });
        
        $(document).on("click", "button.start-new-chat", function (event) {
            if(freeTextDisabledBySessionOut){
                $("#npfmessage-input").show();
            }
            if($("#npfmessage-input").is(":visible")){
                $chatWindow.empty();
                printMessage("system", "");
                ignoreBotMessage=true;
                generalChannel.sendMessage('ignore_collect_flow');
                intervalReStartChatBot = setInterval(function() {
                    if($("#npfmessage-input").is(":visible")){
                        generalChannel.sendMessage('ignore_collect_flow');
                    }else{
                            var intervalReStartChatBot1 = setInterval(function() {
                                $chatWindow.empty();
                                reStartChat();
                                clearInterval(intervalReStartChatBot1);
                            }, 3000);
                        clearInterval(intervalReStartChatBot);
                    }
                }, 1200);
            }else{
                $("#npfmessage-input").fadeOut();
                lastMessageRecivedAt    = 0;
                $chatWindow.empty();
                if(typeof initializeDefaultMessage[0]!=="undefined" ){
                    chatbotInitiateMessageIndex = 0;
                    while(typeof initializeDefaultMessage[chatbotInitiateMessageIndex]!=="undefined" ){
                        printMessage("System", initializeDefaultMessage[chatbotInitiateMessageIndex++]);
                    }
                }
                intiateChatSession();
            }
        });
        
        window.addEventListener('message', event => {
            var currentTime = Math.floor(Date.now() / 1000);
            // either it should be firs event or the event sould be maintaingn 5 sec gap and chatbotmusql have been initialized
            if( lastEventRecivedAt==0 || (currentTime-lastEventRecivedAt > 5 && wehookLinkedWithChannel===true)){ 
                if(lastEventRecivedAt==0){
                    if(typeof initializeDefaultMessage[0]!=="undefined" ){
                        var intervalChatbotInitiateMessage = setInterval(function() {
                            if(typeof initializeDefaultMessage[chatbotInitiateMessageIndex]==="undefined" ){
                                clearInterval(intervalChatbotInitiateMessage);
                            }else{
                                if(chatbotInitiateMessageIndex==0){
                                    $chatWindow.empty();
                                }
                                printMessage("System", initializeDefaultMessage[chatbotInitiateMessageIndex++]);
                            }
                        }, 2000);
                    }
                    Twilio.Chat.Client.create(jsVars.npfChatToken).then(client => {
                        chatClient = client;
                        channelUniqueName = makeChannelName(10);
                        chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);
                        // Alert the user they have been assigned a random username
                    }).catch(error => {
                        console.error(error);
                    });
                }
                lastEventRecivedAt    = Math.floor(Date.now() / 1000);
                freeTextDisabledBySessionOut    = false;
                if(event.data=="startChat"){
                    if(sessionEnded==false){
                        startChat();
                    }
//                }else if(event.data=="clearChat"){
//                    endChat();
                }else if(event.data=="restartChat"){
                    if($("#npfmessage-input").is(":visible")){
                        $chatWindow.empty();
                        printMessage("system", "");
                        ignoreBotMessage=true;
                        generalChannel.sendMessage('ignore_collect_flow');
                        intervalReStartChatBot = setInterval(function() {
                            if($("#npfmessage-input").is(":visible")){
                                generalChannel.sendMessage('ignore_collect_flow');
                            }else{
                                    var intervalReStartChatBot1 = setInterval(function() {
                                        $chatWindow.empty();
                                        reStartChat();
                                        clearInterval(intervalReStartChatBot1);
                                    }, 3000);
                                clearInterval(intervalReStartChatBot);
                            }
                        }, 1200);
                    }else{
                        reStartChat();
                    }
                }
            }
        }); 
    }
    
    function startChat(){
        
        if( typeof intervalIdleUserMessage1==="number"){
            clearInterval(intervalIdleUserMessage1);
        }
        if( typeof intervalIdleUserMessage2==="number"){
            clearInterval(intervalIdleUserMessage2);
        }
        if( typeof intervalIdleUserMessage3==="number"){
            clearInterval(intervalIdleUserMessage3);
        }
        if( typeof intervalSessionEnd==="number"){
            clearInterval(intervalSessionEnd);
        }
        if( typeof intervalStartChatBot==="number"){
            clearInterval(intervalStartChatBot);
        }

        var intervalStartChatBot = setInterval(function() {
            if(wehookLinkedWithChannel===true ){
                if(lastMessageRecivedAt == 0 && sessionEnded==false){
                    if(typeof initializeDefaultMessage[0]==="undefined" ){
                        $chatWindow.empty();
                    }
                    setupChannel();
                }
                sessionEnded    = false;
                clearInterval(intervalStartChatBot);
            }
        }, 1000);
    }
    
    function endChat(){
        clearInterval(intervalIdleUserMessage1);
        clearInterval(intervalIdleUserMessage2);
        clearInterval(intervalIdleUserMessage3);
        clearInterval(intervalSessionEnd);
        wehookLinkedWithChannel = false;
        lastMessageRecivedAt    = 0;
//        removeChannel(generalChannel);
//        channelUniqueName = makeChannelName(10);
        $chatWindow.empty();
    }
    
    function reStartChat(){
        
        if( typeof intervalIdleUserMessage1==="number"){
            clearInterval(intervalIdleUserMessage1);
        }
        if( typeof intervalIdleUserMessage2==="number"){
            clearInterval(intervalIdleUserMessage2);
        }
        if( typeof intervalIdleUserMessage3==="number"){
            clearInterval(intervalIdleUserMessage3);
        }
        if( typeof intervalSessionEnd==="number"){
            clearInterval(intervalSessionEnd);
        }
//        saveChatTransaction("update");
        lastMessageRecivedAt    = 0;
        $chatWindow.empty();
        if(typeof initializeDefaultMessage[0]!=="undefined" ){
            chatbotInitiateMessageIndex = 0;
            while(typeof initializeDefaultMessage[chatbotInitiateMessageIndex]!=="undefined" ){
                printMessage("System", initializeDefaultMessage[chatbotInitiateMessageIndex++]);
            }
        }
        intiateChatSession();
    }

    function createOrJoinGeneralChannel() {
        chatClient.getChannelByUniqueName(channelUniqueName)
                .then(function (channel) {
                    generalChannel = channel;
                    //set webhook from channel id
                    setupWebhook(generalChannel.sid);
                }).catch(function () {
    // If it doesn't exist, let's create it
            chatClient.createChannel({
                uniqueName: channelUniqueName,
                friendlyName: channelUniqueName + ' Chat Channel'
            }).then(function (channel) {
                generalChannel = channel;
                setupWebhook(generalChannel);
            }).catch(function (channel) {
//                console.log('Channel could not be created:');
            });
        });
    }
    
    function setupWebhook(generalChannel) {
        $.ajax({
            url: jsVars.URL_CHATBOT_WIDGETS + '/setChatChannel?p=' + jsVars.js_dataW,
            type: 'post',
            data: {channel_sid: generalChannel.sid, requestType: "webhook"},
            success: function (responseData) {
                wehookLinkedWithChannel=true;
//                setupChannel();
                var responseJson = JSON.parse(responseData);
                chatChaining = {
                        "channel_sid": generalChannel.sid,
                        "webhook_sid": responseJson.webhook_sid,
                        "assistant_sid": jsVars.chatbotAssistantId
                    };
            },
            error: function (responseData, errorThrown) {
                console.log(errorThrown);
            }
        });
    }

    // Set up channel after it has been found
    function setupChannel() {
        // Join the general channel
//        console.log("joining channel");
        generalChannel.join().then(function (channel) {
            while(typeof initializeDefaultMessage[chatbotInitiateMessageIndex]!=="undefined"){
                // do nothing
            }
            intiateChatSession();
        });
        
        // Listen for new messages sent to the channel
        generalChannel.on('messageAdded', function (message) {
//            console.log(message.author+" = "+message.body);
            lastMessageRecivedAt    = Math.floor(Date.now() / 1000);
            manageChatTrail(message);
            if(message.author=="system"){
                if(message.body=="allow_free_text"){
                    $("#npfmessage-input").fadeIn();
                }else if(message.body=="disallow_free_text"){
                    $("#npfmessage-input").hide();
//                    if(ignoreBotMessage){
//                        if( typeof intervalReStartChatBot==="number"){
//                            clearInterval(intervalReStartChatBot);
//                        }
//                        reStartChat();
//                    }
                }else if(ignoreBotMessage){
                }else{
                    if( $("#__npfmessageWindow").find("button.ac-pushButton").length){
                        $("#__npfmessageWindow").find("button.ac-pushButton").removeAttr("disabled");
                    }
                    printMessage(message.author, message.body);
                }
            }
        });
    }
    
    function intiateChatSession(){
//        $chatWindow.empty();
        chatChaining["transcript"] = [];
        ignoreBotMessage=false;
        generalChannel.sendMessage("initiate");
        saveChatTransaction("create");
        lastMessageRecivedAt    = Math.floor(Date.now() / 1000);

        intervalIdleUserMessage1 = setInterval(function() {
            var currentTime = Math.floor(Date.now() / 1000);
            if(currentTime-lastMessageRecivedAt > 300){ // Idle for 5 minutes
                showIdleUserMessage1();
                clearInterval(intervalIdleUserMessage1);
            }
        }, 5000);

//        intervalIdleUserMessage2 = setInterval(function() {
//            var currentTime = Math.floor(Date.now() / 1000);
//            if(currentTime-lastMessageRecivedAt > 150){ // Idle for 2 minutes 30 seconds
//                clearInterval(intervalIdleUserMessage1);
//                showIdleUserMessage2();
//                clearInterval(intervalIdleUserMessage2);
//            }
//        }, 5000);

//        intervalIdleUserMessage3 = setInterval(function() {
//            var currentTime = Math.floor(Date.now() / 1000);
//            if(currentTime-lastMessageRecivedAt > 180){ // Idle for 3 minutes
//                showIdleUserMessage3();
//                clearInterval(intervalIdleUserMessage3);
//            }
//        }, 5000);
              
        intervalSessionEnd = setInterval(function() {
            var currentTime = Math.floor(Date.now() / 1000);
            if(currentTime-lastMessageRecivedAt > 420){ // Idle for 7 minutes
                $("#__npfmessageWindow").find("button.ac-pushButton").attr("disabled", true);
                lastMessageRecivedAt=0;
                clearInterval(intervalSessionEnd);
//                saveChatTransaction("update");
                if($("#npfmessage-input").is(":visible")){
                    freeTextDisabledBySessionOut    = true;
                    $("#npfmessage-input").hide();
                }
                showChatSessionEndMessage();
                sessionEnded    = true;
            }
        }, 5000);
    }
    
    function removeChannel(generalChannel){
        // Delete a previously created Channel
//        saveChatTransaction("update");
        generalChannel.delete().then(function(channel) {
        });
        chatChaining={};
    }

    function makeChannelName(length) {1
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Helper function to print chat message to the chat window
    function printMessage(fromUser, message) {
        $('.default-chatbot-indicator').show();
        var userClass = '__npfchatmsg_left animated slideInLeft delay-1s';
        var userImage = 'botIcon bgIcon';

        if (fromUser.toLowerCase() !== "system") {
            userClass = '__npfchatmsg_right animated slideInRight delay-1s';
            userImage = 'userIcon bgIcon';
        }else{
            fromUser    = jsVars.chatbotIdentity;
            if( message.indexOf("otpCard") > -1){
				$('.otpCard').parents('.__npfchatmsg_left').removeClass("slideInLeft delay-1s");
                userClass += " delay-2s otpCardDiv zoomIn";
            }
            if( message.indexOf("buttonCard") > -1 ){
				$('.buttonCard').parents('.__npfchatmsg_left').removeClass("slideInLeft delay-1s");
                userClass += " delay-2s buttonCardDiv zoomIn";
            }
			if( message.indexOf("npf-card") > -1 ){
				$('.npf-card').parents('.__npfchatmsg_left').removeClass("slideInLeft delay-1s");
                userClass += " delay-2s buttonCardDiv cardEnable zoomIn";
            }
			if( message.indexOf("owl-carousel") > -1 ){
				$('.owl-carousel').parents('.__npfchatmsg_left').removeClass("slideInLeft delay-1s");
                userClass += " delay-2s buttonCardDiv cardSliderEnable zoomIn";
            }
            if( message.indexOf("sessionButtonCard") > -1 ){
				$('.sessionButtonCard').parents('.__npfchatmsg_left').removeClass("slideInLeft delay-1s");
                userClass += " delay-2s sessionButtonCardDiv zoomIn";
            }
        }

        var messageHtml = '<div class="'+ userClass + '">' +
                '<div class="' + userImage + '"></div><div class="npfChat_loader"></div>' +
                '<div class="ac-container ac-adaptiveCard"><div class="ac-textBlock">' +
                '<p class="name">' + fromUser + '</p>' +
                '<div class="message">' + message + '</div>' +
				'<div class="chatLoader dataLoader"><div class="typing typing-1"></div><div class="typing typing-2"></div><div class="typing typing-3"></div></div>' +
                '</div>' +
                '</div>';

        $chatWindow.append(messageHtml);
        var scrollPosition = $chatWindow[0].scrollHeight;
        $('.chatBody').animate({scrollTop: scrollPosition}, 2000);
		
    }
    
    function showIdleUserMessage1(){
//        generalChannel.sendMessage("showIdleUserMessage1");
        printMessage("System", "Are you still there?");
    }
    
    function showIdleUserMessage2(){
//        generalChannel.sendMessage("showIdleUserMessage2");
        printMessage("System", "Wake up, sleepyhead!");
    }
    
    function showIdleUserMessage3(){
//        generalChannel.sendMessage("showIdleUserMessage3");
        printMessage("System", "Hellllllooooooooooo???");
    }
    
    function showChatSessionEndMessage(){
//        printMessage("System", "You chat session is ended");
        printMessage("System", "<div class='sessionButtonCard'><button aria-label='Start New Session' type='button' class='start-new-chat start-over-btn style-default'>Start Over</button>");
    }

    function checkValidationRules(thisEvents) {
        var isErrorFound = false;
        if (thisEvents.length > 0) {
            for (var i = 0; i < thisEvents.length; i++) {
                thisEvents.elements[i].classList.remove("formError");
                var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
                var numericRegex = /^([0-9]+)$/;
                var alphaNumericRegex = /^([a-zA-Z0-9 _-]+)$/;
                var mobileRegex = /^([0-9-+]+)$/;
                var alphabetRegex = /^([A-Za-z ]+)$/;
                var specialCharRegex = /^([A-Za-z0-9 !@#$%^&*()_+=?-]+)$/;
                var fieldValue = thisEvents.elements[i].value.trim();

                if (thisEvents.elements[i].classList.contains("required")) {
                    if (fieldValue == "" || fieldValue == null || typeof fieldValue === "undefined") {
                        thisEvents.elements[i].className += " formError";
                        isErrorFound = true;
                    }
                }

                if (thisEvents.elements[i].classList.contains("alphabets") && !alphabetRegex.test(fieldValue)) {
                    thisEvents.elements[i].className += " formError";
                    isErrorFound = true;
                }

                if (thisEvents.elements[i].classList.contains("alphanumeric") && !alphaNumericRegex.test(fieldValue)) {
                    thisEvents.elements[i].className += " formError";
                    isErrorFound = true;
                }

                if (thisEvents.elements[i].classList.contains("specialchar") && !specialCharRegex.test(fieldValue)) {
                    thisEvents.elements[i].className += " formError";
                    isErrorFound = true;
                }

                if (thisEvents.elements[i].classList.contains("numeric") && !numericRegex.test(fieldValue)) {
                    thisEvents.elements[i].className += " formError";
                    isErrorFound = true;
                }

                if (thisEvents.elements[i].classList.contains("phone") && !mobileRegex.test(fieldValue)) {
                    thisEvents.elements[i].className += " formError";
                    isErrorFound = true;
                }

                if (thisEvents.elements[i].classList.contains("email") && !emailRegex.test(fieldValue)) {
                    thisEvents.elements[i].className += " formError";
                    isErrorFound = true;
                }
            }
        }
        return isErrorFound;
    }

    /*
     * 
     * @param {type} message object
     * @returns create a global object of chat
     */
    function manageChatTrail(message) {

        var messageDetail = {
            "message_sid": message.state.sid,
            "author": message.state.author,
            "message": message.state.body,
            "timestamp": message.state.timestamp
        };

        //check or set index in array - start

        if (!chatChaining["transcript"])
            chatChaining["transcript"] = [];

        if (!chatChaining["transcript"][message.state.index])
            chatChaining["transcript"][message.state.index] = {};

        //check or set index in array - End        

        chatChaining["transcript"][message.state.index] = messageDetail;
    }
    
    function saveChatTransaction(transactionType) {
        chatChaining["transactionType"] = transactionType;
        chatChaining["userIdentity"] = jsVars.userIdentity;
        $.ajax({
            url: jsVars.URL_CHATBOT_WIDGETS + '/save-chatbot-transaction?q=' + jsVars.js_dataW,
            type: 'post',
            data: {"postData": chatChaining},
            success: function (responseData) {},
            error: function (responseData, errorThrown) {
                console.log(errorThrown);
            }
        });
    }
    
});