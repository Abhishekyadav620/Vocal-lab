$(document).ready(function () {
    eel.init();

    $('.text').textillate({
        loop: true, sync: true,
        in: { effect: "fadeInUp", sync: true },
        out: { effect: "fadeOutUp", sync: true }
    });

    var siriWave = new SiriWave({
        container: document.getElementById("siri-container"),
        width: 700, height: 180,
        style: "ios9", amplitude: "1", speed: "0.30", autostart: true
    });

    $('.siri-message').textillate({
        loop: true, sync: true,
        in: { effect: "fadeInUp", sync: true },
        out: { effect: "fadeOutUp", sync: true }
    });

    // Mic button
    $("#MicBtn").click(function () {
        eel.playAssistantSound();
        $("#SuitSection").addClass("dim");
        $("#SiriWave").attr("hidden", false);
        $(this).addClass("active");
        eel.allCommands();
    });

    // Hotkey Win+J
    $(document).on('keyup', function (e) {
        if (e.key === 'j' && e.metaKey) {
            eel.playAssistantSound();
            $("#SuitSection").addClass("dim");
            $("#SiriWave").attr("hidden", false);
            eel.allCommands();
        }
    });

    // Text command
    function PlayAssistant(message) {
        if (message && message.trim() !== "") {
            $("#SuitSection").addClass("dim");
            $("#SiriWave").attr("hidden", false);
            eel.allCommands(message.trim());
            $("#chatbox").val("");
            $("#MicBtn").attr('hidden', false).removeClass("active");
            $("#SendBtn").attr('hidden', true);
        }
    }

    function ShowHideButton(message) {
        if (!message || message.length === 0) {
            $("#MicBtn").attr('hidden', false);
            $("#SendBtn").attr('hidden', true);
        } else {
            $("#MicBtn").attr('hidden', true);
            $("#SendBtn").attr('hidden', false);
        }
    }

    $("#chatbox").on('input keyup change', function () { ShowHideButton($(this).val()); });
    $("#SendBtn").click(function () { PlayAssistant($("#chatbox").val()); });
    $("#chatbox").keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            PlayAssistant($("#chatbox").val());
        }
    });
});