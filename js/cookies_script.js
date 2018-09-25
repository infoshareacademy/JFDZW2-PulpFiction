
document.getElementsByTagName("body").onload = cookiesFunction();

document.getElementById("close_cookies_link").addEventListener("click", cookiesHidden);


function cookiesFunction() {
    if (sessionStorage.getItem("cookies")) {
        var element = document.getElementById("cookies_info_container");
        element.classList.add("u-hidden");
    }
    else {
        sessionStorage.setItem("cookies", "true");
    }
}

function cookiesHidden() {
    var object = document.getElementById("cookies_info_container");
    object.classList.toggle("u-fadeout");

}


