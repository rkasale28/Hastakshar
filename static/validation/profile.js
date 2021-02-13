$("#id_email").keyup(function () {
    var email = $(this).val().trim();
    var username = $("#username").val().trim();
    var bool;

    $.ajax({
        url: '../ajax/validate_reset_email/',
        data: {
            'username': username,
            'email': email
        },
        dataType: 'json',
        success: function (data) {
            display("#email-error-1", email == "")
            display("#email-error-2", data.invalid)
            display("#email-error-3", data.same)

            bool = email == "" || data.invalid || data.same
            enable("#otp_button", bool)
        }
    });
});

$("#otp2_1").keyup(function () {
    var otp1 = $("#otp1_1").val().trim()
    var otp2 = $(this).val().trim();
    
    display("#otp-1-error-1",otp2 == "")
    display("#otp-1-error-2",(otp2 != "" && otp1!=otp2))
    enable("#submit_1", (otp2 == "" || otp1!=otp2))
});
