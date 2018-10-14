window.onload = loadEvents


function loadEvents() {
    var target = document.getElementsByClassName("u-nav__button-return");
    if (window.pageYOffset < 100) {
        if (!target[0].classList.contains("u-fadeout")) {
            target[0].classList.add("u-fadeout");
        }
    }

    window.addEventListener("scroll", function () {
        if (window.pageYOffset > 100) {
            if (target[0].classList.contains("u-fadeout")) {
                target[0].classList.remove("u-fadeout");
            }
        } else if (window.pageYOffset < 100) {
            if (!target[0].classList.contains("u-fadeout")) {
                target[0].classList.add("u-fadeout");
            }
        }
    }, false);

    target[0].addEventListener("click", function () {
        scrollToElement("hero");
    }, false);

    var myNav = document.getElementById("mynav");
    var myMenu = document.getElementById("id_menu");
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
    const dest = currentPos + top - offset;
    const step = Math.sign(dest - currentPos) * 10;
    let destPos = currentPos;

    if (isIE() || isChrome() && searchChromeVersion() <= 62) {
        let int = setInterval(() => {
            destPos += step;
            window.scrollTo(0, destPos);
            if (step > 0 && destPos >= dest ||
                step < 0 && destPos <= dest) {
                clearInterval(int);
            }
        }, 1);
        let event = new Event("scroll");
        window.dispatchEvent(event);
    } else {
        window.scrollTo({
            top: currentPos + top - offset,
            left: 0,
            behavior: "smooth"
        });
    }
}
