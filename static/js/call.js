var audio_map = new Map([
  [true, `<img src="../static/images/mic.png" width="45%" height="45%">`],
  [false, `<img src="../static/images/mic_mute.png" width="45%" height="45%">`],
]);
var video_map = new Map([
  [true, `<img src="../static/images/video.png" width="45%" height="45%">`],
  [false, `<img src="../static/images/video-off.png" width="45%" height="45%">`],
]);
const peers = {};

const socket = io('/');

var audio_enabled = $.cookie("audio_" + username) === "true";
var video_enabled = $.cookie("video_" + username) === "true";

let sender, reciever;

$(document).ready(function () {

  if (
    typeof $.cookie("audio_" + username) === "undefined" ||
    typeof $.cookie("video_" + username) === "undefined"
  ) {
    window.location.href = "/join/user-preferences?roomId=" + roomId;
  }

  let myVideoStream;

  const myVideo = document.createElement("video");
  myVideo.classList.add("sender");
  myVideo.muted = true;
  myVideo.id = "sender";
  myDiv = createVideoElement(myVideo);

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream = stream;

      myVideoStream.getAudioTracks()[0].enabled = audio_enabled;
      $("#audio").html(audio_map.get(audio_enabled));

      myVideoStream.getVideoTracks()[0].enabled = video_enabled;
      $("#video").html(video_map.get(video_enabled));

      addVideoStream(myDiv, stream, video_enabled, audio_enabled);

      myPeer.on("call", (call) => {
        call.answer(stream);
        socket.emit("initial_status", {
          video: $.cookie("video_" + username) === "true",
          audio: $.cookie("audio_" + username) === "true"
        });

        const video = document.createElement("video");

        video.id = call.peer;
        div = createVideoElement(video);
        div.classList.add("recipient");

        // Recipient's video stream
        call.on("stream", (userVideoStream) => {
          if (!peers[call.peer]) {
            addVideoStream(div, userVideoStream, reciever.video, reciever.audio);
          }
        });
      });

      socket.on("user-connected", function (dict) {
        connectToNewUser(dict.userId, stream);
      });

      let text = $("#chat_message");
      $("#chat_message").keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {          
          $("#intro").removeClass("d-flex");
          $("#intro").addClass("d-none");
          
          socket.emit("message", { message: text.val(), room: roomId });
          $("#messages").append(`<div class="sent_msg">${text.val()}</div>`);
          scrolltoBottom();
          text.val("");
        }
      });

      socket.on("createMessage", function (dict) {
        $("#intro").removeClass("d-flex");
        $("#intro").addClass("d-none");
        
        $("#messages").append(
          `<div class="text-left ml-2 recieved_msg">${dict.message}</div>`
        );
        scrolltoBottom();
      });

      socket.on("redirect", function (data) {
        window.location.href = data.url;
      });

      socket.on("change_video_status", function (data) {
        userId = "#" + data.userId + " ";

        if (data.status) {
          $(userId + "video").css("display", "flex");
          $(userId + ".overlay").css("display", "none");
        } else {
          $(userId + "video").css("display", "none");
          $(userId + ".overlay").css("display", "flex");
        }
      });

      socket.on("change_audio_status", function (data) {
        userId = "#" + data.userId + " ";
        
        if (data.status) {
          $(userId + ".mic").css("display", "none");
        } else {
          $(userId + ".mic").css("display", "flex");
        }
      });
    });

  socket.on("user-disconnected", function (dict) {
    userId = dict.userId;
    if (peers[userId]) peers[userId].close();
  });

  // Use constructor
  myPeer.on("open", function (id) {
    sender = id;
    socket.emit("get_clients", { roomId: roomId, userId: id });
  });

  socket.on("detect-status", function (data) {
    reciever = data;
  });

  socket.on("user-left", function () {
    $("div").remove(".recipient");
    console.log("User Left");
  });

  socket.on("grant_entry", function (dict) {
    if (dict["decision"]) {
      roomId = dict["roomId"];
      id = dict["userId"];
      socket.emit("join_room", { roomId: roomId, userId: id });
    } else {
      alert("Lobby Full");
      window.location.href = "/";
    }
  });

  $("#audio").click(function () {
    audio_enabled = myVideoStream.getAudioTracks()[0].enabled;
    myVideoStream.getAudioTracks()[0].enabled = !audio_enabled;

    $.cookie("audio_" + username, myVideoStream.getAudioTracks()[0].enabled);
    $("#audio").html(audio_map.get(!audio_enabled));

    display("#sender .mic", audio_enabled)

    socket.emit("toggle_audio", {
      roomId: roomId,
      userId: myPeer.id,
      status: !audio_enabled,
    });
  });

  $("#video").click(function () {
    video_enabled = myVideoStream.getVideoTracks()[0].enabled;
    myVideoStream.getVideoTracks()[0].enabled = !video_enabled;

    $.cookie("video_" + username, myVideoStream.getVideoTracks()[0].enabled);
    $("#video").html(video_map.get(!video_enabled));

    if (video_enabled) {
      $("#sender video").css("display", "none");
      $("#sender .overlay").css("display", "flex");
    } else {
      $("#sender video").css("display", "flex");
      $("#sender .overlay").css("display", "none");
    }

    socket.emit("toggle_video", {
      roomId: roomId,
      userId: myPeer.id,
      status: !video_enabled,
    });
  });

  $("#leave_room").click(function () {
    $.removeCookie("audio_" + username);
    $.removeCookie("video_" + username);
    socket.emit("leave", { roomId: roomId });
  });

  $("#send_msg").click(function(){
    $("#intro").removeClass("d-flex");
    $("#intro").addClass("d-none");

    let text = $("#chat_message");
    if (text.val().length !== 0) {
      socket.emit("message", { message: text.val(), room: roomId });
      $("#messages").append(`<div class="sent_msg">${text.val()}</div>`);
      scrolltoBottom();
      text.val("");
    }
  });

  window.onunload = function (e) {
    socket.emit("leave", { roomId: roomId });
  };
});
const scrolltoBottom = () => {
  var d = $("#chat_section");
  d.scrollTop(d.prop("scrollHeight"));
};
const connectToNewUser = function (userId, stream) {
  console.log("new user");
  console.log(userId);

  const call = myPeer.call(userId, stream);
  socket.emit("initial_status", {
    video: $.cookie("video_" + username) === "true",
    audio: $.cookie("audio_" + username) === "true"
  });

  const video = document.createElement("video");

  video.id = call.peer;
  div = createVideoElement(video);
  div.classList.add("recipient");

  // Recipient's Video Stream
  call.on("stream", (userVideoStream) => {
    addVideoStream(div, userVideoStream, reciever.video, reciever.audio);
  });

  call.on("close", () => {
    div.remove();
  });

  peers[userId] = call;
};

const createVideoElement = function (video) {
  const bool = video.id == "sender"
  const temp_id = video.id == "sender" ? myPeer.id : video.id;

  const myDiv_parent = document.createElement("div");
  myDiv_parent.classList.add("content");

  const img = document.createElement("img")
  img.src = `${mic_url}`
  img.classList.add("mic")
  img.style = bool ? "z-index: 3; position: relative; width:30px; height:30px; bottom: 30px;" : "z-index: 3; position: relative; width:40px; height:40px; bottom: 40px;"

  $.ajax({
    url: "../ajax/get_data/",
    data: {
      userid: temp_id,
    },
    async: false,
    dataType: "json",
    success: function (data) {
      const content = data.full_name;
      const src = data.profile_picture;

      const myDiv_child = document.createElement("div");
      myDiv_child.classList.add("overlay");

      if (bool) {
        myDiv_child.innerHTML = `<img src="${src}" style="width:30%;height:30%">\
                <h6>${content}</h6>`;
      }
      else {
        myDiv_child.innerHTML = `<img src="${src}" style="width:20%;height:20%">\
                <h5>${content}</h5>`;
      }

      myDiv_parent.append(myDiv_child);
      myDiv_parent.append(video);
      myDiv_parent.append(img);
    },
  });
  return myDiv_parent;
};

const addVideoStream = function (div, stream, video_status = null, audio_status = null) {
  video = div.getElementsByTagName("video")[0];
  overlay = div.getElementsByClassName("overlay")[0];
  mic = div.getElementsByClassName("mic")[0];

  if (video.hasAttribute("id")) {
    div.setAttribute("id", video.id);
    video.removeAttribute("id");

    video.srcObject = stream;

    video.addEventListener("loadedmetadata", function () {
      video.play();
    });

    if (video_status != null) {
      if (video_status) {
        video.style.display = "flex";
        overlay.style.display = "none";
      } else {
        video.style.display = "none";
        overlay.style.display = "flex";
      }
    }

    if (audio_status != null) {
      mic.style.display = (audio_status) ? "none" : "block"
    }

    if (div.id == "sender") {
      $("#sender-video").append(div);
    } else {
      $("#reciever-video").append(div);
    }
  }
};
