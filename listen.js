function createEvent(errorDefinition){
    return {
        raw: errorDefinition.raw || ""
    };
}

function initSpeech(jarvis){
    if (!('webkitSpeechRecognition' in window)) {
        //derp
    } else {
        var recognition = jarvis._recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function() { 

        };
        recognition.onresult = function(event) {
            var result = event.results[event.results.length-1];

            if(result.isFinal){
                jarvis.trigger('result', createEvent({
                    raw: result[0].transcript
                }));
            }
        };
        recognition.onerror = function(event) { 
            console.log(event);
        };
        recognition.onend = function() { 

        };
    }
}

function trigger(eventNames, event){
    var jarvis = this,
        eventNames = eventNames.split(' ');

    if(eventNames.length > 1){
        eventNames.forEach(function(eventName){
            jarvis.trigger(eventName, event);
        });
    }

    this._events[eventNames.pop()].forEach(function(callback){
        callback(event);
    });
}

function on(eventNames, callback){
    var jarvis = this,
        eventNames = eventNames.split(' ');

    if(eventNames.length > 1){
        eventNames.forEach(function(eventName){
            jarvis.on(eventName, callback);
        });
    }

    var eventName = eventNames[0],
        events = this._events[eventName] = this._events[eventName] || [];

    events.push(callback);
}

function start(){
    this._recognition.start();
}

function stop(){
    this._recognition.stop();
}

function isInitiator(part){
    var words = [
        "hey", "oi", "hello", "hi", "sup"
    ];
    for(var i = 0; i < words.length; i++){
        if(words[i] === part){
            return true;
        }
    };
}

function isJarvis(part){
    var words = [
        "jarvis", "javas", "john", "jannis", "siri", "computer"
    ];
    for(var i = 0; i < words.length; i++){
        if(words[i] === part){
            return true;
        }
    };
}

function isQuestion(part){
    var words = [
        "can", "is", "how", "why", "who", "when", "what", "where"
    ];
    for(var i = 0; i < words.length; i++){
        if(words[i] === part){
            return true;
        }
    };
}

function Interaction(messageParts){
    this.messageParts = messageParts;
    this.name = messageParts,
    this.rest = [];
}

function initParser(jarvis){
    jarvis.on('result', function(event){
        console.log(event.raw);
        var messageParts = event.raw.toLowerCase().trim().split(' '),
            interaction = new Interaction(messageParts),
            part;

        while(messageParts.length){
            part = messageParts[0];
            if(!interaction.started){
                if(isInitiator(part)){
                    interaction.initiator = messageParts.shift();
                    continue;
                }
                if(isJarvis(part)){
                    interaction.name = messageParts.shift();
                    continue;
                }
                if(interaction.name){
                    if(isQuestion(part)){
                        interaction.question = messageParts.shift();
                    }else{
                        interaction.command = messageParts.shift();
                    }
                    interaction.started = true;
                    continue;
                }
            }else{
                if(part){
                    interaction.rest.push(messageParts.shift());
                }
            }
        }

        console.log(interaction);

        if(isQuestion(messageParts)){
            console.log('asking question');

            event.initiator = messageParts[0];



            jarvis.trigger('question', event);
        }else{

            event.initiator = messageParts[0];
            jarvis.trigger('command', event);
        }

    });
}


module.exports = function(jarvis){    
    jarvis._events = {};

    jarvis.on = on;
    jarvis.trigger = trigger;
    jarvis.start = start;
    jarvis.stop = stop;

    initSpeech(jarvis);
    initParser(jarvis);
}