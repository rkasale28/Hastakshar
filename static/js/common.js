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
