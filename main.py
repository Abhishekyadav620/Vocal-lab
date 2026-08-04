import eel

from engine.features import playAssistantSound
from engine.command import speak


def start():

    eel.init("www")

    playAssistantSound()

    @eel.expose
    def init():
        eel.hideLoader()
        speak("Hello Sir, Welcome. How can I help you?")
        eel.hideStart()
        playAssistantSound()

    # Optimized for Chrome in app mode
    eel.start('index.html', mode='chrome', host='localhost', block=True)