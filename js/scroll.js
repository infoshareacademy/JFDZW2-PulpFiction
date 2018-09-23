window.onload = loadEvents

function loadEvents() {
    var target = document.getElementsByClassName('u-nav__button-return');
    target[0].style.visibility = "hidden";
    target[0].style.opacity = 0;

    window.addEventListener("scroll", function () {
        var target = document.getElementsByClassName('u-nav__button-return');
        if (window.pageYOffset > 100) {
            target[0].style.visibility = "visible";
            target[0].style.opacity = 1;
        } else if (window.pageYOffset < 100) {
            target[0].style.visibility = "hidden";
            target[0].style.opacity = 0;
        }
    }, false);


    var target1 = document.getElementsByClassName('u-nav__button-return');
    target1[0].addEventListener("click", function () {
        scroll("hero");
    }, false);

}

//function isIE() {
//    const userAgent = navigator.userAgent;
//    const regex = /(Trident|MSIE)/;
//    return regex.test(userAgent);
//}


function scrollToElement(element) {
    var elmnt = document.getElementById(element);

    console.log(elmnt);
    var top = elmnt.getBoundingClientRect().top;

    var currentPos = window.pageYOffset;

    var offsetElement = document.getElementsByClassName("c-header");
    var offset = offsetElement[0].offsetHeight;

    var dest = currentPos + top - offset;
    var i = 10;
    var int = setInterval(function () {
        window.scrollTo(0, i);
        i += 10;
        if (i >= dest) clearInterval(int);
    }, 20);

}

