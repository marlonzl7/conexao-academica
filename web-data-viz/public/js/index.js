const menu_header = document.getElementsByClassName("menu-header");

function menu(){
    for (let i = 0; i < menu_header.length; i++) {
        if(menu_header[i].style.display == "block"){
            menu_header[i].style.display = "none";
        }else{
            menu_header[i].style.display = "block";
        }
    }
}