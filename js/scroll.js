function loadEvents() {
    window.addEventListener("scroll", function () {
        var target = document.getElementsByClassName('u-nav__button-return');
        if (window.pageYOffset > 100) {
            target[0].style.visibility = "visible";
            target[0].style.opacity = 0.8;
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


function scroll(element) {
    var elmnt = document.getElementById(element);
    var top = elmnt.getBoundingClientRect().top;

    var currentPos = window.pageYOffset;

    var offsetElement = document.getElementsByClassName("u-dummy");
    var offset = offsetElement[0].offsetHeight;
    window.scrollTo({
        top: currentPos + top - offset,
        left: 0,
        behavior: "smooth"
    });
}