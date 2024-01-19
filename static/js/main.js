var message = document.querySelector('.messages-content'),
    d, h, m,
    i = 0;

window.onload = function () {
    setTimeout(function () {
        startUpMessage();
    }, 100);
};

function setDate() {
    d = new Date();
    if (m !== d.getMinutes()) {
        m = d.getMinutes();
        var timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = d.getHours() + ':' + m;
        document.querySelector('.message:last-child').appendChild(timestamp);
    }
}

function insertMessage() {
    msg = document.querySelector('.message-input').value;
    if (msg.trim() === '') {
        return false;
    }

    var newMessage = document.createElement('div');
    newMessage.className = 'message message-personal new';
    newMessage.textContent = msg;
    document.querySelector('.container').appendChild(newMessage);
    setDate();
    document.querySelector('.message-input').value = null;

    var loadingMessage = document.createElement('div');
    loadingMessage.className = 'message loading new';
    loadingMessage.innerHTML = '<figure class="avatar"><img src="../static/images/logo.jpg" /></figure><span></span>';
    document.querySelector('.container').appendChild(loadingMessage);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/answer/' + msg);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            chatMessage(response.reply);
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}


function getAudioMessage() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/speech/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
                    
            var newMessage = document.createElement('div');
            newMessage.className = 'message message-personal new';
            newMessage.textContent = response.user_input;
            document.querySelector('.container').appendChild(newMessage);
            setDate();
            document.querySelector('.message-input').value = null;

            chatMessage(response.reply);

            // var xhr = new XMLHttpRequest();
            // xhr.open('POST', '/play/' + response.reply);
            // xhr.setRequestHeader('Content-Type', 'application/json');
            // xhr.onload = function () {
            //     if (xhr.status === 200) {
            //     console.log("Message played");
            //     }
            //     else {
            //         console.log('Request failed.  Returned status of ' + xhr.status);
            //     }
            // };
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function listenToUserInput() {
    if (document.querySelector('.message-input').value !== '') {
        return false;
    }
    
    var loadingMessage = document.createElement('div');
    loadingMessage.className = 'message message-personal loading new';
    loadingMessage.innerHTML = '<figure class="avatar"><img src="../static/images/logo.jpg" /></figure><span></span>';
    document.querySelector('.container').appendChild(loadingMessage);

    setTimeout(function () {
        document.querySelector('.message.loading').remove();
    }, 50000);
}

document.querySelector('.message-speech').addEventListener('click', function () {
    listenToUserInput();
    getAudioMessage();
});

document.querySelector('.message-submit').addEventListener('click', function () {
    insertMessage();
});

window.addEventListener('keydown', function (e) {
    if (e.which === 13) {
        insertMessage();
        e.preventDefault();
    }
});

function chatMessage(msg) {
    if (document.querySelector('.message-input').value !== '') {
        return false;
    }

    document.querySelector('.message.loading').remove();
    var newMessage = document.createElement('div');
    newMessage.className = 'message new';
    newMessage.innerHTML = '<figure class="avatar"><img src="../static/images/logo.jpg" /></figure>' + msg;
    document.querySelector('.container').appendChild(newMessage).classList.add('new');
    setDate();
}

function startUpMessage() {
    if (document.querySelector('.message-input').value !== '') {
        return false;
    }

    var loadingMessage = document.createElement('div');
    loadingMessage.className = 'message loading new';
    loadingMessage.innerHTML = '<figure class="avatar"><img src="../static/images/logo.jpg" /></figure><span></span>';
    document.querySelector('.container').appendChild(loadingMessage);

    setTimeout(function () {
        document.querySelector('.message.loading').remove();
        var newMessage = document.createElement('div');
        newMessage.className = 'message new';
        newMessage.innerHTML = '<figure class="avatar"><img src="../static/images/logo.jpg" /></figure>' + 'Hello, I am the chatbot for the website. What can I help you with?';
        document.querySelector('.container').appendChild(newMessage).classList.add('new');
        setDate();
        i++;
    }, 1000 + Math.random() * 20 * 100);
}