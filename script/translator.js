var selector= document.getElementById('lang');
var menu=document.getElementById("id_menu").children;
var home=document.querySelector('[data-language="home"]');
var footerList= document.getElementsByClassName("c-footer__list").item(0).children;
var follow_us=document.querySelector('[data-language="follow_us"]');



selector.addEventListener("change",function(){
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'script/translator.json');
    ourRequest.onload = function() {
      if (ourRequest.status >= 200 && ourRequest.status < 400) {
        var ourData = JSON.parse(ourRequest.responseText);
        renderHTML(ourData, selector.options[selector.selectedIndex].value);
      } else {
        console.log("We connected to the server, but it returned an error.");
      }

    };

    ourRequest.onerror = function() {
      console.log("Connection error");
    };
  
    ourRequest.send();
    
})

function renderHTML(data, language){
    console.log(footerList);
    menu[0].children.item(0).innerHTML=data[language]["home"]
    menu[1].children.item(0).innerHTML=data[language]["product"];
    menu[2].children.item(0).innerHTML=data[language]["team"];
    menu[3].children.item(0).innerHTML=data[language]["contact"];

    footerList[0].children.item(0).innerHTML=data[language]["project"];
    footerList[1].children.item(0).innerHTML=data[language]["follow"];
    footerList[2].children.item(0).innerHTML=data[language]["contact"];
    footerList[3].children.item(0).innerHTML=data[language]["team"];
    follow_us.innerHTML=data[language]["takeInfo"];
}