function sendEmail() {
    $('#id_username').attr('readonly', true);

    username = $('#id_username').val().trim()
    
    $.ajax({
        url: '../ajax/get_email/',
        data: {
            'username': username
        },
        dataType: 'json',
        success: function (data) {
            var num = ''
            for (i = 0; i < 5; i++) {
                digit = Math.floor(Math.random() * 10);
                num = num + digit.toString()
            }           

            mail = data.email;

            var msg = "Dear " + username + ",<br>You have requested for changing your password. <br>Your OTP for HastAkshar Account Password Reset is: " + num + ".<br>Kindly DO NOT share this One-Time-Password with anyone!<br><br>--<br>Warm Regards,<br>Support Team at HastAkshar"
            Email.send({
                Host: "smtp.gmail.com",
                Username: "hastakshar.noreply@gmail.com",
                Password: "Password_1",
                To: mail,
                From: "hastakshar.noreply@gmail.com",
                Subject: "[IMPORTANT] OTP for HastAkshar Account Password Reset",
                Body: msg
            })
                .then(function (message) {
                    alert("OTP sent successfully to registered email address!")

                    $("#otp1").val(num)
                    $('#otp_button').css("display", "none");
                    $('#div_id_otp').css("display", "block");
                    $('#submit_button').css("display", "block");
                }); 
        }
    });
}

function enterPassword(){
    $('#otp2').attr('readonly', true);
    $("#submit_button").css("display","none")
    $('#div_id_password1').css("display", "block");
    $('#div_id_password2').css("display", "block");
    $('#submit').css("display", "block");
}

