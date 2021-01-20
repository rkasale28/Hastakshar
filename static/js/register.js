function sendEmail() {
    var bool = $("#id_first_name").val().trim() != '' &&
    $("#id_last_name").val().trim() != '' &&
    $("#id_email").val().trim() != '' &&
    $('#email-error-2').css('display') == 'none' &&
    $("#id_username").val().trim() != '' &&
    $('#username-error-2').css('display') == 'none' &&
    $('#username-error-3').css('display') == 'none' &&
    $('#username-error-4').css('display') == 'none' &&
    $('#username-error-5').css('display') == 'none' &&
    $("#id_password1").val().trim() != '' &&
    $('#password-error-2').css('display') == 'none' &&
    $('#password-error-3').css('display') == 'none' &&
    $('#password-error-4').css('display') == 'none' &&
    $('#password-error-5').css('display') == 'none' &&
    $('#password-error-6').css('display') == 'none' &&
    $("#id_password2").val().trim() != '' &&
    $('#password2-error-2').css('display') == 'none'

    if (bool){
    $('#id_first_name').attr('readonly', true);
    $('#id_last_name').attr('readonly', true);
    $('#id_username').attr('readonly', true);
    $('#id_email').attr('readonly', true);
    $('#id_password1').attr('readonly', true);
    $('#id_password2').attr('readonly', true);

    $("#otp2").css("display", "block");
    $("#submit").css("display", "block");
    $("#div_id_otp").css("display", "block");
    $("#otp_button").css("display", "none");
    $('#div_id_profile_picture').css("display", "block");

    var num = ''
    for (i = 0; i < 5; i++) {
        digit = Math.floor(Math.random() * 10);
        num = num + digit.toString()
    }

    var mail = $("#id_email").val().trim()
    var user = $("#id_username").val().trim()
    
    var msg = "Dear " + user + ",<br>Your OTP for Hastakshar Account Registration is: " + num + ".<br>Kindly DO NOT share this One-Time-Password with anyone!<br><br>--<br>Warm Regards,<br>Support Team at Hastakshar"

    Email.send({
        Host: "smtp.gmail.com",
        Username: "hastakshar.noreply@gmail.com",
        Password: "Password_1",
        To: mail,
        From: "hastakshar.noreply@gmail.com",
        Subject: "OTP for Hastakshar Account Registration",
        Body: msg
    })
        .then(function (message) {
            alert("OTP sent successfully!")
        });
    }else{
        alert("Invalid Format. Please enter information according to given conventions")
    }

    $("#otp1").val(num)
} 
