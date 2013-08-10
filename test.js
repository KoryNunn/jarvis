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