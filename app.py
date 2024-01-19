import flask
import openai
import src.speechbot as speechbot
import speech_recognition as sr
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play

openai.api_key = "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"
messages = []
system_msg = "strictly only give answers regarding namami gange program and rivers in india, any other question is to be rejected"
messages.append({"role": "system", "content": system_msg})

app = flask.Flask(__name__)

@app.route('/')
def index():
    return flask.render_template('index.html')

@app.route('/chat')
def chat():
    return flask.render_template('chat.html')

@app.route('/speech/', methods=['POST'])
def speech():
    user_input = speechbot.getUserSpeechInput()
    messages.append({"role": "user", "content": user_input})

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages)
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})

    # tts = gTTS(text=reply, lang='en')
    # tts.save("response.mp3")
    # sound = AudioSegment.from_mp3("response.mp3")
    # play(sound)

    return flask.jsonify({"status": "success", "reply": reply, "user_input": user_input})


@app.route('/play/<msg>', methods=['POST'])
def play(msg):
    tts = gTTS(text=msg, lang='en')
    tts.save("response.mp3")
    sound = AudioSegment.from_mp3("response.mp3")
    play(sound)
    return flask.jsonify({"status": "success"})

@app.route('/answer/<msg>', methods=['POST'])
def answer(msg):
    messages.append({"role": "user", "content": msg})

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages)
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})

    return flask.jsonify({"status": "success", "reply": reply})

if __name__ == '__main__':
    app.run(debug=True)