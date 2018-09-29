var home=document.querySelector('[data-language="home"]');
var footerList= document.getElementsByClassName("c-footer__list").item(0).children;
var follow_us=document.querySelector('[data-language="follow_us"]');
var cancel=document.querySelector('[data-language="cancel"]');
var cookies=document.querySelector('[data-language="cookies"]');
var contact=document.querySelectorAll('[data-language="contact"]');
var team=document.querySelectorAll('[data-language="team"]');
var product=document.querySelector('[data-language="product"]');
var project=document.querySelector('[data-language="project"]');
var follow=document.querySelector('[data-language="follow"]');
var daniel=document.querySelector('[data-language="daniel"]');
var michal=document.querySelector('[data-language="michal"]');
var maria=document.querySelector('[data-language="maria"]');
var aneta=document.querySelector('[data-language="aneta"]');
var kuba=document.querySelector('[data-language="kuba"]');


var flags=document.getElementsByClassName("c-header__flag--img");

addOnload(flagChanger);

flags.item(0).addEventListener("click",flagChanger);
flags.item(1).addEventListener("click",flagChanger);




function addOnload(newFunction){
  var oldOnload=window.onload;

  if(typeof oldOnload =="function"){
    window.onload=function(){
      if(oldOnload){
        oldOnload();
      }
      newFunction();
    }
  }else{
    window.onload=newFunction();
  }
}

function flagChanger(){
if(flags.item(1).classList.contains("u-hidden")){

  flags.item(1).classList.remove("u-hidden");
  flags.item(0).classList.add("u-hidden");
  changeLanguage(flags.item(0).alt);

}else{

  flags.item(0).classList.remove("u-hidden");
  flags.item(1).classList.add("u-hidden");
  changeLanguage(flags.item(1).alt);

}
}

function changeLanguage(language){
    var ourRequest = new XMLHttpRequest();
    ourRequest.open("GET", "js/translator.json");
    ourRequest.onload = function() {
      if (ourRequest.status >= 200 && ourRequest.status < 400) {
        var ourData = JSON.parse(ourRequest.responseText);
        renderHTML(ourData, language);
      } else {
        console.log("We connected to the server, but it returned an error.");
      }

    };

    ourRequest.onerror = function() {
      console.log("Connection error");
    };
  
    ourRequest.send();
    
}

function renderHTML(data, language){
    
    home.innerHTML=data[language]["home"]
    product.innerHTML=data[language]["product"];
    team[0].innerHTML=data[language]["team"];
    team[1].innerHTML=data[language]["team"];
    team[2].innerHTML=data[language]["team"];
    contact[0].innerHTML=data[language]["contact"];
    contact[1].innerHTML=data[language]["contact"];
    project.innerHTML=data[language]["project"];
    follow.innerHTML=data[language]["follow"];
    follow_us.innerHTML=data[language]["takeInfo"];
    cookies.innerHTML=data[language]["cookies"];
    cancel.innerHTML=data[language]["cancel"];
    daniel.innerHTML=data[language]["daniel"];
    michal.innerHTML=data[language]["michal"];
    maria.innerHTML=data[language]["maria"];
    aneta.innerHTML=data[language]["aneta"];
    kuba.innerHTML=data[language]["kuba"];

}