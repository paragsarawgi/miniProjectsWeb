const imageInput = document.getElementById("choose-img");
const placeholder = document.querySelector(".placeholder");
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("reset-btn");
const downloadBtn = document.getElementById("download-btn");

// start editing button
const startBtn = document.querySelector(".start-btn");
const homeSection = document.querySelector(".home");
const mainSection = document.querySelector("main");
startBtn.addEventListener("click", () => {
    // scroll to main section
    mainSection.scrollIntoView({ behavior: "smooth" });
});
// sliders
const brightnessSlider = document.querySelector(
    'input[name="brightness"]'
);
const contrastSlider = document.querySelector(
    'input[name="contrast"]'
);
const saturationSlider = document.querySelector(
    'input[name="saturation"]'
);
const exposureSlider = document.querySelector(
    'input[name="exposure"]'
);
const hueRotationSlider = document.querySelector(
    'input[name="hueRotation"]'
);
const opacitySlider = document.querySelector(
    'input[name="opacity"]'
);
const blurSlider = document.querySelector(
    'input[name="blur"]'
);
const sepiaSlider = document.querySelector(
    'input[name="sepia"]'
);
const invertSlider = document.querySelector(
    'input[name="invert"]'
);
// stores original uploaded image
let currentImage = null;

// apply filters and redraw image
function applyFilters() {
    // if no image uploaded, stop
    if (!currentImage) return;
    // clear old canvas drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // apply brightness filter
    ctx.filter = `brightness(${brightnessSlider.value}%)
                contrast(${contrastSlider.value}%)
                saturate(${saturationSlider.value}%)
                brightness(${exposureSlider.value}%)
                hue-rotate(${hueRotationSlider.value}deg)
                opacity(${opacitySlider.value}%)
                blur(${blurSlider.value}px)
                sepia(${sepiaSlider.value}%)
                invert(${invertSlider.value}%)`
;
    // redraw image with filter
    ctx.drawImage(currentImage, 0, 0);
}

// choose image and display on canvas
imageInput.addEventListener("change", (event) => {
    // get uploaded file
    const file = event.target.files[0];
    // if no file selected
    if (!file) return;
    // create image object
    currentImage = new Image();
    // convert file into temporary URL
    currentImage.src = URL.createObjectURL(file);
    // wait for image to load
    currentImage.onload = () => {
        // hide placeholder
        placeholder.style.display = "none";
        // show canvas
        canvas.hidden = false;
        // set canvas size equal to image size
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        // draw image initially
        applyFilters();
    };
});

// for live update
brightnessSlider.addEventListener("input", applyFilters);
contrastSlider.addEventListener("input", applyFilters);
saturationSlider.addEventListener("input", applyFilters);
exposureSlider.addEventListener("input", applyFilters);
hueRotationSlider.addEventListener("input", applyFilters);
opacitySlider.addEventListener("input", applyFilters);
blurSlider.addEventListener("input", applyFilters);
sepiaSlider.addEventListener("input", applyFilters);
invertSlider.addEventListener("input", applyFilters);

// reset button
resetBtn.addEventListener("click", () => {
    // hide canvas
    canvas.hidden = true;
    // show placeholder
    placeholder.style.display = "flex";
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // reset file input
    imageInput.value = "";
    // remove stored image
    currentImage = null;
    // reset brightness slider
    brightnessSlider.value = 100;
    // reset contrast slider
    contrastSlider.value = 100;
    // reset saturation slider
    saturationSlider.value = 100;
    // reset exposure slider
    exposureSlider.value = 100;
    // reset hue rotation slider
    hueRotationSlider.value = 0;
    // reset opacity slider
    opacitySlider.value = 100;
    // reset blur slider
    blurSlider.value = 0;
    // reset sepia slider
    sepiaSlider.value = 0;
    // reset invert slider
    invertSlider.value = 0;
});

// download button
downloadBtn.addEventListener("click", () => {
    // stop if no image uploaded
    if (!currentImage) return;
    // create temporary anchor tag
    const link = document.createElement("a");
    // convert canvas to downloadable image
    link.href = canvas.toDataURL("image/png");
    // file name
    link.download = "editedImage.png";
    // trigger automatic download
    link.click();
});