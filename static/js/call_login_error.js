$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search)
    let roomId = searchParams.get('roomId')
    
    if(roomId==null){        
        $("a").attr("href", "/login/?next=/join/user-preferences");
    }
    else{
        $("a").attr("href", "/login/?next=/join/user-preferences&roomId="+roomId);
    }
});