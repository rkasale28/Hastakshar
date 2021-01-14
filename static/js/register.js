$('#div_id_profile_picture').css("display", "none");

$("#id_username").keyup(function () {
    var username = $(this).val();

    $.ajax({
      url: '../validate_username/',
      data: {
        'username': username
      },
      dataType: 'json',
      success: function (data) {
        if (data.is_taken) {
            $("#username-error-1").css("display", "block");
        }else{
            $("#username-error-1").css("display", "none");
        }
      }
    });
  });

function sendEmail() {
    var pwd1 = $("#id_password1").val()
    var pwd2 = $("#id_password2").val()
    if (pwd1 == pwd2) {
        if (pwd1 != "" && pwd2 != "") {
            $('#id_first_name').attr('readonly', true);
            $('#id_last_name').attr('readonly', true);
            $('#id_username').attr('readonly', true);
            $('#id_email').attr('readonly', true);
            $('#id_password1').attr('readonly', true);
            $('#id_password2').attr('readonly', true);

            var mail = $("#id_email").val()
            var user = $("#id_username").val()

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

            $("#otp1").val(num)
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
        } else {
            $("#id_password1").val("")
            $("#id_password2").val("")
            alert("Password fields cannot be empty!")
        }
    } else {
        $("#id_password1").val("")
        $("#id_password2").val("")
        alert("Password and Confirm Password fields don't match!")
    }
}
