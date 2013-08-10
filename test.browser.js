;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Jarvis(){
    require('./listen')(this);
    //require('./speak')(this);
}

module.exports = Jarvis;
},{"./listen":2}],2:[function(require,module,exports){
var wordInfo = require('../wordInfo/wordInfo');

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

        console.log(messageParts[0], wordInfo(messageParts[0]));


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
},{"../wordInfo/wordInfo":5}],3:[function(require,module,exports){
//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.
    
    However, the code's intention should be transparent.
    
    *** IE SUPPORT ***
    
    If you require this library to work in IE7, add the following after declaring crel.
    
    var testDiv = document.createElement('div'),
        testLabel = document.createElement('label');

    testDiv.setAttribute('class', 'a');    
    testDiv['className'] !== 'a' ? crel.attrMap['class'] = 'className':undefined;
    testDiv.setAttribute('name','a');
    testDiv['name'] !== 'a' ? crel.attrMap['name'] = function(element, value){
        element.id = value;
    }:undefined;
    

    testLabel.setAttribute('for', 'a');
    testLabel['htmlFor'] !== 'a' ? crel.attrMap['for'] = 'htmlFor':undefined;
    
    

*/

// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
  }
}(this, function () {
    // based on http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    var isNode = typeof Node === 'object'
        ? function (object) { return object instanceof Node }
        : function (object) {
            return object
                && typeof object === 'object'
                && typeof object.nodeType === 'number'
                && typeof object.nodeName === 'string';
        };

    function crel(){
        var document = window.document,
            args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            element = document.createElement(args[0]),
            child,
            settings = args[1],
            childIndex = 2,
            argumentsLength = args.length,
            attributeMap = crel.attrMap;

        // shortcut
        if(argumentsLength === 1){
            return element;
        }

        if(typeof settings !== 'object' || isNode(settings)) {
            --childIndex;
            settings = null;
        }

        // shortcut if there is only one child that is a string    
        if((argumentsLength - childIndex) === 1 && typeof args[childIndex] === 'string' && element.textContent !== undefined){
            element.textContent = args[childIndex];
        }else{    
            for(; childIndex < argumentsLength; ++childIndex){
                child = args[childIndex];
                
                if(child == null){
                    continue;
                }
                
                if(!isNode(child)){
                    child = document.createTextNode(child);
                }
                
                element.appendChild(child);
            }
        }
        
        for(var key in settings){
            if(!attributeMap[key]){
                element.setAttribute(key, settings[key]);
            }else{
                var attr = crel.attrMap[key];
                if(typeof attr === 'function'){     
                    attr(element, settings[key]);               
                }else{            
                    element.setAttribute(attr, settings[key]);
                }
            }
        }
        
        return element;
    }
    
    // Used for mapping one kind of attribute to the supported version of that in bad browsers.
    // String referenced so that compilers maintain the property name.
    crel['attrMap'] = {};
    
    // String referenced so that compilers maintain the property name.
    crel["isNode"] = isNode;
    
    return crel;
}));

},{}],4:[function(require,module,exports){
var Jarvis = require('./'),
    crel = require('crel');

var jarvis = new Jarvis();

function handleClickCommand(event){
    var elements = document.querySelectorAll('*');

    for(var i = 0; i < elements.length; i++){
        if(elements[i].innerText.indexOf(event.target)>=0){
            elements[i].click();
        }
    }
}

jarvis.on('command', function(event){
    var target = event.target;

    if(event.command === 'click'){
        handleClickCommand(event);        
    }
});

jarvis.on('question', function(event){
    if(event.initiator === 'how'){
        
    }
});


window.addEventListener('load', function(){
    var startButton = crel('button', 'start');

    startButton.addEventListener('click', function(event){
        if(event.target.innerText === 'start'){
            jarvis.start();
            event.target.innerText = 'stop';
        }else{
            jarvis.stop();
            event.target.innerText = 'start';
        }
    });

    document.body.appendChild(startButton);
});
},{"./":1,"crel":3}],5:[function(require,module,exports){
var fs = require('fs'),
    fileSplit = {};

module.exports = function(word){
    if(!(fileSplit[word.charAt(0)] && fileSplit[word.charAt(0)][word])){
        fileSplit[word.charAt(0)] = JSON.parse(fs.readFileSync('./data/' + word.charAt(0) + '.json'));
    }
    return fileSplit[word.charAt(0)][word];
};
},{"fs":6}],6:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}]},{},[4])
;