$("#submit").click(function () {
    roomId = $('#room_code').val().trim();

    window.location.href = "/join/user-preferences?roomId=" + roomId
});