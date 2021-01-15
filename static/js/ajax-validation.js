$("#id_first_name").keyup(function () {
    var firstname = $(this).val().trim();
    display("#firstname-error-1", firstname=="")
});

$("#id_last_name").keyup(function () {
    var lastname = $(this).val().trim();
    display("#lastname-error-1", lastname == "")
});

$("#id_email").keyup(function () {
    var email = $(this).val().trim();

    $.ajax({
        url: '../ajax/validate_email/',
        data: {
            'email': email
        },
        dataType: 'json',
        success: function (data) {
            display("#email-error-1", email == "")
            display("#email-error-2", data.invalid)
        }
    });
});

$("#id_username").keyup(function () {
    var username = $(this).val().trim();

    $.ajax({
        url: '../ajax/validate_username/',
        data: {
            'username': username
        },
        dataType: 'json',
        success: function (data) {
            display("#username-error-1", username=="")
            display("#username-error-2", data.is_taken)
            display("#username-error-3", data.alphabet)
            display("#username-error-4", data.digit)
            display("#username-error-5", data.length)
        }
    });
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

function match(){
    var password1 = $("#id_password1").val().trim();
    var password2 = $("#id_password2").val().trim();

    display("#password2-error-2",(!(password1 == "" || password2=="") && password1!=password2))
}

$("#otp2").keyup(function () {
    var otp1 = $("#otp1").val().trim()
    var otp2 = $(this).val().trim();

    display("#otp-error-1",otp2 == "")
    display("#otp-error-2",(otp2 != "" && otp1!=otp2))
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