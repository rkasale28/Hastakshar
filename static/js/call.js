var myPeer = new Peer()

var audio_map = new Map([[true, "Mute"], [false, "Unmute"]])
var video_map = new Map([[true, "Stop Video"], [false, "Start Video"]])

const peers = {}

var socket = io.connect();

var audio_enabled = ($.cookie("audio")==="true");
var video_enabled = ($.cookie("video")==="true");

let sender, reciever
    
$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search)
    let roomId = searchParams.get('roomId')
    
    if(roomId==null){
        alert("Access Prohibited")
        window.location.href = "/"
    }

    let myVideoStream

    const myVideo = document.createElement("video");
    myVideo.classList.add("sender")
    myVideo.muted = true;
    myVideo.id = "sender"
    myDiv = createVideoElement(myVideo)
    
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        myVideoStream = stream;

        myVideoStream.getAudioTracks()[0].enabled = audio_enabled;
        $("#audio").html(audio_map.get(audio_enabled))

        myVideoStream.getVideoTracks()[0].enabled = video_enabled;
        $("#video").html(video_map.get(video_enabled))

        addVideoStream(myDiv, stream, video_enabled)

        myPeer.on('call', call => {
            call.answer(stream)
            socket.emit('initial_video',{'video':video_enabled})

            const video = document.createElement('video')
            video.classList.add("recipient")
            video.id = call.peer
            div = createVideoElement(video)

            // Recipient's video stream
            call.on('stream', userVideoStream => {
                if(!peers[call.peer]){
                    addVideoStream(div, userVideoStream, reciever.video)
                }
            })
        })

        socket.on('user-connected', function (dict) {
            connectToNewUser(dict.userId, stream)
        })

        let text = $("input");
        $('html').keydown(function (e) {
            if (e.which == 13 && text.val().length !== 0) {
                socket.emit('message', { "message": text.val(), "room": roomId });
                $("#messages").append(`<li class="message"><b>sent</b><br/>${text.val()}</li>`);
                text.val('')
            }
        });

        socket.on('createMessage', function (dict) {
            $("#messages").append(`<li class="message"><b>recieved</b><br/>${dict.message}</li>`);
        })

        socket.on('redirect', function (data) {
            window.location.href = data.url
        })

        socket.on('change_status',function(data){
            userId = "#" + data.userId + " "
            
            if (data.status){
                $(userId + "video").css("display","flex");
                $(userId + ".overlay").css("display","none");
            }
            else{
                $(userId + "video").css("display","none");
                $(userId + ".overlay").css("display","flex");
            }
        })

    })

    socket.on('user-disconnected',function(dict){
        userId = dict.userId
        if (peers[userId]) peers[userId].close()
    })

    // Use constructor
    myPeer.on('open', function (id) {
        sender = id
        socket.emit('get_clients', {'roomId' : roomId, 'userId': id })
        // socket.emit('join_room', { roomId: roomId, userId: id });
    })

    socket.on('detect-status',function(data){
        reciever = data
    })

    socket.on('user-left', function () {
        $("div").remove(".recipient")
        console.log("User Left")
    })

    socket.on('grant_entry',function(dict){
        if(dict['decision']){
            roomId = dict['roomId']
            id = dict['userId']
            socket.emit('join_room', { roomId: roomId, userId: id });
        }
        else{            
            alert("Lobby Full")
            window.location.href = "/"
        }

    })

    $("#audio").click(function () {
        audio_enabled = myVideoStream.getAudioTracks()[0].enabled
        myVideoStream.getAudioTracks()[0].enabled = !audio_enabled;
        
        $.cookie("audio", myVideoStream.getAudioTracks()[0].enabled);
        $("#audio").html(audio_map.get(!audio_enabled))
    })

    $("#video").click(function () {
        video_enabled = myVideoStream.getVideoTracks()[0].enabled
        myVideoStream.getVideoTracks()[0].enabled = !video_enabled;

        $.cookie("video", myVideoStream.getVideoTracks()[0].enabled);
        $("#video").html(video_map.get(!video_enabled))

        if (video_enabled){
            $("#sender video").css("display","none");
            $("#sender .overlay").css("display","flex");
        }
        else{
            $("#sender video").css("display","flex");
            $("#sender .overlay").css("display","none");
        }
      
        socket.emit('toggle_video',{ roomId: roomId, userId : myPeer.id, status: !video_enabled})
    })

    $("#leave_room").click(function () {
        $.removeCookie("audio")
        $.removeCookie("video")
        socket.emit('leave', { roomId: roomId });
    })

    window.onunload = function(e){
        socket.emit('leave', { roomId: roomId });
    }
})

const connectToNewUser = function (userId, stream) {
    console.log('new user')
    console.log(userId)

    const call = myPeer.call(userId, stream)
    socket.emit('initial_video',{'video':video_enabled})   

    const video = document.createElement('video')
    video.classList.add("recipient")
    video.id = call.peer
    div = createVideoElement(video)
    
    // Recipient's Video Stream
    call.on('stream', userVideoStream => {    
        addVideoStream(div, userVideoStream, reciever.video)
    })

    call.on('close', () => {
        div.remove()
    })

    peers[userId] = call
}

const createVideoElement = function(video){
    const content = (video.id=="sender")?"Me":video.id
    const src = (video.id=="sender")?"sender":"recipient"

    const myDiv_parent = document.createElement('div')
    myDiv_parent.classList.add("content")
    
    const myDiv_child = document.createElement('div')
    myDiv_child.classList.add("overlay")
    myDiv_child.innerHTML = 
        `<img src="/images/${src}.png">\
        <h2>${content}</h2>`

    myDiv_parent.append(myDiv_child)
    myDiv_parent.append(video)

    myDiv_parent.classList.add(video.classList.item(0))

    return myDiv_parent
}

const addVideoStream = function (div, stream, status = null) {
    video = div.getElementsByTagName("video")[0]
    overlay = div.getElementsByClassName("overlay")[0]
    
    if (video.hasAttribute("id")){
        div.setAttribute("id",video.id)
        video.removeAttribute("id")

        video.srcObject = stream

        video.addEventListener('loadedmetadata', function () {
            video.play()
        })

        if (status!=null){
            if (status){
                video.style.display = "flex"
                overlay.style.display = "none"
            }
            else{
                video.style.display = "none"
                overlay.style.display = "flex"
            }
        }
        
        $('#video-grid').append(div)
    }
}    