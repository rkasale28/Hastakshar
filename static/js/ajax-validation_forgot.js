$("#id_username").keyup(function () {
    var username = $(this).val().trim();

    $.ajax({
        url: '../ajax/validate_username_exists/',
        data: {
            'username': username
        },
        dataType: 'json',
        success: function (data) {
            display("#username-error-1", data.exists)
            enable("#otp_button",data.exists)
        }
    });
});

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

            var msg = "Dear " + username + ",<br>You have requested for changing your password. <br>Your OTP for Hastakshar Account Password Reset is: " + num + ".<br>Kindly DO NOT share this One-Time-Password with anyone!<br><br>--<br>Warm Regards,<br>Support Team at Hastakshar"
            Email.send({
                Host: "smtp.gmail.com",
                Username: "hastakshar.noreply@gmail.com",
                Password: "Password_1",
                To: mail,
                From: "hastakshar.noreply@gmail.com",
                Subject: "OTP for Hastakshar Account Password Reset",
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

$("#otp2").keyup(function () {
    var otp1 = $("#otp1").val().trim()
    var otp2 = $(this).val().trim();

    display("#otp-error-1",otp2 == "")
    display("#otp-error-2",(otp2 != "" && otp1!=otp2))
    enable("#submit_button", (otp2 == "" || otp1!=otp2))
});

$("#id_password1").keyup(function () {
    var password = $(this).val().trim();

    $.ajax({
        url: '../ajax/validate_password/',
        data: {
            'password': password
        },
        dataType: 'json',
        success: function (data) {
            display("#password-error-1",password == "")
            display("#password-error-2", data.upper_case_alphabet)
            display("#password-error-3", data.lower_case_alphabet)
            display("#password-error-4", data.digit)
            display("#password-error-5", data.special_character)
            display("#password-error-6", data.length)
        }
    });

    match()
});

$("#id_password2").keyup(function () {
    var password = $(this).val().trim();

    display("#password2-error-1",password == "")

    match()
});

function display(id, boolean) {
    if (boolean) {
        $(id).css("display", "block");
    } else {
        $(id).css("display", "none");
    }
}

function enable(id, boolean){
    $(id).prop('disabled',boolean)
}

function match(){
    var password1 = $("#id_password1").val().trim();
    var password2 = $("#id_password2").val().trim();

    display("#password2-error-2",(!(password1 == "" || password2=="") && password1!=password2))
    enable("#submit",(password1 == "" || password2=="" || password1!=password2))
}
