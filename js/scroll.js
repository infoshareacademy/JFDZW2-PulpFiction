
function scroll(element) {
    var elmnt = document.getElementById(element);
    var domRect = elmnt.getBoundingClientRect();
    var top = domRect.top;
   // window.scrollTo({
   //     top: top,
   //     behavior: "smooth"
   // });
    //elmnt.scrollIntoView({ behavior: "smooth" });
}




// // add event listener on load
// window.addEventListener('load', function () {

//     // scroll into view
//     document.querySelector('.js-scroll-into-hello').addEventListener('click', function (e) {
//         e.preventDefault();
//         document.querySelector('.hello').scrollIntoView({ behavior: 'smooth' });
//     });

// });
