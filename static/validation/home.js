$("#room_code").keyup(function () {
    var room_code = $(this).val().trim();
    
    $.ajax({
        url: '../ajax/validate_roomcode/',
        data: {
            'roomcode': room_code
        },
        dataType: 'json',
        success: function (data) {
            display("#roomcode-error-1", data.length)
            display("#roomcode-error-2",data.special_character)
            enable ("#submit",data.length || data.special_character)
        }
    });
});    