var sliderImages = document.getElementsByClassName("c-hero__slide"),
  arrowLeft = document.querySelector("#arrow-left"),
  arrowRight = document.querySelector("#arrow-right"),
  current = 1;
  var timer;
  var leftslide, rightslide;

addOnload(slideAutomatic);

  function slideAutomatic(){
    setTimeout('slideRight()',7000);
  }


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


// Clear all images
function reset() {

  for (let i = 0; i < sliderImages.length; i++) {
    sliderImages[i].classList.remove("u-order1");
    sliderImages[i].classList.remove("u-order2");
    sliderImages[i].classList.remove("u-order3");

    if(sliderImages[i].classList.contains("c-hero__slide--edge"))
    {
      sliderImages[i].classList.remove("c-hero__slide--edge");
    }else if(sliderImages[i].classList.contains("c-hero__slide--main"))
    {
      sliderImages[i].classList.remove("c-hero__slide--main");
    }
  }
}

// Show prev
function slideLeft() {
  current--;
  if(current===0){
    current=sliderImages.length;
  }
reset();

for (let i = 0; i < sliderImages.length; i++) {
  var counter=current;
  if((counter+i)>3)
  {
    counter=counter+i-3;
  }
  else{
    counter=counter+i;
  }
  sliderImages[i].classList.add("u-order"+(counter));

  if(sliderImages[i].classList.contains("u-order1") )
  {
    sliderImages[i].classList.add("c-hero__slide--edge");
    leftslide=document.getElementsByClassName("u-order1");
    leftslide[0].addEventListener("click", function() {
      clearTimeout(timer);
   if (current === 0) {
     current = sliderImages.length;
   }
  slideLeft();
  });
  }else if(sliderImages[i].classList.contains("u-order3"))
  {
    sliderImages[i].classList.add("c-hero__slide--edge");
    rightslide=document.getElementsByClassName("u-order3");
    rightslide[0].addEventListener("click", function() {
      clearTimeout(timer);
      if (current === sliderImages.length + 1) {
        current = 1;
      }
  slideRight();
  });
  }
  else if(sliderImages[i].classList.contains("u-order2"))
  {
    sliderImages[i].classList.add("c-hero__slide--main");
  }
}
timer= setTimeout('slideRight()',7000);
}

// Show next
function slideRight() {
  current++;
    // if (current === sliderImages.length - 1) {
    //     current = -1;
    //   }
    if(current===sliderImages.length+1){
      current=1;
    }
  reset();
  
  for (let i = 0; i < sliderImages.length; i++) {
    var counter=current;
    if((counter+i)>3)
    {
      counter=counter+i-3;
    }
    else{
      counter=counter+i;
    }
    sliderImages[i].classList.add("u-order"+(counter));

    if(sliderImages[i].classList.contains("u-order1") || sliderImages[i].classList.contains("u-order3"))
    {
      sliderImages[i].classList.add("c-hero__slide--edge");
    }else if(sliderImages[i].classList.contains("u-order2"))
    {
      sliderImages[i].classList.add("c-hero__slide--main");
    }
  }
  
  timer= setTimeout('slideRight()',7000);
}

// Left arrow click
arrowLeft.addEventListener("click", function() {
    clearTimeout(timer);
   if (current === 0) {
     current = sliderImages.length;
   }
  slideLeft();
});

// Right arrow click
arrowRight.addEventListener("click", function() {
    clearTimeout(timer);
   if (current === sliderImages.length + 1) {
     current = 1;
   }
  slideRight();
});

