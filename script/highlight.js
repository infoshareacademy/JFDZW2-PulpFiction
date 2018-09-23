var product_elem=document.getElementById("about");//.getBoundingClientRect();
var hero_elem=document.getElementById("hero");//.getBoundingClientRect();
var contact_elem=document.getElementById("contact");//.getBoundingClientRect();
var creators_elem=document.getElementById("creators");//.getBoundingClientRect();
var contact_nav=document.getElementById("contact_nav");
var home_nav=document.getElementById("home_nav");
var creators_nav=document.getElementById("creators_nav");
var product_nav=document.getElementById("product_nav");

window.onscroll=function(){scrollingPage()};

function scrollingPage(){

    if(window.scrollY<hero_elem.scrollHeight){
        clearHightlight();
        home_nav.classList.add("c-menu__item--hightlight");


    }else if(window.scrollY<(hero_elem.scrollHeight+product_elem.scrollHeight)) {

        clearHightlight();
        product_nav.classList.add("c-menu__item--hightlight");

    }else if(window.scrollY<(hero_elem.scrollHeight+product_elem.scrollHeight+contact_elem.scrollHeight)){

        clearHightlight();
        contact_nav.classList.add("c-menu__item--hightlight");

    }else{

        clearHightlight();
        creators_nav.classList.add("c-menu__item--hightlight");


    }

   // setTimeout('scrollingPage()',100);
}

function clearHightlight(){
    contact_nav.classList.remove("c-menu__item--hightlight");
    home_nav.classList.remove("c-menu__item--hightlight");
    product_nav.classList.remove("c-menu__item--hightlight");
    creators_nav.classList.remove("c-menu__item--hightlight");

}
