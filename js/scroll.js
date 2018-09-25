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
        scrollToElement("hero");
    }, false);


    var myNav = document.getElementById('mynav');
    var myMenu = document.getElementById('id_menu');
    window.addEventListener("scroll", function () {
        if (window.pageYOffset >= 100) {
            myNav.classList.add("c-header__small");
            myMenu.classList.add('c-menu__small');
        } else {
            myNav.classList.remove("c-header__small");
            myMenu.classList.remove('c-menu__small');
        }
    }, false);
}

function searchChromeVersion() {
    if (isChrome()) {
        const userAgent = navigator.userAgent;
        const chromeVersionSubs1 = userAgent.substr(userAgent.search(/(Chrome\/)/) + 7, userAgent.length - userAgent.search(/(Chrome\/)/) - 8);
        return parseInt(chromeVersionSubs1.substr(0, chromeVersionSubs1.search(/\./)));
    }
    return 0;
}

function isChrome() {
    const userAgent = navigator.userAgent;
    const regex = /(Chrome\/)/;
    return regex.test(userAgent) && (!isEdge());
}

function isEdge() {
    const userAgent = navigator.userAgent;
    const regex = /(Edge\/)/;
    return regex.test(userAgent);
}


function isIE() {
    const userAgent = navigator.userAgent;
    const regex = /(Trident|MSIE)/;
    return regex.test(userAgent);
}


const offsetElement = document.getElementsByClassName("c-header");
const offset = offsetElement[0].offsetHeight;

function scrollToElement(element) {
    const elmnt = document.getElementById(element);
    const top = elmnt.getBoundingClientRect().top;
    const currentPos = window.pageYOffset;

    if (isIE() || isChrome() && searchChromeVersion() <= 62) {
        const dest = currentPos + top - offset;
        let i = currentPos;
        const step = (dest - currentPos) / 100;
        let int = setInterval(function () {
            window.scrollTo(0, i);
            i += step;
            if (step > 0 && i >= dest || step < 0 && i <= dest) clearInterval(int);
        }, 1);
    } else {
        window.scrollTo({
            top: currentPos + top - offset,
            left: 0,
            behavior: "smooth"
        });
    }
}