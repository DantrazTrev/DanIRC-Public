// single fn to indicate we want to connect with a web socket
var socket = io();
var connection = new RTCMultiConnection();

// this line is VERY_important
connection.socketURL = 'https://webrtcweb.com:9002/';// teMP REPLACEMENT FOR THE SIGNALLING SERVERS
connection.mediaConstraints = {
    audio: true,
    video: false
};

// all below lines are optional; however recommended.



var constraints = {
    video: false,
    audio: true,
};


// DOM elements
const $messageForm = document.querySelector('#form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormSubmit = $messageForm.querySelector('button');

const $locationButton = document.querySelector('#location');

const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');
const $burger = document.querySelector('#burger');
const $burgerLines = document.querySelectorAll('#burger div');

const messageTemplate = document.querySelector('#message-template-other').innerHTML;
const messageTemplateMine = document.querySelector('#message-template-mine').innerHTML;

const locationTemplate = document.querySelector('#location-template').innerHTML;
const locationTemplateMine = document.querySelector('#location-template-mine').innerHTML;

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


// Parses the attached query strings(location.search) in the page for username and room-name
var { username, room, localserver, invite } = Qs.parse(location.search, { ignoreQueryPrefix: true });

var alias=room
room=btoa(room)


var ip;
if(!localserver){
socket=io('https://dantrirc.glitch.me/')
document.getElementById('qr').innerHTML="This is the central server";

}
if (!username || !room) {
    // if one tries to use chat without logging in, redirect to home
    location.href = '/login.html';

} 

else
{
    // To make a user join a particular room
    socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error);
            location.href = '/login.html';
        }
    });
}

var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var roomba= document.getElementById("roomba")
var captionText = document.getElementById("caption");
function nostros(){
    if(localserver){
  modal.style.display = "block";
  modalImg.src = img.src;
  captionText.innerHTML = "Invite Code:"+room;}
  else{
      modal.style.display = "block";
  captionText.innerHTML = "To acess a central server please install the client";
  }
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
} 

// Show and hide nav
$burger.addEventListener('click', () => {

    $burger.classList.toggle('toggle');

    if ($sidebar.style.width === '225px') {
        //close the nav
        $sidebar.style.width = '0px';
        $sidebar.style.transform = 'translateX(-100%)';

    } else {
        $sidebar.style.width = '225px';
        $sidebar.style.transform = 'translateX(0%)';    
    }

})

// Autoscrolling for the user
const autoscroll = () => {
    // Stores the new message
    const $newMessage = $messages.lastElementChild;

    // Calulates height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMarginBottom = parseInt(newMessageStyles.marginBottom);
    //final height 
    const newMessageHeight = $newMessage.offsetHeight + newMessageMarginBottom;

    // Visible/viewport height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    // if the user is already at bottom of screen, scroll to display the new message
    if ( (containerHeight - newMessageHeight) <= scrollOffset ) {
        $messages.scrollTop = containerHeight;
    }
    // if not let him stay there

}

// To display a message sent by server
socket.on('message', (message) => {
    if (message.id === socket.id) {
        const html = Mustache.render(messageTemplateMine, {
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
        $messages.insertAdjacentHTML('beforeend', html);
        
    } else {
        const html = Mustache.render(messageTemplate, {
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
        $messages.insertAdjacentHTML('beforeend', html);
    }
    

    autoscroll();
});

// To display a location message sent by server
socket.on('locationMessage', (message) => {

    if (message.id === socket.id) {
        const html = Mustache.render(locationTemplateMine, {
            username: message.username,
            url: message.url,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
        $messages.insertAdjacentHTML('beforeend', html);
        
    } else {
        const html = Mustache.render(locationTemplate, {
            username: message.username,
            url: message.url,
            createdAt: moment(message.createdAt).format('h:mm a')
        });
        $messages.insertAdjacentHTML('beforeend', html);
    }

    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  } 
socket.on('ip',(ip) => {
ip=ip;
document.getElementById('qrcode').innerHTML = ip;
on();
})
// To display sidebar contents
socket.on('roomData', ({ room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        alias,
        users
    });
    $sidebar.innerHTML = html;
})

// To send the user's message to the server
$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // disables the button while sending the message
    $messageFormSubmit.setAttribute('disabled', 'disabled');

    const message = event.target.elements.message.value;
    if (!message) {
        alert('Empty message!');
    } else {
        socket.emit('sendMessage', message, () => {
            // renables button if message sent successsfully
            $messageFormSubmit.removeAttribute('disabled');
            event.target.elements.message.value = "";
    
            // sends focus back to input field for faster messaging
            $messageFormInput.focus();
        });
    }    

});

// To send the user's location to the server
$locationButton.addEventListener('click', () => {

    // checks if browser supports HTML geolocation
    if (!navigator.geolocation) {
        return alert('Your browser does not support location.');
    }

    // disables the location button to avoid multiple clicks
    $locationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition( (location) => {

        const position = {
            lat: location.coords.latitude,
            long: location.coords.longitude,
        }
        socket.emit('sendLocation', position, (error) => {
            // re-enables the location button
            $locationButton.removeAttribute('disabled');

            // acknowledgement function
            if (error) {
                return console.log(error)
            }

            console.log('Location shared successfully!');
        });

    });

    

});

function gotMessageFromServer(fromId, message) {

    //Parse the incoming signal
    var signal = JSON.parse(message)

    //Make sure it's not coming from yourself
    if(fromId != socketId) {

        if(signal.sdp){            
            connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {                
                if(signal.sdp.type == 'offer') {
                    connections[fromId].createAnswer().then(function(description){
                        connections[fromId].setLocalDescription(description).then(function() {
                            socket.emit('signal', fromId, JSON.stringify({'sdp': connections[fromId].localDescription}));
                        }).catch(e => console.log(e));        
                    }).catch(e => console.log(e));
                }
            }).catch(e => console.log(e));
        }
    
        if(signal.ice) {
            connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
        }                
    }
}


function audio() {

connection.session = {
    audio: true,
    video: false
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
};
    connection.onstream = function(event) {
        document.body.appendChild( event.mediaElement );
    };
    
    var predefinedRoomId = room;
    
    connection.openOrJoin(predefinedRoomId);
    document.getElementById("audio").src='./img/mic.svg'
    
}
