$(document).ready(function () {

    eel.expose(DisplayMessage);
    function DisplayMessage(message) {
        $(".siri-message li:first").text(message);
        $('.siri-message').textillate('start');
    }

    eel.expose(ShowHood);
    function ShowHood() {
        $("#SuitSection").removeClass("dim");
        $("#SiriWave").attr("hidden", true);
        $("#MicBtn").removeClass("active");
    }

    eel.expose(senderText);
    function senderText(message) {
        var chatBox = document.getElementById("chat-canvas-body");
        if (message.trim() !== "") {
            chatBox.innerHTML += '<div class="row justify-content-end mb-3"><div class="width-size"><div class="sender_message">' + message + '</div></div></div>';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    eel.expose(receiverText);
    function receiverText(message) {
        var chatBox = document.getElementById("chat-canvas-body");
        if (message.trim() !== "") {
            chatBox.innerHTML += '<div class="row justify-content-start mb-3"><div class="width-size"><div class="receiver_message">' + message + '</div></div></div>';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    eel.expose(hideLoader);
    function hideLoader() {}

    eel.expose(hideFaceAuth);
    function hideFaceAuth() {}

    eel.expose(hideFaceAuthSuccess);
    function hideFaceAuthSuccess() {}

    eel.expose(hideStart);
    function hideStart() {
        var main = document.getElementById('JarvisMain');
        if (main && main.hasAttribute('hidden')) main.removeAttribute('hidden');
    }
});