var elemList = document.getElementsByClassName("c-box");
elemList[0].addEventListener("click", function () { setNthBox(0); });
elemList[1].addEventListener("click", function () { setNthBox(1); });
elemList[2].addEventListener("click", function () { setNthBox(2); });
elemList[3].addEventListener("click", function () { setNthBox(3); });

var boxList = document.getElementsByClassName("c-flexbox-product__box");
var arrowList = document.getElementsByClassName("c-flexbox-product__arrow");
arrowList[0].addEventListener("click", function () { clearBox() });
arrowList[1].addEventListener("click", function () { clearBox(); });
arrowList[2].addEventListener("click", function () { clearBox(); });
arrowList[3].addEventListener("click", function () { clearBox(); });

window.onload = clearBox();

function clearBox() {
    for (let i = 0; i < boxList.length; i++) {
        boxList[i].style.display = "none";
    }
}

function setNthBox(value) {

    clearBox();

    boxList[value].style.display = "flex";
}
