import pdfjsLib from "pdfjs-dist";
import reboot from 'bootstrap/dist/css/bootstrap-reboot.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf-worker.js";

var pdfPath = "example.pdf";

// Loading a document.
const resolution = window.devicePixelRatio; // 1 should be enough here?
var loadingTask = pdfjsLib.getDocument(pdfPath);
loadingTask.promise.then(function (pdfDocument) {
    // Request a first page
    return pdfDocument.getPage(1).then(function (pdfPage) {
      // Display page on the existing canvas with 100% scale.
      var viewport = pdfPage.getViewport({ scale: 1 });
      var canvas = document.getElementById("slide");
      canvas.width = resolution*canvas.clientWidth;
      canvas.height = resolution*canvas.clientHeight;
      var ctx = canvas.getContext("2d");
      var renderTask = pdfPage.render({
        canvasContext: ctx,
        viewport: pdfPage.getViewport({ scale: canvas.width / viewport.width }),
      });
      return renderTask.promise;
    });
  })
  .catch(function (reason) {
    console.error("Error: " + reason);
  });

// super hacky drawing implementation
// drawing should really be taken off the event handler.
let slide = document.getElementById("slide");
let ctx = slide.getContext("2d");
function draw(e){
	console.log(e.pressure);
	ctx.lineWidth = e.pressure*10*resolution;
	ctx.lineJoin = 'round';
	ctx.lineCap = "round";
	ctx.lineTo(resolution*e.offsetX, resolution*e.offsetY);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(resolution*e.offsetX, resolution*e.offsetY);
}
slide.onpointerdown = function(e){
	console.log("down", e);
	slide.onpointermove = draw;
	slide.setPointerCapture(e.pointerId);
	ctx.beginPath();
	ctx.moveTo(resolution*e.offsetX, resolution*e.offsetY);
}
slide.onpointerup = function(e){
	console.log("up", e);
	slide.onpointermove = null;
	slide.releasePointerCapture(e.pointerId);
}

/*
function logEvents(el){
	var i = 0;
	[
	    'pointerover',
	    'pointerenter',
	    'pointerdown',
	    //'pointermove',
	    'pointerup',
	    'pointercancel',
	    'pointerout',
	    'pointerleave',
	    'gotpointercapture',
	    'lostpointercapture',
	].forEach((ev) => {
		el.addEventListener(ev, (event) => {
			console.warn(ev, event);
			i = 0;
		})
	})
	el.addEventListener("pointermove", (event) => {
		i++;
		if(i<3)
			console.debug("pointermove", event);
	});
}
logEvents(document.getElementById("slide"))
*/