window.onload=cookiesFunction();

var element = document.getElementById('close_cookies_link');
element.addEventListener("click", cookiesFunction);


function cookiesFunction(){
if(localStorage.getItem('cookies')!=null)
{
    var element = document.getElementById('cookies_info_container');
    element.classList.add('u-hidden');
}else{
    
}

}

function cookiesHidden(){
    var s = document.getElementById('cookies_info_container').style;
s.opacity = 1;
(function fade(){(s.opacity-=.1)<0?s.display="none":setTimeout(fade,40)})();
}


