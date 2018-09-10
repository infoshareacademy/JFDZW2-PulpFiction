
function scroll(element) {
    var elmnt = document.getElementById(element);
    var domRect = elmnt.getBoundingClientRect();
    var top = domRect.top;
    var currentPos = window.pageYOffset;
    window.scrollTo({
        top: currentPos + top,
        left: 0,
        behavior: "smooth"
    });
}
