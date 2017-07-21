'use strict';

var xhr = false;
var sendChannel;
var sendButton = document.getElementById("sendButton");
    sendButton.onclick = sendData;
var closeConnectionBtn = $('#logoutVisitor');
var inviteNextUserBtn = $('#inviteNextUser');
var sendTextarea = document.getElementById("dataChannelSend");
var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var room = document.getElementById('roomId').value;
var user = document.getElementById('userId').value;
var username = document.getElementById('userName').value;
var duration = $('.callDuration');
var audioBtn = document.getElementById('audioBtn');
var videoBtn = document.getElementById('videoBtn');
var callToIn = document.getElementById('callToInterlocuter');
var isVisitor = document.getElementById('isVisitor');
var standId = $('.stand');
var audioORVideoEndCall = document.getElementById('endOfAudioORVideoConversation');
var TYPING_TIMER_LENGTH = 1000;
var typing = false;
var lastTypingTime;
var context;
var source;
var audio;
var analyser;
var isChannelReady;
var isInitiator;
var isStarted;
var localStream;
var pc;
var remoteStream;
var isVideoMuted = false;
var isAudioMuted = false;
var checkduration;
var mrSessionVisitorsTimer;
var userCounter = 0;
var roomObj;
var isVideoCall = false;
var isHasInviteNextVisitorBtn = false;
var scrollCounter = 1;
var videoIsAlreadyExists = false;
var caller = false;
var dontConfirmLeave = false;
var visitorRedirectToHome = false;
var TRANSLATIONS_ENABLED = true;
var ROLE_V = 'VISITOR';
var ROLE_M = 'MANAGER';
var COUNT_DOWN_TIMER_REITERATION = 10;
var reconnectionTime = COUNT_DOWN_TIMER_REITERATION;
var COUNT_DOWN_TIMER_INTERVAL = 6000;
var countdownTimer;
var isReconnectProccess = false;
var isForceReconnect = false;
var isChannelDisconnected = false;
var isTimerExploiting = false;
var smallVideoOpen = false;
var bytesPrev;
var timestampPrev;
var speedTest;
var ishangUpEmitted = false;
var closeConnectionMessage = 'Соединение закрыто';
var waitingManagerTimeout;
var VIDEO_BTIRATE_LIMIT = 25;
var host      = false;
var reflexive = false;
var relay     = true;
var ICESTATENEW = 'new';
var ICESTATECHECKING = 'checking';
var ICESTATEDISCONECTED = 'disconnected';
var ICESTATEFAILED = 'failed';
var ICESTATECLOSED = 'closed';
var ICESTATECONNECTED = 'connected';
var ICESTATECOMPLETED = 'completed';
var iceConnectionStateTimer;
var connectionIsEstablished = false;
var isCurrentStatusChecking = false;
var checkingStatusTimeout = 20000;
var clearAfterErrorDelay = 5000;
var bitrateSum = 0;
var bitrateLoopIndex = 0;
var iceServers = [];



var pc_config = {
    iceServers: iceServers
};

var pc_constraints = {
    "optional": [
        {"DtlsSrtpKeyAgreement": true }
    ]
};

var sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
};

var constraints = {
    audio: true,
    video: true
};

function wireUpEvents() {

    var leaveMessage = '';

    function goodbye(e) {

        if (isChannelReady) {

            if(!isVisitor) {
                updateMeetingData();
            }

            if (!dontConfirmLeave) {

                if (!e) {
                    e = window.event;
                }

                e.cancelBubble = true;
                e.returnValue = leaveMessage;

                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                return leaveMessage;
            }
        }
    }

    window.onbeforeunload = function() {
        if(!ishangUpEmitted) {
            sendMessage('force disconnect');
        }
    };

    $(document).bind('keypress', function (e) {
        if (e.keyCode == 116) {
            dontConfirmLeave = false;
        }

        if (e.keyCode == 82) {
            dontConfirmLeave = false;
        }

    });

    $("a").bind("click", function () {
        dontConfirmLeave = false;
    });

    $("form").bind("submit", function () {
        dontConfirmLeave = false;
    });

    $("input[type=submit]").bind("click", function () {
        dontConfirmLeave = false;
    });
}

$(document).ready(function () {

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    wireUpEvents();
});

document.addEventListener('DOMContentLoaded', function () {

    if (window.AudioContext || window.webkitAudioContext) {
        initAudioInstance();
        initAudioAlertAnnouncement();
    }

    var slider = $("#volumeSlider"),
        tooltip = $('.tooltip'),
        volume = $('.volume');
    tooltip.hide();

    slider.slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: 0,
        start: function (event, ui) {
            tooltip.fadeIn('fast');
        },
        slide: function (event, ui) {
            var value = slider.slider('value');
            tooltip.css('left', value).text(value);
            handleVolumeImage(value);
            $("#remoteVideo").prop('volume', (value / 100));
        },
        change: function () {
            var value = slider.slider('value');
            tooltip.css('left', value).text(value);
            handleVolumeImage(value);
            $("#remoteVideo").prop('volume', (value / 100));
        },
        stop: function (event, ui) {
            tooltip.fadeOut('fast');
        }
    });

    function handleVolumeImage(value) {
        if (value <= 5) {
            volume.css('background-position', '0 0');
        } else if (value <= 25) {
            volume.css('background-position', '0 -25px');
        } else if (value <= 75) {
            volume.css('background-position', '0 -50px');
        } else {
            volume.css('background-position', '0 -75px');
        }
    }
});

if(typeof  socket != 'undefined'){
    initRoom();
}

function smallVideo() {
    if (isVideoCall) {
        smallVideoOpen = true;
        $('#remoteVideo').appendTo('#small_video');
        document.getElementById('remoteVideo').play();
        $(".video-controls").appendTo('#small_video');
        $('#small_video').css('z-index', '999999999');
    }
}

function bigVideo() {
    if (isVideoCall) {
        smallVideoOpen = false;
        $('#localVideo').appendTo('#videos');
        $('#remoteVideo').appendTo('#videos');
        $(".video-controls").insertAfter('.tv-container');
        document.getElementById('remoteVideo').play();
        document.getElementById('localVideo').play();
        $('#small_video').css('z-index', '1');
    }
}

function deleteCheckboxes() {
    if (window.localStorage.getItem('showcaseitem') != null || window.localStorage.getItem('showcaseitem') != undefined) {
        $('#jstree').jstree("select_node", window.localStorage.getItem('showcaseitem'));
        window.localStorage.removeItem('showcaseitem');
    }
}

function closeFailedConnection() {
    dontConfirmLeave = true;

    updateMeetingData();

    setTimeout(function(){
        isVisitor ? window.history.back() : window.location.reload();
    }, 3000);
}

function setSizeOfPopups() {

    var h;

    if(window.screen.width < 1600) {
        h = 560;
    } else {
        h = 814;
    }

    $(".fancybox-image").css({
        "width": 1236,
        "height": h
    });

    this.width = 1236;
    this.height = h;
}

$('.open_catalog').fancybox({
    beforeClose: function() {
        if($('#jstree').length) {
            window.localStorage.setItem('checkedItems', JSON.stringify($('#jstree').jstree('get_checked', true)));
        }
    },
    beforeShow: function(){

        if(window.localStorage.getItem('checkedItems') != undefined && window.localStorage.getItem('checkedItems') != null) {

            var checkedElements = JSON.parse(window.localStorage.getItem('checkedItems'));

            $.each(checkedElements, function(e, data) {
                $('#jstree').jstree("check_node", '#' + data.id);
            });

            window.localStorage.removeItem('checkedItems');
        }
    },
    afterShow: deleteCheckboxes,
    afterLoad: smallVideo,
    afterClose: bigVideo,
    live: false,
    fitToView: false,
    closeClick  : false,
    helpers     : {
        overlay : {closeClick: false}
    },
    ajax: {
        type: 'POST',
        cache: false,
        data: {
            room: room
        }
    }
});

$('.open_showcase').fancybox({
    beforeShow: setSizeOfPopups,
    afterLoad: smallVideo,
    afterClose: bigVideo,
    closeBtn: true,
    closeClick  : false,
    helpers     : {
        overlay : {closeClick: false}
    },
    ajax: {
        type: 'POST',
        cache: false,
        data: {
            room: room
        }
    },
    transitionIn: 'elastic',
    transitionOut: 'elastic',
    speedIn: 600,
    speedOut: 200,
    overlayShow: false,
    padding: '0px'
});

if ($('#popup-company-info').length) {
    $('#popup-company-info').fancybox({
        beforeShow: setSizeOfPopups,
        afterLoad: smallVideo,
        afterClose: bigVideo,
        closeBtn: true,
        ajax: {
            type: "POST",
            data: {
                room: room,
                type: 'info'
            }
        }
    });
}

if ($('#contacts').length) {
    $('#contacts').fancybox({
        closeBtn: true,
        padding: 0,
        autoSize: false,
        fitToView: false,
        beforeShow: setSizeOfPopups,
        afterLoad: smallVideo,
        afterClose: bigVideo,
        ajax: {
            type: "POST",
            data: {
                room: room,
                type: 'contact'
            }
        }
    });
}

$('.showcase-popup-open').attr('rel', 'showcase').fancybox({
    padding: 0,
    autoSize: false,
    fitToView: false,
    openEffect: 'elastic',
    closeEffect: 'elastic',
    transitionIn: 'elastic',
    transitionOut: 'elastic',
    prevEffect		: 'none',
    nextEffect		: 'none',
    beforeShow: function () {

        var alt = this.element.find('img').attr('alt');
        this.inner.find('img').attr('alt', alt);
        this.title = alt;
    },
    afterShow: function () {
        var wrap = $('.fancybox-wrap');
        var id = this.element.find('img').attr('id');
        setTimeout(function () {
            wrap.append('<div class="item-pop-up-outer"><a class="button-base green-light showcase-catalog-item-view" data-id="' + id + '">Посмотреть в каталоге</a></div>')
                .on('click', '.showcase-catalog-item-view', function () {
                    window.localStorage.setItem('showcaseitem', id);
                    $('.open_catalog').trigger('click');
                });
        }, 50);
    }
});

$('body').on('click', '.chat-showcase-item-catalog', function(e) {
    e.preventDefault();
    var chatShowcaseItemId = $(this).data('id');
    window.localStorage.setItem('showcaseitem', chatShowcaseItemId);
    $('.open_catalog').trigger('click');
});

if ($('#standDocument').length) {
    $('#standDocument').fancybox({
        closeBtn: true,
        beforeShow: setSizeOfPopups,
        afterLoad: smallVideo,
        afterClose: bigVideo,
        ajax: {
            type: "POST",
            data: {
                room: room,
                type: 'document'
            }
        }
    });
}

if (inviteNextUserBtn != null) {
    isHasInviteNextVisitorBtn = true;
}
if (typeof socket != 'undefined') {
    socket.on('created', function () {
        isInitiator = true;
    });

    socket.on('joinEmit', function (room) {
        isChannelReady = true;
        socket.emit('joinRoom', {roomId: room, user: user});
    });

    socket.on('joined', function () {
        isChannelReady = true;
    });

    socket.on('typing', function (username) {
        $('#typeUser').text(username);
        $('#type').removeClass('hidden');
    });

    socket.on('stop typing', function () {
        $('#typeUser').text('');
        $('#type').addClass('hidden');
    });

    socket.on('channel ready', function (room) {
        roomObj = room;
    });

    socket.on('log', function (array) {
        console.log.apply(console, array);
    });

    socket.on('get manager data', function (data) {
        $('.journal_id').attr('data-id', data.journal[0]);
        setPersonData(data.manager, data.dataExtra);
    });

    socket.on('close mj connection', function () {
        if (isVisitor != null && isVisitor.value) {
            dontConfirmLeave = true;
            if (visitorRedirectToHome) {
                window.location.href = '/';
            }
            // else {
                // setTimeout(function () {
                //     window.history.back();
                // }, 2000);
            // }
        }
    });

    socket.on('start conference', function () {

        resetToUserMediaCall();
        if (!videoIsAlreadyExists) {
            isInitiator = true;
            isStarted = true;
            var customConstr = getCustomAudioVideoConstaints();
            navigator.getUserMedia(customConstr, handleUserMedia, handleUserMediaError);
        } else {
            audioVideoTracks(true);
        }
    });

    socket.on('start reconnect data channel conference', function() {
        isChannelReady = true;
        isInitiator = false;
        isStarted = false;
        localStream = false;
        sendMessage('got user media');
    });

    socket.on('stop conference', function () {
        stopConference();
    });

    socket.on('continue conference', function() {
        enablesufficiendTools();
    });

    socket.on('show', function (data) {
        showItemToInterlocuter(data.item, data.user);
    });

    socket.on('forced closing connection', function () {
    });

    socket.on('visitor reject offer', function (rejectedRoomId) {
        $('.loader-mr-connection').css('display', 'none');
        inviteNextUserBtn.removeClass('not-active-anchor-link');

        if(rejectedRoomId == room) {
            notifyMe('Посетитель отказался от митинга');
        }
    });

    socket.on('notification', function (text) {
        notifyMe(text);
    });

    socket.on('accept visitor video call', function() {
        callToInterlocuter();
    });

    socket.on('message', function (data) {

        if(data.room == room) {
            if (data.message === 'got user media') {
                maybeStart();
            } else if (data.message.type === 'offer') {

                console.log('----------------offer----------------');

                if (!isInitiator && !isStarted) {

                    console.log('----------------offer- maybeStart---------------');

                    maybeStart();
                }

                console.log('------------offer remote description-------------------');
                console.log(data.message);
                console.log('------------offer remote description-------------------');

                pc.setRemoteDescription(new RTCSessionDescription(data.message));
                doAnswer();
            } else if (data.message.type === 'answer' && isStarted) {

                console.log('----------------answer----------------');

                if (!isVideoCall && !isReconnectProccess) {
                    createExhibitionMeeting();
                }

                console.log('------------offer remote description-------------------');
                console.log(data.message);
                console.log('------------offer remote description-------------------');

                pc.setRemoteDescription(new RTCSessionDescription(data.message));
            } else if (data.message.type === 'candidate') {

                console.log('----------------candidate----------------');

                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: data.message.label,
                    candidate: data.message.candidate
                });

                pc.addIceCandidate(candidate);
            } else if (data.message == 'disconnect') {
                disconnect();
            } else if(data.message == 'force disconnect') {
                isForceReconnect = true;
                disconnect();
            }
        }
    });

    var dfd = $.Deferred();

    dfd.done(function (link) {
        socket.emit('leaveRoomOwner', room);
        // sendReportToStandManager(room);
    }).done(function (link) {
        setTimeout(function() {
            window.location.href = link;
        }, 500);
    });
}

$('.leaveRoom').on('click', function (e) {
    e.preventDefault();

    if (isChannelReady) {
        $('#logoutVisitor').trigger('click');
    }

    dfd.resolve($(this).attr('href'));
});

$('body').on('click', '#busyRoom', function () {
    controlBtn('inviteNextUser', true);
    socket.emit('change tmp sm status', {status: 'busy', roomId: room});
    $(this).replaceWith("<button id='workRoom'>Online</button>");
});

$('body').on('click', '#workRoom', function () {
    controlBtn('inviteNextUser', false);
    socket.emit('change tmp sm status', {status: 'online', roomId: room});
    $(this).replaceWith("<button id='busyRoom'>Busy</button>");
});

function getCaret(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        el.focus();
        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }
        var re = el.createTextRange(), rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }
    return 0;
}

$('#dataChannelSend').keydown(function (event) {

    if (event.keyCode == 13) {
        var content = this.value;
        var caret = getCaret(this);
        if(event.shiftKey){
            this.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
            event.stopPropagation();
        } else {
            this.value = content.substring(0, caret) + content.substring(caret, content.length);
            event.preventDefault();
            if($(this).val().trim().length) {
                sendData();
            }
        }
    }

});

$('body').on('click', ".stand_catalog_item", function () {
    socket.emit('show', {room: room, item: $(this).attr('id'), user: user});
    $(".fancybox-close").trigger('click');
});

$('body').on('click', '#logoutV', function (e) {
    e.preventDefault();

    if (isChannelReady) {
        $('#logoutVisitor').trigger('click');
    }

    dfd.resolve($(this).attr('href'));
});

$('#dataChannelSend').on('input', function () {
    updateTyping();
});

$('body').on('click', '.site-logo', function (e) {
    e.preventDefault();

    if (isVisitor) {
        visitorRedirectToHome = true;
        hangup(closeConnectionMessage);
    }
});

$('body').on('click', '#enter-exit-fs', enterFullscreen);

$('body').on('click', '.start-call-container', function(e) {
    e.preventDefault();

    if(isChannelReady) {
        isVisitor ?
            callToManagerInterlocuter() :
            callToInterlocuter()
        ;
    }
});

function initRoom() {

    if (room !== '') {
        socket.emit('join', {id: user, username: username, room: room, role: ROLE_M, roomID: room, user: user});
    } else if (window.localStorage.getItem(user) != 'undefined' && window.localStorage.getItem(user) != null) {

        var data = JSON.parse(window.localStorage.getItem(user));

        if (data != null && data != 'undefined') {
            $('#roomId').val(data.room);
            $('#open_catalog').attr("href", data.route);
            room = $('#roomId').val();
            window.localStorage.removeItem(user);
            $('.loader-mr-connection').css('display', 'block');
            socket.emit('join', { id: user, username: username, room: room, role: ROLE_V, roomID: room, user: user });
        } else {
            closeConnectionBtn.disabled = false;
            closeConnectionBtn.onclick = visitorLogout;
        }

    } else {
        setTimeout(function () {

            dontConfirmLeave = true;
            window.history.back();

        }, 3000);
    }

    sendMessage('got user media');
}

function visitorLogout() {

    if (isVisitor != null && isVisitor.value) {

        setTimeout(function(){
            dontConfirmLeave = true;
            window.history.back();
        }, 3000);
    }
}

function updateTyping() {

    if (!typing) {
        typing = true;
        socket.emit('typing', {username: username, room: room});
    }
    lastTypingTime = (new Date()).getTime();

    setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
            socket.emit('stop typing', room);
            typing = false;
        }
    }, TYPING_TIMER_LENGTH);
}

function sendMessage(message) {
    socket.emit('message', {message: message, room: room});
}

function disconnect() {

    if(isForceReconnect) {
        if(isVisitor) { updateMeetingData(); }
        if(isVisitor && isChannelReady) {
            notifyMe('Менеджер разорвал соединение.')
        } else {
            notifyMe('Посетитель разорвал соединение.');
        }
    }

    ishangUpEmitted = true;
    clearPersonData();
    $('#dataChannelReceive').empty();
    $('#dataChannelSend').val('');
    socket.emit('delete inroom visitors', {room: room, redirect: true, delete: true});
    $('.loader-mr-connection').css('display', 'none');
    handleRemoteHangup();

}

function maybeStart() {

    console.log('+++++++maybeStart++=+++');
    console.log('!isStarted): ' + !isStarted);
    console.log('isChannelReady: ' + isChannelReady);
    console.log('!localStream: ' +  !localStream);
    console.log('++++++maybeStart+++=+++');

    if (!isStarted && isChannelReady && !localStream) {
        console.log('start channel condition');
        createDataChannel();
        makeCall();
    } else if (isStarted && isChannelReady && localStream) {
        createConnection();
        pc.addStream(localStream);
        makeCall();
    }
}

function makeCall() {
    isStarted = true;

    if (isInitiator) {
        doCall();
    }
}

function handleUserMedia(stream) {

    try {

        resetToUserMediaCall();

        isVideoCall = constraints.audio || constraints.video;
        localStream = stream;
        localVideo.srcObject = stream;
        $('#localVideo').css('display', 'block');
        sendMessage('got user media');

        if (caller) {
            socket.emit('conference', room);
        }

        if (isInitiator) {
            maybeStart();
        }
        enableUserMediaBtns();
    } catch (e) {
        console.log(e);
    }
}

function handleDataChannel() {

    console.log('----------------------------------------------');
    console.log('-------------handleDataChannel----------------');
    console.log('----------------------------------------------');

    socket.emit('reconnect data channel conference', room);

    isInitiator = true;
    isStarted = false;
    isChannelReady = true;
    localStream = false;

    maybeStart();
}

function handleAudioVideoStreamReconnect() {

    $("#remoteVideo").show();

    isInitiator = false;
    isStarted = true;
    caller = true;
    isChannelReady = true;
    localStream = false;
    var customConstr = getCustomAudioVideoConstaints();
    navigator.getUserMedia(customConstr, handleUserMedia, handleUserMediaError);
}


function handleUserMediaError(error) {

    console.log('---------handleUserMediaError-----');
    console.log(error);
    console.log('---------handleUserMediaError-----');

    var messageError = '';

    // Basic error messages that may occur

    //switch (error.name) {
    //    case 'DeviceNotFoundError':
    //        messageError = 'DeviceNotFoundError';
    //        break;
    //    case 'InternalError':
    //        messageError = 'InternalError';
    //        break;
    //    case 'PermissionDeniedError':
    //        messageError = 'PermissionDeniedError';
    //        break;
    //    default:
    //        messageError = 'default';
    //        break;
    //}

    alert(messageError);

}

function callToInterlocuter() {

    if(!DetectRTC.hasMicrophone && !DetectRTC.hasWebcam) {
        alert('')
    } else {

        $("#remoteVideo").show();

        if (!videoIsAlreadyExists) {
            isInitiator = false;
            isStarted = true;
            var customConstr = getCustomAudioVideoConstaints();
            navigator.getUserMedia(customConstr, handleUserMedia, handleUserMediaError);
            caller = true;
        } else {
            continueVideoAudioCall();
        }
    }
}

function getCustomAudioVideoConstaints() {

    var customAudioVideoConstraints = {};

    if(DetectRTC.hasMicrophone) {
        customAudioVideoConstraints.audio = true;
    }

    if(DetectRTC.hasWebcam) {
        customAudioVideoConstraints.video = true;
    }

    return customAudioVideoConstraints;
}

function continueVideoAudioCall() {
    enablesufficiendTools();
    socket.emit('continue conference', { room: room } );
}


function enablesufficiendTools() {

    audioVideoConferenctPannelAction(true);

    if ($('#audioBtn').hasClass('inactive')) {
        $('#audioBtn').removeClass('inactive');
    }

    if ($('#videoBtn').hasClass('inactive')) {
        $('#videoBtn').removeClass('inactive');
    }

    $("#volumeSlider").slider({ value: 60 });

    audioVideoTracks(true);
}

function audioVideoConferenctPannelAction(toShow) {
    if(toShow) {
        $('.video-controls.start-call-container').addClass('hidden');
        $('.video-controls.end-call-container').removeClass('hidden')
    } else {
        $('.video-controls.end-call-container').addClass('hidden');
        $('.video-controls.start-call-container').removeClass('hidden');
    }
}

function callToManagerInterlocuter() {

    console.log('--------------callToManagerInterlocuter----------------');
    socket.emit('visitor video call', {room: room});
}

function resetToUserMediaCall() {

    callToIn.disabled = true;
    audioORVideoEndCall.disabled = true;
}

function createConnection() {

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('create connection');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');

    try {
        pc = new RTCPeerConnection(pc_config, pc_constraints);
        pc.onicecandidate = handleIceCandidate;

    } catch (e) {
        // handlePeerConnectionError();
    }

    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;

    initVideoPanel();
    initDataChannel();
}

function initVideoPanel() {
    audioVideoConferenctPannelAction(true);
    $("#remoteVideo").show();
}

function handleRemoteStreamAdded(event) {

    remoteVideo.srcObject = event.stream;
    remoteStream = event.stream;
    setTimeout(function() { speedTest = setInterval(speedTestFunc, 5000); }, 1000);
}

function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
}

function createDataChannel() {

    console.log('in create createDataChannel');

    pc = null;

    if (pc == null || pc == undefined) {

        try {

            console.log('in create createDataChannel inner');

            pc = new RTCPeerConnection(pc_config);
            pc.onicecandidate = handleIceCandidate;

        } catch (e) {
            // handlePeerConnectionError();
        }
    } else {
        pc.onicecandidate = handleIceCandidate;
    }

    initDataChannel();

}

function handlePeerConnectionError() {

    try {
        var stun_server = "";

        if (pc_config.iceServers.length !== 0) {
            stun_server = pc_config.iceServers[0].url.replace('stun:', 'STUN ');
        }

        pc = new RTCPeerConnection(stun_server);
        pc.onicecandidate =  onIceCandidate00;

        console.log("Created webkitPeerConnnection00 with config \"" + stun_server + "\".");
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        return;
    }
}

function countdownTimerFunc() {

    console.log('--------------reconnectionTime--------------------');
    console.log(reconnectionTime);
    console.log('--------------reconnectionTime--------------------');

    reconnectionTime -= 1;

    console.log('pc in reconnectionWaitingTimer: ' + pc.iceConnectionState);

    if (
        pc.iceConnectionState === ICESTATENEW ||
        pc.iceConnectionState === ICESTATECHECKING||
        pc.iceConnectionState === ICESTATEDISCONECTED ||
        pc.iceConnectionState === ICESTATECLOSED ||
        pc.iceConnectionState === ICESTATEFAILED
    ) {

        isReconnectProccess = true;

        if (!isVisitor) {
            if (isVideoCall) {
                handleAudioVideoStreamReconnect();
            } else {
                handleDataChannel();
            }
        } else {
            sendMessage('got user media');
        }
    }

    if (
        pc.iceConnectionState === ICESTATECOMPLETED ||
        pc.iceConnectionState === ICESTATECONNECTED
    ) {
        isReconnectProccess = false;
        isTimerExploiting = false;
        $('.loader-mr-connection').css('display', 'none');
        clearInterval(countdownTimer);
        reconnectionTime = COUNT_DOWN_TIMER_REITERATION;
    }

    if (reconnectionTime <= 0) {
        clearInterval(countdownTimer);
        reconnectionTime = COUNT_DOWN_TIMER_REITERATION;

        isTimerExploiting = false;
        isChannelDisconnected = true;

        if (
            sendChannel &&
            (sendChannel.readyState != 'open'|| sendChannel.readyState === 'open') ||
            (pc.iceConnectionState === ICESTATEFAILED || pc.iceConnectionState === ICESTATEDISCONECTED)
        ) {
            $('.loader-mr-connection').css('display', 'none');
            handleRemoteHangup();
            if(isVisitor) {
                updateMeetingData();
                setTimeout(function(){
                    hangup('Не удалось восстановить связь. Проверьте соединение и попробуйте связаться с менеджером заново.');
                }, 3000);
            } else {
                hangup('Не удалось восстановить связь.');
            }
            isReconnectProccess = false;
        }
    }
}

function initDataChannel() {

    console.log('-------------------------isInitiator--------------------------');
    console.log(isInitiator);
    console.log('-------------------------isInitiator--------------------------');

    if (isInitiator) {

        try {

            console.log('-------------------------initDataChannel--------------------------');

            sendChannel = pc.createDataChannel("meetingRoomChannel_" + room, {reliable: false});
            sendChannel.onmessage = handleMessage;

        } catch (e) {
            console.log(e);
        }

        sendChannel.onopen = handleSendChannelStateChange;
        sendChannel.onerror = handleSendChannelError;
        sendChannel.onclose = handleDisableSendChannelStateChange;

    } else {
        pc.onicecandidate = handleIceCandidate;
        pc.ondatachannel = gotReceiveChannel;
    }

    pc.oniceconnectionstatechange = function(evt) {
        iceConnectionStateChangeHandler(evt)
    };
}

function iceConnectionStateChangeHandler (evt) {

    if(pc && pc.iceConnectionState != null) {
        console.log('+++++++++++++++++++++++++++++++++++++');
        console.log('pc.iceConnectionState: ' + pc.iceConnectionState);
        console.log('isForceReconnect:' + isForceReconnect);
        console.log('+++++++++++++++++++++++++++++++++++++');

        if(pc.iceConnectionState === ICESTATECHECKING) {
            isCurrentStatusChecking = true;
            if(!connectionIsEstablished && !isTimerExploiting) {
                setIceConnectionStateTimer();
            }
        }

        if(pc.iceConnectionState === ICESTATECONNECTED || pc.iceConnectionState === ICESTATECOMPLETED ) {
            isCurrentStatusChecking = false;
            connectionIsEstablished = true;
            if(connectionIsEstablished && !isTimerExploiting) {
                clearIceConnectionStateTimer();
            }
        }

        if(pc.iceConnectionState == ICESTATEDISCONECTED && !isForceReconnect) {

            console.log('+++++++++++++++++++++++++++++++++++++');
            console.log('pc.iceConnectionState: ' + 'in DISCONNECTED');
            console.log('ishangUpEmitted: ' + ishangUpEmitted);
            console.log('+++++++++++++++++++++++++++++++++++++');

            isChannelDisconnected = true;
            if(!ishangUpEmitted && isChannelReady) {
                isTimerExploiting = true;
            }

            clearInterval(durationInterval);
        }

        if(pc.iceConnectionState == ICESTATEFAILED) {
            if(!ishangUpEmitted && isChannelReady && !isCurrentStatusChecking) {
                isTimerExploiting = true;
            }
        }

        if(pc.iceConnectionState == ICESTATECLOSED) {
            if(isVisitor && isVideoCall) {
                handleDisableReceiveChannelStateChange();
            }
        }

        console.log('------------------------isTimerExploiting-------------------------');
        console.log('isTimerExploiting:' + isTimerExploiting);
        console.log('-------------------------isTimerExploiting------------------------');

        if(isTimerExploiting) {
            if(countdownTimer != undefined) {
                clearInterval(countdownTimer);
            }

            replaceReconnectText();

            if(!ishangUpEmitted) {
                countdownTimer = setInterval(countdownTimerFunc, COUNT_DOWN_TIMER_INTERVAL);
            }
        }
    }
}

function handleIceConnectionStateCheckingStatus() {
    notifyMe('');
    setTimeout(disconnect, clearAfterErrorDelay);
}

function setIceConnectionStateTimer() {
    iceConnectionStateTimer = setTimeout(handleIceConnectionStateCheckingStatus, checkingStatusTimeout);
}

function clearIceConnectionStateTimer() {
    clearTimeout(iceConnectionStateTimer);
}

function replaceReconnectText() {

    if($('.warning-btn').closest('.row').hasClass('hidden')) {
        $('.warning-btn').closest('.row').removeClass('hidden');
    }

    $('.loader-mr-connection').find('.connection-message').text($('#reconnectMsg').val());
    $('.loader-mr-connection').css('display', 'block');
}

function hideErrorMessage() {
    if(!$('.warning-btn').closest('.row').hasClass('hidden')) {
        $('.warning-btn').closest('.row').addClass('hidden');
    }

    $('.loader-mr-connection').find('.connection-message').text('Идет соединение');
}

function sendData() {

    var data = sendTextarea.value.trim();
    if (data != '' && data != undefined) {
        $("#dataChannelSend").val('');
        var message = $.emoticons.replace(data);
        var message_id = saveChatLog(data, 'own-message L');
        var object = {'text': message, 'id': message_id };
        sendChannel.send(JSON.stringify(object));
    }

    return false;
}


function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function getMsgDate() {

    var current, h, m, s;

        current =  new Date(),
        h = checkTime(current.getHours()),
        m = checkTime(current.getMinutes()),
        s = checkTime(current.getSeconds());

    return "["+h + ":" + m + ":" + s + "] ";
}

function messageTemplate(data, position, photo, original, id) {

    var template = "<div class='message-container  " + position + "'>";

    if (typeof id != 'undefined' && id != null) {
        template += "data-id='" + id + "'";
    }

    template += "<div class='mes-photo'>" +
        "<img style='width:34px; height: 34px;' src='" + photo + "'/>" +
        "</div>" +
        "<div class='chat-message'>" +
        "<div class='message-inner'>" + getMsgDate() + data.replace(/\r?\n/g, '<br/>'); + "</div>" +
    "</div>";

    if (typeof original != 'undefined' && original != null && original != data) {
        template = template + "<div class='message-original'>(" + original + ")</div>";
    }

    template = template + "</div>";

    return template
}

function gotReceiveChannel(event) {
    sendChannel = event.channel;
    sendChannel.onmessage = handleMessage;
    sendChannel.onopen = handleReceiveChannelStateChange;
    sendChannel.onclose = handleDisableReceiveChannelStateChange;
}

function handleMessage(event) {

    var imagePath = $('#image').attr('src');
    var obj = jQuery.parseJSON(event.data);
    var message_text = obj.text;
    var message_id = obj.id;

    if (TRANSLATIONS_ENABLED && $("#to_language").val() != "") {
        $.ajax({
            url: '/meeting-room/translate',
            method: 'POST',

            data: {
                to_translate: message_text,
                to_language: $("#to_language").val(),
                id: message_id

            },
            success: function (data) {
                $("#dataChannelReceive").append(messageTemplate($.emoticons.replace(data), 'their-message R', imagePath, message_text));
            },
            complete: function() {
                $("#chatTextAreas").scrollTop($("#chatTextAreas").prop('scrollHeight'));
            },
            fail: function (error) {
                alert("We are sorry, but translation isn't available. Please try later");
                $("#to_language").val('');
                $("#dataChannelReceive").append(messageTemplate($.emoticons.replace(message_text), 'their-message R', imagePath));
            }
        });
    } else {
        $("#dataChannelReceive").append(messageTemplate($.emoticons.replace(message_text), 'their-message R', imagePath));
    }

    $("#chatTextAreas").scrollTop($("#chatTextAreas").prop('scrollHeight'));

    if($("[name='switcher']").is(':checked')){
        playMessageNotification();
    }

    countUnReadMessageFromInterlocuter();
}

function countUnReadMessageFromInterlocuter() {
    if($('.chat-container').hasClass('chat-container-end')) {
        var currentAmount = parseInt($('.matched').text());
        currentAmount += 1;
        $('.matched').text(currentAmount);
    }
}

function handleSendChannelStateChange() {

    console.log('---------------handleSendChannelStateChange--------------------');
    console.log(sendChannel.readyState);
    console.log('----------------handleSendChannelStateChange-------------------');

    enableMessageInterface(sendChannel.readyState == "open");
}

function handleSendChannelError(error) {
    console.log('handleSendChannel error:' + error);
}

function handleReceiveChannelStateChange() {

    enableMessageInterface(sendChannel.readyState == "open");
}

function unblockScreen(isChannelOpen)
{
    if(isChannelOpen && !isVideoCall) {
        $('.loader-mr-connection').css('display', 'none');

        setTimeout(function(){
            if($('.chat-container').hasClass('chat-container-end')){
                $('.chat-container')
                    .removeClass('chat-container-end')
                    .addClass('chat-container-start')
                    .find('.chat-wrapper')
                    .removeClass('show-btn')
                    .addClass('show-btn-close')
                ;
            }

            if(!isVisitor) {
                if($('.comments-container').hasClass('comments-container-end')){
                    $('.comments-container')
                        .removeClass('comments-container-end')
                        .addClass('comments-container-start')
                        .find('.manipulate')
                        .removeClass('show-btn')
                        .addClass('show-btn-close')
                    ;
                }

                if (!$('#tabs li:first').hasClass('active')) {
                    $('a[href=#info]').tab('show');
                }
            }
        }, 1000);

        playConnectionAnnounce();
    }

    if(!isVisitor) {
        clearTimeout(waitingManagerTimeout);
    }

    if(!isVideoCall && isChannelReady) {
        notificationAlerts.baseNotif(document.getElementById('connectionSettledMsg').value);
        checkduration = setInterval(durationInterval, 1000);
        loadHistory(scrollCounter);
        $("#chatTextAreas").scrollTop($("#chatTextAreas").prop('scrollHeight'));
        setTimeout(function(){ $('.video-controls.start-call-container').show(); },2000);
    }
}

function handleDisableReceiveChannelStateChange() {

    console.log('----------------handleDisableReceiveChannelStateChange-----------------------');
    console.log('gggg connection is closed by some dude one');
    console.log('----------------handleDisableReceiveChannelStateChange-----------------------');

    console.log('--------------------ishangUpEmitted-----------------------');
    console.log(ishangUpEmitted);
    console.log('--------------------ishangUpEmitted-----------------------');

    //if(!DetectRTC.browser.isFirefox && !ishangUpEmitted && !isVisitor) {
    //    window.location.reload();
    //}
}

function handleClosingConnection(text) {

    disableMessageInterface(text);
    clearPersonData();
    $('#dataChannelReceive').empty();
    $('#dataChannelSend').val('');

    if (isVisitor) {
        window.history.back();
    }
}

function enableMessageInterface(shouldEnable) {

    dataChannelSend.disabled = shouldEnable ? false : true;

    if (isHasInviteNextVisitorBtn) {
        shouldEnable ? inviteNextUserBtn.addClass('not-active-anchor-link') :
            inviteNextUserBtn.removeClass('not-active-anchor-link');
    }

    if (!isVisitor) {
        shouldEnable ? closeConnectionBtn.removeClass('not-active-anchor-link') :
            closeConnectionBtn.addClass('not-active-anchor-link');
    }

    sendButton.disabled = shouldEnable ? false : true;

    if (!isVideoCall) {
        callToIn.disabled = shouldEnable ? false : true;
    } else {
        audioORVideoEndCall.disabled = shouldEnable ? false : true;
    }

    controlBtn('busyRoom', shouldEnable ? true : false);

    if (shouldEnable) {
        dataChannelSend.placeholder = "";
    }

    if (
        window.localStorage.getItem('itemToShow') != undefined &&
        window.localStorage.getItem('itemToShow') != null
    ) {
        var data = JSON.parse(window.localStorage.getItem('itemToShow'));
        socket.emit('show', {room: room, item: data.itemId, user: data.userId});
        window.localStorage.removeItem('itemToShow');
    }

    unblockScreen(shouldEnable);

}

function handleDisableSendChannelStateChange() {
    console.log('--------------------------------------------------------------');
    console.log('----------handleDisableSendChannelStateChange-----------------');
    console.log('gggg connection is closed by some dude');
    console.log('--------------------------------------------------------------');

    console.log('--------------------ishangUpEmitted-----------------------');
    console.log(ishangUpEmitted);
    console.log('--------------------ishangUpEmitted-----------------------');

    //if(!ishangUpEmitted && !isVisitor) {
    //    window.location.reload();
    //}

    // if(sendChannel.readyState != 'open') {
    //     isForceReconnect = true;
    // }
    //
    // if(isReconnectProccess) {
    //     if(isVisitor) { updateMeetingData(); }
    //     hangup('Проблемы соединение, попробуйте подключиться заново.');
    //     isReconnectProccess = false;
    // }
    //
    // if(isVisitor) {
    //     window.history.back();
    // }
}

function disableInterface() {

    var readyState = sendChannel.readyState;
    enableMessageInterface(readyState == "open");

}

function disableMessageInterface(text) {

    socket.emit('notification', {text: text, room: room});
    resetStatus();
    $('#dataChannelSend, #sendButton').attr('disabled', true);
    // $('#sendButton').attr('disabled', true);
    $('#remoteVideo').hide().removeAttr('src');
    // $('#remoteVideo').removeAttr('src');

}

function handleIceCandidate(event) {

    var ice = event.candidate;

    if(!ice) return;

    if (ice) {

        // if(host && ice.candidate.indexOf('tcp ') !== -1) {
        //     return false;
        // }
        //
        // if(reflexive && ice.candidate.indexOf('typ srflx ') == -1) {
        //     return false;
        // }
        //
        // if(relay && ice.candidate.indexOf('typ relay ') == -1) {
        //     return false;
        // }

        sendMessage({
            type: 'candidate',
            label: ice.sdpMLineIndex,
            id: ice.sdpMid,
            candidate: ice.candidate
        });
    }
}

function onIceCandidate00(candidate, moreToFollow) {
    if (candidate) {
        sendMessage(
            {
                type: 'candidate',
                label: candidate.label,
                candidate: candidate.toSdp()
            });
    }
    if (!moreToFollow) {
        console.log("End of candidates.");
    }
}

function doCall() {

    console.log('-----------------------doCall------------------------');

    if(DetectRTC.browser.isFirefox) {

        var constraints = {
            "mandatory": {
                "optional": {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true,
                    "mozDontOfferDataChannel": true
                }
            }
        };

        pc.createOffer(setLocalAndSendMessage, errorOfferSend, constraints);

    } else if(DetectRTC.browser.isChrome || DetectRTC.browser.isOpera) {

        if(DetectRTC.browser.isChrome) {
            if(DetectRTC.browser.version < 49) {
                pc.createOffer(setLocalAndSendMessage, errorOfferSend);
            } else {
                pc.createOffer(setLocalAndSendMessage, errorOfferSend, sdpConstraints);
            }
        } else {
            pc.createOffer(setLocalAndSendMessage, errorOfferSend, sdpConstraints);
        }

        // console.log('-----------chromeVersion----------------');
        // console.log(chromeVersion);
        // console.log('-----------chromeVersion----------------');
        //
        // if(chromeVersion > 49) {
        //
        //     console.log('=-++++++++++++++++++++++++++=');
        //     console.log(chromeVersion > 49);
        //     console.log('=-++++++++++++++++++++++++++=');
        //
        //     pc.createOffer(setLocalAndSendMessage, errorOfferSend);
        // } else {
        //
        //
        //     console.log('=-++++++++++++++++++++++++++=');
        //     console.log(chromeVersion < 49);
        //     console.log('=-++++++++++++++++++++++++++=');
        //
        //     pc.createOffer(setLocalAndSendMessage, errorOfferSend, sdpConstraints);
        // }
    } else {
        pc.createOffer(setLocalAndSendMessage, errorOfferSend, sdpConstraints);
    }

}

function doAnswer() {
    pc.createAnswer(setLocalAndSendMessage, getAnswerError, sdpConstraints);
}

function mergeConstraints(cons1, cons2) {

    var merged = cons1;
    for (var name in cons2.mandatory) {
        merged.mandatory[name] = cons2.mandatory[name];
    }

    // merged.optional.concat(cons2.optional);
    return merged;

}

function setLocalAndSendMessage(sessionDescription) {

    sessionDescription.sdp = preferOpus(sessionDescription.sdp);
    pc.setLocalDescription(sessionDescription);
    sendMessage(sessionDescription);

}

function enableUserMediaBtns() {

    audioVideoConferenctPannelAction(true);

    isAudioMuted = false;
    isVideoMuted = false;
    audioBtn.disabled = false;
    videoBtn.disabled = false;
    $("#volumeSlider").slider({value: 60});
}

function errorOfferSend(error) {
    console.log('Offer error: ', error);
}

function getAnswerError(error) {
    console.log('Answer error: ', error);
}

function hangup(text) {

    if(localStream) {
        $('#localVideo').css('display', 'none');
    }

    ishangUpEmitted = true;

    sendMessage('disconnect');

    disableMessageInterface(text);
    clearPersonData();
    $('#dataChannelReceive').empty();
    $('#dataChannelSend').val('');

    // if(sendChannel.readyState != 'open' && isVisitor) {
    //     window.history.back();
    // }

    // if(!isVisitor) {
    //     window.location.reload();
    // }

}

function handleRemoteHangup() {

    if(isVideoCall) {
        if(remoteStream != undefined && remoteStream.getTracks() != undefined && remoteStream.getTracks()[1] != undefined) {
            remoteStream.getTracks()[1].enabled = false;
        }
    }

    if (pc != null && typeof pc != undefined) {
        pc.close();
        pc = null;
    }

    resetStatus();
    closeDataChannels();

    ishangUpEmitted = true;

    // if(!isVisitor) {
    //     window.location.reload();
    // }

}

function resetStatus() {

    console.log('------------resetStatus-------------------');

    if(isVideoCall) {
        if(remoteStream != undefined && remoteStream.getTracks() != undefined && remoteStream.getTracks()[1] != undefined) {
            remoteStream.getTracks()[1].enabled = false;
        }
        $("#remoteVideo").hide();

        bitrateSum = 0;
        bitrateLoopIndex = 0;

        clearInterval(speedTest);
    }

    if (!isVisitor) {
        var videoTrack = findTraks('video');
        if (videoTrack != undefined) {
            videoTrack.enabled = false;
        }
    }

    clearInterval(countdownTimer);

    localStream = false;
    remoteStream = false;
    isStarted = false;
    isAudioMuted = false;
    isVideoMuted = false;
    isInitiator = false;
    isChannelReady = false;
    ishangUpEmitted = false;
    isForceReconnect = false;
    caller = false;
    isVideoCall = false;
    callToIn.disabled = true;
    audioORVideoEndCall.disabled = true;
    dontConfirmLeave = false;
    scrollCounter = 1;
    videoIsAlreadyExists = false;

    audioVideoConferenctPannelAction(false);

    if(!isVisitor) {
        inviteNextUserBtn.removeClass('not-active-anchor-link');
        closeConnectionBtn.addClass('not-active-anchor-link');
    }

    resetAudioVideoPanel();

    if (localVideo != null && localVideo.hasAttribute('src')) {
        localVideo.removeAttribute('src');
    }

    if (remoteVideo != null && remoteVideo.hasAttribute('src')) {
        remoteVideo.removeAttribute('src');
    }

    $('.video-controls.start-call-container').hide();

    hideErrorMessage();

    if(!ishangUpEmitted && isVisitor) {
        setTimeout(function() { window.history.back(); }, 3000);
    }
}

function resetAudioVideoPanel() {

    $("#volumeSlider").slider({value: 0});

    if ($('#audioBtn').hasClass('inactive')) {
        $('#audioBtn').removeClass('inactive');
    }

    if ($('#videoBtn').hasClass('inactive')) {
        $('#videoBtn').removeClass('inactive');
    }

    audioVideoConferenctPannelAction(false);
}

function nextUser() {

    if(typeof  socket == 'undefined'){
        return false;
    }

    socket.emit('delete inroom visitors', {room: room, redirect: false, delete: true});
    initRoom();

    if (room !== '') {
        if (userCounter > 0) {
            isAudioMuted = true;
            isVideoMuted = true;
            isInitiator = true;
            isForceReconnect = false;
        }
        userCounter++;
    }

    try {
        if (isInitiator) {
            maybeStart();
        }
    } catch (e) {
        console.log(e);
    }

    inviteNextVisitor();
}

function inviteNextVisitor() {

    inviteNextUserBtn.addClass('not-active-anchor-link');
    $('.loader-mr-connection').css('display', 'block');

    socket.emit('change tmp sm status', { status: 'busy', roomId: room });

    var nonAnswerPeriod = 90000;
    var stopIntervalPeriod = Math.floor(Math.random() * 10000) + 1000;
    var timeOutPeriod = parseInt(nonAnswerPeriod) + parseInt(stopIntervalPeriod);
    var nextUserId;

    setTimeout(function() {

        $.ajax({
            url: '/manager/meetingroom/next-visitor',
            data: {manager: user},
            method: 'POST',
            async: false,
            success: function(data) {
                if(!data.error) {

                    if (data.message && data.hasNextVisitor == undefined) {
                        socket.emit('change tmp sm status', { status: 'online', roomId: room });
                        $('.loader-mr-connection').css('display', 'none');
                        notificationAlerts.confirmNotificationError({'body': data.message });
                        inviteNextUserBtn.removeClass('not-active-anchor-link');
                    }

                    if(data.hasNextVisitor && data.message == undefined) {

                        nextUserId = data.userId;

                        if (data.itemToShow != undefined) {

                            var params = {
                                'itemId': data.itemToShow,
                                'userId': data.userId
                            };

                            window.localStorage.setItem('itemToShow', JSON.stringify(params));
                        }
                        socket.emit('invite user', data);
                    }

                    if(!data.hasNextVisitor && data.message == undefined) {
                        $('.loader-mr-connection').css('display', 'none');
                        notificationAlerts.confirmNotificationError({'body': data.noVisitorsNotification });
                        inviteNextUserBtn.removeClass('not-active-anchor-link');
                    }
                }
            }
        });
    }, stopIntervalPeriod);

    waitingManagerTimeout = setTimeout(function() {
        inviteNextUserBtn.removeClass('not-active-anchor-link');
        deleteUserFromMeetingRoomQueue({visitor: nextUserId, stand: $('.stand').val()});
        $('.loader-mr-connection').css('display', 'none');
    }, timeOutPeriod);
}

function closeDataChannels() {

    if (typeof sendChannel != 'undefined' && sendChannel != null) {
        sendChannel.close();
        enableMessageInterface();
    }

}

function preferOpus(sdp) {

    var sdpLines = sdp.split('\r\n');
    var mLineIndex;

    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
            mLineIndex = i;
            break;
        }
    }

    if (mLineIndex === null) {
        return sdp;
    }

    for (i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('opus/48000') !== -1) {
            var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
            if (opusPayload) {
                sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
            }
            break;
        }
    }

    // if (navigator.userAgent.indexOf("Firefox") > 0) {
    //     sdpLines = removeCN(sdpLines, mLineIndex)
    // }

    sdp = sdpLines.join('\r\n');

    return sdp;

}

function extractSdp(sdpLine, pattern) {

    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;

}

function setDefaultCodec(mLine, payload) {

    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
        if (index === 3) {
            newLine[index++] = payload;
        }
        if (elements[i] !== payload) {
            newLine[index++] = elements[i];
        }
    }
    return newLine.join(' ');

}

function removeCN(sdpLines, mLineIndex) {

    var mLineElements = sdpLines[mLineIndex].split(' ');

    for (var i = sdpLines.length - 1; i >= 0; i--) {
        var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
        if (payload) {
            var cnPos = mLineElements.indexOf(payload);
            if (cnPos !== -1) {
                mLineElements.splice(cnPos, 1);
            }
            sdpLines.splice(i, 1);
        }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;

}

function toggleVideoMute() {

    var videoTrack = findTraks('video');

    if (videoTrack == undefined || videoTrack.length === 0) {
        return;
    }

    if (isVideoMuted) {
        videoTrack.enabled = true;
        $('#videoBtn').removeClass('inactive');
    } else {
        videoTrack.enabled = false;
        $('#videoBtn').addClass('inactive');
    }

    isVideoMuted = !isVideoMuted;
}

function toggleAudioMute() {

    var audioTrack = findTraks('audio');

    if (audioTrack == undefined || audioTrack.length === 0) {
        return;
    }

    if (!isAudioMuted) {
        audioTrack.enabled = false;
        $('#audioBtn').addClass('inactive');
    } else {
        audioTrack.enabled = true;
        $('#audioBtn').removeClass('inactive');
    }

    isAudioMuted = !isAudioMuted;
}

function findTraks(type) {

    var track;

    if (localStream && localStream != undefined) {
        for (var i = 0; i < localStream.getTracks().length; i++) {
            if (localStream.getTracks()[i].kind == type) {
                track = localStream.getTracks()[i];
            }
        }
    }

    return track;
}

function createExhibitionMeeting() {

    if (!isVisitor) {
        var journalId = $('.journal_id');
        var data = {
            visitor: roomObj.visitor,
            room: roomObj.id
        };

        $.ajax({
            url: '/manager/meetingroom/meeting-start',
            method: 'POST',
            dataType: 'json',
            async: false,
            data: data,
            success: function (data) {
                if (!data.error && data.data) {
                    socket.emit('proccess manager data', {
                        manager: data.data.manager,
                        journal: data.data.journal,
                        room: room,
                        dataExtra: data.data.menu
                    });
                    journalId.each(function () {
                        $(this).attr('data-id', data.data.journal)
                    });
                    $('#info .chat-message-area').attr('id', 'area_' + data.data.journal);
                    $('#info .complaint').addClass('manager-meeting-complaint')
                        .attr('href', data.data.complaint);
                    $('#info .save-note').attr('id', data.data.journal);
                    setPersonData(data.data.visitor);
                }
            },
            complete: function() {
                socketManagerNamespace.emit('visitors in queue', $('.stand').val());
            },
            fail: function (error) {
            }
        });
    }
}

function updateMeetingData() {

    var journalId = $('.journal_id').eq(0).attr('data-id');
    var totalJournalOfTalks = $('#totalJournalOfTalks');
    var allJournals = $('#all_journals');

    $.post('/manager/meetingroom/update-meeting-journal', { journal: journalId }).done(function (data) {
        if (!data.error) {

            if (!$('#tabs li:last').hasClass('active')) {
                $('a[href=#journal]').tab('show');
            }

            if (allJournals.find('li').length) {
                allJournals.find('li:first').before(data.data);
            } else {
                allJournals.empty().append(data.data);
            }

            var journalaActionElement = $('#journal_' + journalId);
            if (journalaActionElement.length) {
                journalaActionElement.find('.action_selected').select2('val', data.selectedJournal);
            }

            var total = parseInt(totalJournalOfTalks.text());
            totalJournalOfTalks.text(total + 1);

            deleteUserFromMeetingRoomQueue({visitor: roomObj.visitor, stand: $('.stand').val()});

            $('.journal_id').attr('data-id', null);

            socket.emit('change tmp sm status', {status: 'online', roomId: room});
        }
    });
}

function setPersonData(data, dataExtra) {

    setTimeout(function() {}, 2000);

    $('#name').text(data.username == null ? '' : data.username);
    $('#email').text(data.email == null ? '' : data.email);

    hideEmptyPersonalData($('#phoneMain'), $('#phone'), data.phone);
    hideEmptyPersonalData($('#comPosMain'), $('#comPos'), data.comPos);

    if (data.photo != null && data.photo != undefined && data.photo != '') {
        $('#image').attr("src", data.photo + "?" + Math.random());
    }

    if (!isVisitor) {
        $('#info .action_create').select2().select2('val', $('#info .action_create option:eq(0)').val());
        $('#info .chat-message-area').val('');
    }

    if (dataExtra != undefined) {

        if (isVisitor != null && isVisitor.value) {
            $('#companyNameVMJ').find('strong').text(dataExtra.standName == null && dataExtra.standName != 'undefined'
                ? '' : dataExtra.standName);
            $('#exhibitionNameTitle').find('strong').text(dataExtra.exhibitionName == null && dataExtra.exhibitionName != 'undefined'
                ? '' : dataExtra.exhibitionName);
            $('#standOrderVMJ').text(dataExtra.exhibitionOrder == null ? '' : '#' + dataExtra.exhibitionOrder);
            $('#exhibitionDirectionVMJ').text(dataExtra.industry == null ? '' : dataExtra.industry);
            $('#companyLogoVMJ').attr('src', '/uploads/stand/' + dataExtra.companyLogo);
            $('.stand').val(dataExtra.stand);
        }
    }

    mrSessionVisitorsTimer = setInterval(initUpdateMeetingsParticipatorsSession, 170000);
}

function clearPersonData() {

    if ($('a[href="#info"]').length && !$('a[href="#info"]').hasClass('active')) {
        $('a[href="#info"]').tab('show');

        $('.save-note').trigger('click');

        if ($('#all_journals').length) {
            updateMeetingData();
        }
    }

    $('#manager-info').find('span:odd').each(function () {
        $(this).text('');
    });

    if (!isVisitor) {

        $('#info #image').attr('src', 'https://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image');
        $('#info .chat-message-area').attr('id', '').val('');
        $('#info .action_create').select2().select2('val', $('#info .action_create option:eq(0)').val());
        $('#info .manager-meeting-complaint').removeClass('manager-meeting-complaint').removeAttr('href');
        $('#info .save-note').attr('id', '');


        if($('.chat-container').hasClass('chat-container-start')) {
            $('.chat-container').removeClass('chat-container-start').addClass('chat-container-end');
            $('.chat-container').find('.chat-wrapper').removeClass('show-btn-close').addClass('show-btn');
            $('.chat-container').find('.circle').css('display', 'block');
        }
    }

    endMeasureDurationOfMeeting();
    clearParticipatorsTimer();

}

function hideEmptyPersonalData(selectorParent, selector, fieldValue) {

    if (fieldValue == null || fieldValue == "") {
        selectorParent.addClass('hidden');
    } else {
        if (selectorParent.hasClass('hidden')) {
            selectorParent.removeClass('hidden');
        }
        selector.text(fieldValue);
    }
}

function controlBtn(selector, status) {

    var element = document.getElementById(selector);

    if (element != null && element) {
        element.disabled = status;
    }
}

function sendReportToStandManager() {

    var data = {
        room: room
    };

    $.ajax({
        url: '/manager/meetingroom/date-report',
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function (data) {
            socketManagerNamespace.emit('changing managers on stand amount', $('.stand').val());
        }
    });
}

function saveChatLog(message, position) {

    if (xhr) {
        xhr.abort();
    }

    var message_id;
    var data = {};
    data.messenger = $('#userId').val();
    data.message = message;
    data.mettingJournal = $('.journal_id').eq(0).attr('data-id');

    xhr = $.ajax({
        url: '/meetingroom/save-chat-log',
        method: 'POST',
        data: data,
        async: false,
        success: function (data) {
            $("#dataChannelReceive").append(messageTemplate($.emoticons.replace(message), position, data.fileName));
            $('#chatTextAreas').scrollTop($('#chatTextAreas').prop('scrollHeight'));
            message_id = data.id;
            xhr = false;
        },
        fail: function (error) {
        }
    });

    return message_id;
}

function initAudioInstance() {
    audio = new Audio();
    context = new AudioContext();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    analyser = context.createAnalyser();
}

function initAudioAlertAnnouncement() {

    audio.src = '/bundles/featurebundlemeetingroom/sound/alert.ogg';
    audio.controls = false;
    audio.autoplay = true;
    document.body.appendChild(audio);
}

function playConnectionAnnounce()
{
    audio.src = '/bundles/featurebundlemeetingroom/sound/notification_connection.ogg';
    audio.play();
}

function playMessageNotification() {
    audio.src = '/bundles/featurebundlemeetingroom/sound/chat_notification.ogg';
    audio.play();
}

var durationInterval = function () {

    var myTime = duration.html();
    var ss = myTime.split(":");
    var dt = new Date();
    dt.setHours(ss[0]);
    dt.setMinutes(ss[1]);
    dt.setSeconds(ss[2]);

    var dt2 = new Date(dt.valueOf() + 1000);
    var temp = dt2.toTimeString().split(" ");
    var ts = temp[0].split(":");

    duration.html(ts[0] + ':' + ts[1] + ':' + ts[2]);

};

function endMeasureDurationOfMeeting() {

    duration.html('00:00:00');
    clearInterval(checkduration);
}

function showItemToInterlocuter(item, user) {

    var journalId = $('.journal_id').eq(0).attr('data-id');
    var userId = $('#userId').val();
    var data = {
        'catalog-item-id': item,
        'user': userId,
        'emitUser': user,
        'mj': journalId
    };

    $.ajax({
        url: '/meetingroom/show-stand-catalog-item',
        method: 'post',
        data: data,
        beforeSend: function (xhr) {
            if (journalId == '' || journalId == null || journalId == undefined) {
                xhr.abort();
            }
        },
        success: function (data) {
            if (!data.error) {
                $("#dataChannelReceive").append(data);
                $('#chatTextAreas').scrollTop($('#chatTextAreas').prop('scrollHeight'));
                countUnReadMessageFromInterlocuter();
            }
        },
        fail: function () {
        }
    });
}

$('#chatTextAreas').scroll(function () {

    if (isChannelReady && scrollCounter > 1) {
        getScrollerStartPoint();
    }
});

function getScrollerStartPoint() {

    var elem = $('#chatTextAreas');
    if (elem.scrollTop() == 0) {
        loadHistory(scrollCounter);
        scrollCounter++;
    }
}

$('#historyBtn').on('click', function () {

    loadHistory(scrollCounter);
    scrollCounter++;
});

function loadHistory(elementToSlice) {

    if (roomObj != undefined) {
        $.post('/meeting-room/load-history', {
            room: room,
            visitor: roomObj.visitor,
            counter: elementToSlice,
            journal_id: $('.journal_id').attr('data-id')
        }).done(function (data) {
            if (!data.error) {
                var element = $('#dataChannelReceive');
                if (element.find('div').length) {
                    var elementFirst = element.find('div').first();
                    elementFirst.before(converMsgLoadingHistory(data.data));
                } else {
                    element.append(converMsgLoadingHistory(data.data));
                }
                if (data.data != undefined) {
                    var divideTo = scrollCounter != 0 ? scrollCounter : 2;
                    var elementPosition = $('#chatTextAreas').prop('scrollHeight') / divideTo;
                    $('#chatTextAreas').scrollTop(elementPosition);
                }
            }
        });
    }
}

function converMsgLoadingHistory(data)
{

    var data = $.parseHTML(data);
    var containerElements = $(data).filter('.message-container');

    $.each(containerElements, function(i, el ) {
        var messageInnerSel = $(containerElements[i]).find('.message-inner');
        messageInnerSel.html($.emoticons.replace(messageInnerSel.text()));
        if($(containerElements[i]).find('.message-original').length) {
            var messageTransSel = $(containerElements[i]).find('.message-original');
            messageTransSel.html($.emoticons.replace(messageTransSel.text()));
        }
    });

    return data;
}

function endOfAudioORVideoConversation() {
    stopConference();
    socket.emit('stop conference', {room: room});
}

function stopConference() {
    videoIsAlreadyExists = true;
    callToIn.disabled = false;
    audioVideoConferenctPannelAction(false);
    audioVideoTracks(false);
}

function audioVideoTracks(status) {

    var sliderDefValue = 0;

    if (status) {
        audioBtn.disabled = false;
        videoBtn.disabled = false;
        audioORVideoEndCall.disabled = false;
        sliderDefValue += 60;
    }

    var streams = [localStream, remoteStream];

    for (var j = 0; j < streams.length; j++) {
        for (var i = 0; i < 2; i++) {
            if(streams[j] != undefined && streams[j].getTracks() != undefined && streams[j].getTracks()[i] != undefined) {
                streams[j].getTracks()[i].enabled = status;
            }
        }
    }

    $("#volumeSlider").slider({value: sliderDefValue});
}

function deleteUserFromMeetingRoomQueue(data) {

    $.ajax({
        url: "/meeting-room/queue-delete-visitor",
        method: 'POST',
        data: data,
        success: function () {
            xhr = false;
            socketManagerNamespace.emit('visitors in queue', data.stand);
        },
        fail: function () {
        }
    });
}

document.cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen || document.exitFullscreen;

function enterFullscreen() {
    if (remoteVideo.webkitRequestFullscreen) {
        remoteVideo.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else {
        if (remoteVideo.mozRequestFullScreen) {
            remoteVideo.mozRequestFullScreen();
        } else {
            remoteVideo.requestFullscreen();
        }
    }
}

function initUpdateMeetingsParticipatorsSession() {
    $.post("/meeting-room/update/participators-session", {user: $('#userId').val()}).done(function(responseData) {});
}

function clearParticipatorsTimer() {
    clearInterval(mrSessionVisitorsTimer);
}

function exitFullscreen() {
    document.cancelFullScreen();
}

function ProcessFullScreen() {

    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    if (event == 'FullscreenOn') {

        document.getElementById('enter-exit-fs').onclick = exitFullscreen;
        $(".video-controls").appendTo($('body')).addClass('video-controls-fullscreen');
        $("#localVideo").appendTo($('body'));
        $('body').find("#localVideo").addClass('full').css('z-index', '9999999999');
        document.getElementById('localVideo').play();

    } else {

        document.getElementById('enter-exit-fs').onclick = enterFullscreen;

        if (smallVideoOpen == false) {
            $('.tv-container').after($('.video-controls'));
        } else {
            $(".video-controls").insertAfter('#remoteVideo');
        }

        $('.video-controls').removeClass('video-controls-fullscreen');
        $("#localVideo").removeClass('full').css('z-index', '1');
        if(!smallVideoOpen) {
            $('#remoteVideo').before($("#localVideo"));
        }
        document.getElementById('localVideo').play();
    }
}

$('.video-controls').hover(function () {
    $(this).addClass('show-controls')
}, function () {
    $(this).removeClass('show-controls');
});

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', ProcessFullScreen, false);
    document.addEventListener('mozfullscreenchange', ProcessFullScreen, false);
    document.addEventListener('fullscreenchange', ProcessFullScreen, false);
    document.addEventListener('MSFullscreenChange', ProcessFullScreen, false);
}

var isConnectionProblem = false;
var isConnectionOk = true;

var switchOfVideoConference = function() {

    if(isConnectionOk) {
        isConnectionProblem = true;
        isConnectionOk = false;
        if(remoteStream != undefined && remoteStream.getTracks() != undefined && remoteStream.getTracks()[1]) {
            remoteStream.getTracks()[1].enabled = false;
        }
        notifyMe($('#videoProblemsMsg').val());
    }
};

var switchOnVideoConference = function() {

    if(isConnectionProblem) {
        isConnectionProblem = false;
        isConnectionOk = true;
        if(remoteStream != undefined && remoteStream.getTracks() != undefined && remoteStream.getTracks()[1] != undefined) {
            remoteStream.getTracks()[1].enabled = true;
        }
        notifyMe($('#videoOkMsg').val());
    }
};

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var speedTestFunc  = function () {
    if (pc && pc.getRemoteStreams()[0]) {
        pc.getStats(null, function(results) {
            Object.keys(results).forEach(function(result) {
                var report = results[result];
                var now = report.timestamp;
                var bitrate;
                if (report.type === 'inboundrtp' && report.mediaType === 'video') {
                    bitrate = Math.floor(report.bitrateMean / 1024);
                } else if (report.type === 'ssrc' && report.bytesReceived &&
                    report.googFrameHeightReceived) {
                    var bytes = report.bytesReceived;
                    if (timestampPrev) {
                        bitrate = 8 * (bytes - bytesPrev) / (now - timestampPrev);
                        bitrate = Math.floor(bitrate);
                    }
                    bytesPrev = bytes;
                    timestampPrev = now;
                }
                if (bitrate) {
                    bitrateSum += bitrate;

                    if(bitrateLoopIndex % 5 === 0 ) {

                        var bitrateAvg = bitrateSum / 5;

                        if(bitrateAvg < VIDEO_BTIRATE_LIMIT) {
                            isConnectionProblem = true;
                            bitrateSum = 0;
                            switchOfVideoConference();
                        } else {
                            isConnectionOk = true;
                            bitrateSum = 0;
                            switchOnVideoConference();
                        }
                    }
                }
            });
        }, function(err) {
            console.log(err);
        });
    }
};
