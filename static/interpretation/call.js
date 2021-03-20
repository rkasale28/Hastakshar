function capture() {
    isl_enabled = $.cookie("isl_" + username) === "true";

    if (isl_enabled) {
        $("#captions").css("display", "flex");        
        setTimeout(start,1000); 
    } else {
        $("#captions").css("display", "none");
    }
}

function start() {
    var canvas = document.createElement('canvas');

    var div = document.getElementById('reciever-video');
    var video = div.getElementsByTagName("video")[0];

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(blob => {
        const img = new Image();
        img.src = window.URL.createObjectUrl(blob);
    });

    var dataURL = canvas.toDataURL("image/jpeg", 1.0);
    $.ajax({
        type: 'POST',
        url: 'interpret',
        data: {
            'dataURL': dataURL,
            'csrfmiddlewaretoken': getCookie('csrftoken')
        },
        dataType: 'json',
        success: function (data) {
            isl_enabled = $.cookie("isl_" + username) === "true";

            if (isl_enabled) {
                $("#captions").html(data.caption)
            }
        },
        complete:function(data){
            isl_enabled = $.cookie("isl_" + username) === "true";

            if (isl_enabled) {
                setTimeout(start(),1000);
            }
        }
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
