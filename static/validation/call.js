$("#mail").keyup(function () {
    var user_name = $(this).val().trim();

    $.ajax({
        url: '../ajax/validate_username_exists/',
        data: {
            'username': user_name
        },
        dataType: 'json',
        success: function (data) {
            display("#username-error-1", data.exists)
            display("#username-error-2", user_name === username)
            enable("#submit", (data.exists) || (user_name === username) || user_name == "")
        }
    });
});

$("#submit").click(function () {
    reciever_name = $('#mail').val().trim()
    var url = window.location.href
    
    let searchParams = new URLSearchParams(window.location.search)
    let roomId = searchParams.get('roomId')
        
    $("#mail").val("")

    $.ajax({
        url: '../ajax/get_email/',
        data: {
            'username': reciever_name
        },
        dataType: 'json',
        success: function (data) {
            mail = data.email;

            var msg = "Dear " + reciever_name + ",<br>"+
            full_name + " has invited you to join the meeting. <br>"+
            "Following is the link: <a href='" + url + "'>"+url+"</a>.<br>"+
            "Following is the room code: " + roomId + 
            "<br><br>--<br>Warm Regards,<br>Support Team at Hastakshar"

            Email.send({
                Host: "smtp.gmail.com",
                Username: "hastakshar.noreply@gmail.com",
                Password: "Password_1",
                To: mail,
                From: "hastakshar.noreply@gmail.com",
                Subject: "Invite for meeting",
                Body: msg
            })
                .then(function (message) {
                    alert("Invite sent successfully to reciever!")
                });
        }
    });
});