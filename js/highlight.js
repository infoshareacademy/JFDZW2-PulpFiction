const product_elem = document.getElementById("about");
const hero_elem = document.getElementById("hero");
const contact_elem = document.getElementById("contact");
const creators_elem = document.getElementById("creators");
const contact_nav = document.getElementById("contact_nav");
const creators_nav = document.getElementById("creators_nav");
const product_nav = document.getElementById("product_nav");

window.addEventListener("scroll", function () {
    if (window.scrollY < hero_elem.scrollHeight/2) {
        clearHightlight();
    } else if (window.scrollY < (hero_elem.scrollHeight + product_elem.scrollHeight/2)) {
        clearHightlight();
        product_nav.classList.add("c-menu__item--hightlight");
    } else if (window.scrollY < (hero_elem.scrollHeight + product_elem.scrollHeight + contact_elem.scrollHeight/2)) {
        clearHightlight();
        contact_nav.classList.add("c-menu__item--hightlight");
    } else {
        clearHightlight();
        creators_nav.classList.add("c-menu__item--hightlight");
    }
}, false);

function clearHightlight() {
    contact_nav.classList.remove("c-menu__item--hightlight");
    product_nav.classList.remove("c-menu__item--hightlight");
    creators_nav.classList.remove("c-menu__item--hightlight");

}