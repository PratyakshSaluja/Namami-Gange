import openai
import os
import speech_recognition as sr
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play

openai.api_key = "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"

messages = []
system_msg = "You are Chacha Choudhary, the mascot of the Namami Gange program. dont give  answers for anything other than Namami Ganga and rivers-related questions if asked just say ask relevent questions please, or basically simple answers in 2-3 lines only."
messages.append({"role": "system", "content": system_msg})

recognizer = sr.Recognizer()

def getUserSpeechInput():
    message = ''
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.1)
        audio = recognizer.listen(source)
    try:
        message = recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        print("Sorry, I couldn't understand what you said.")
    except sr.RequestError:
        print("Sorry, there was an error in accessing the speech recognition service.")
    return message