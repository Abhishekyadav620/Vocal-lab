$(document).ready(function () {

    eel.expose(DisplayMessage);
    function DisplayMessage(message) {
        $(".siri-message li:first").text(message);
        $('.siri-message').textillate('start');
    }

    eel.expose(showThinking);
    function showThinking() {
        $(".siri-message li:first").html('<span class="thinking-text"><i class="bi bi-cpu-fill me-2"></i>THINKING...</span>');
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
            var row = document.createElement('div');
            row.className = 'row justify-content-end mb-3';
            var ws = document.createElement('div');
            ws.className = 'width-size';
            var msg = document.createElement('div');
            msg.className = 'sender_message';
            msg.textContent = message;
            ws.appendChild(msg);
            row.appendChild(ws);
            chatBox.appendChild(row);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    eel.expose(receiverText);
    function receiverText(message) {
        var chatBox = document.getElementById("chat-canvas-body");
        if (message.trim() !== "") {
            var row = document.createElement('div');
            row.className = 'row justify-content-start mb-3';
            var ws = document.createElement('div');
            ws.className = 'width-size';
            var msg = document.createElement('div');
            msg.className = 'receiver_message';
            msg.textContent = message;
            ws.appendChild(msg);
            row.appendChild(ws);
            chatBox.appendChild(row);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    eel.expose(hideLoader);
    function hideLoader() {}

    eel.expose(hideStart);
    function hideStart() {
        var main = document.getElementById('JarvisMain');
        if (main && main.hasAttribute('hidden')) main.removeAttribute('hidden');
        var boot = document.getElementById('BootScreen');
        if (boot) boot.remove();
        var cb = document.getElementById('chatbox');
        if (cb) cb.focus();
    }
});