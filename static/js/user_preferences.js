$(document).ready(function () {
  var socket = io.connect(
    window.location.protocol + "//" + document.domain + ":" + location.port
  );

  let myVideoStream;

  const myVideo = document.createElement("video");
  myVideo.muted = true;

  var audio_map = new Map([
    [true, `<img src="../static/images/mic.png" width="25" height="25">`],
    [false, `<img src="../static/images/mic_mute.png" width="25" height="25">`],
  ]);
  var video_map = new Map([
    [true, `<img src="../static/images/video.png" width="25" height="25">`],
    [false, `<img src="../static/images/video-off.png" width="25" height="25">`],
  ]);

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream = stream;

      myVideo.srcObject = myVideoStream;

      myVideo.addEventListener("loadedmetadata", function () {
        myVideo.play();
      });

      $("#myVideo").append(myVideo);

      const audio_enabled = myVideoStream.getAudioTracks()[0].enabled;
      $("#audio").html(audio_map.get(audio_enabled));

      const video_enabled = myVideoStream.getVideoTracks()[0].enabled;
      $("#video").html(video_map.get(video_enabled));
    });

  socket.on("connect", function () {
    console.log("I'm connected!");
  });

  socket.on("disconnect", function () {
    console.log("Disconnected");
  });

  socket.on("redirect", function (data) {
    window.location.href = data.url;
  });

  $("#join").click(function () {
    roomId = $("#roomId").val();

    if (roomId == "None") roomId = "None";

    $.cookie("audio_" + username, myVideoStream.getAudioTracks()[0].enabled);
    $.cookie("video_" + username, myVideoStream.getVideoTracks()[0].enabled);
    $.cookie("isl_" + username, false);
    socket.emit("generate", { roomId: roomId });
    return false;
  });

  $("#audio").click(function () {
    audio_enabled = myVideoStream.getAudioTracks()[0].enabled;
    myVideoStream.getAudioTracks()[0].enabled = !audio_enabled;
    $("#audio").html(audio_map.get(!audio_enabled));
  });

  $("#video").click(function () {
    video_enabled = myVideoStream.getVideoTracks()[0].enabled;
    myVideoStream.getVideoTracks()[0].enabled = !video_enabled;

    $("#video").html(video_map.get(!video_enabled));

    if (video_enabled) {
      $(".content video").css("display", "none");
      $(".content .overlay").css("display", "flex");
    } else {
      $(".content video").css("display", "flex");
      $(".content .overlay").css("display", "none");
    }
  });
});
