
var reloaded = false;
var canvas = document.getElementById("my-canvas")

// Download the image
// help gotten from
// https://jsfiddle.net/V6ufG/729/
var savedCanvas = document.getElementById("download"); // find the saveAsbutton
savedCanvas.addEventListener('click', function (ev) {
    savedCanvas.href = canvas.toDataURL();
    savedCanvas.download = "myPaint.png";

}, false);

// Save the image
// help gotten from
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
document.getElementById("saveButton").onclick =
    function () {
        console.dir(canvas);
        console.log("saveButton clicked");
        localStorage.setItem(canvas, canvas.toDataURL());
        reloaded = false;
    };

// check if page has been reloaded
// help gotten from
// https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript

//check for Navigation Timing API support
if (window.performance) {
    console.info("window.performance works fine on this browser");
  }
    if (performance.navigation.type == 1) {
      reloaded = true;
    }

// Load image
// help gotten from
// https://stackoverflow.com/questions/20507534/how-to-save-and-load-html5-canvas-to-from-localstorage
var dataURL = localStorage.getItem(canvas);
var getImg = new Image;
document.getElementById("loadButton").onclick =
    function () {
        if (reloaded) {
            getImg.src = dataURL;
            getImg.onload = function () {
                drawio.context.drawImage(getImg, 0,0);
                console.dir("getImg:" + getImg);
            };
            console.log(drawio.shapes);

        } else {
            alert("Refresh the page")
        }
    };
