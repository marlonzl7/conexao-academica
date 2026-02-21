const menu_header = document.getElementById("menu");

function resTablet() {
    if (window.innerWidth >= 768) {
        menu_header.style.display = "";
    }
}

function menu() {
    if (menu_header.style.display === "block") {
        menu_header.style.display = "";
    } else {
        menu_header.style.display = "block";
    }
}

window.addEventListener("resize", resTablet);
