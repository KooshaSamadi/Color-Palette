class paletteColor {
  constructor() {
    this.colorDivs = document.querySelectorAll(".column");
    this.initialColors;
  }
  paletteLoop() {
    this.initialColors = [];
    this.colorDivs.forEach((div) => {
      const hextext = div.children[0];
      const color = this.generateHex();
      //Add it to the array

      this.initialColors.push(chroma(color).hex());

      this.checkTextContrastLoad(color, hextext, div.children);
      //Add color to bg and text to hex
      div.style.backgroundColor = color;
      hextext.innerText = color;
      // const col = chroma(color);
      const sliders = div.querySelectorAll(".adjustment-panel input");
      const hue = sliders[0];
      const brightness = sliders[1];
      const saturation = sliders[2];
      this.colorizeSliders(color, hue, brightness, saturation);
    });
    this.resetInput();
  }
  generateHex() {
    const hexColor = chroma.random();
    return hexColor;
  }
  //if bg is white chnage text color
  checkTextContrastbyInput(color, hextext, icons) {
    const contrast = chroma.contrast(color, "white");
    if (contrast < 1.7) {
      hextext.style.color = "black";
      icons[0].style.backgroundImage = "url(../Images/slider_60pxblack.png)";
    }
    if (contrast > 4.5) {
      hextext.style.color = "white";
      icons[0].style.backgroundImage = " url(../Images/slider_60px.png)";
    }
  }
  checkTextContrastLoad(color, hextext, divchild) {
    const contrast = chroma.contrast(color, "white");
    const spans = divchild[1].querySelectorAll(".controls span");
    if (contrast < 1.7) {
      hextext.style.color = "black";
      spans[0].style.backgroundImage = "url(../Images/slider_60pxblack.png)";
    }
    if (contrast > 4.5) {
      hextext.style.color = "white";
      spans[0].style.backgroundImage = " url(../Images/slider_60px.png)";
    }
    //console.log(spans);
  }
  colorizeSliders(color, hue, brightness, saturation) {
    //saturation
    const nosat = color.set("hsl.s", 0);
    const fullsat = color.set("hsl.s", 1);
    const satscale = chroma.scale([nosat, color, fullsat]);
    //brightness
    const midBright = color.set("hsl.l", 0.5);
    const brightscale = chroma.scale(["white", midBright, "black"]);
    saturation.style.backgroundImage = `linear-gradient(to right,${satscale(
      0
    )},${satscale(1)})`;

    brightness.style.backgroundImage = `linear-gradient(to left,${brightscale(
      0
    )},${midBright},${brightscale(1)})`;
    //Hue
    hue.style.backgroundImage =
      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";
  }
  hbsChnage(e) {
    const palCol = new paletteColor();
    const bgcolor = e.target.parentElement.parentElement.querySelector("h2")
      .innerText;
    // const index =
    //   e.target.getAttribute("data-hue") ||
    //   e.target.getAttribute("data-sat") ||
    //   e.target.getAttribute("data-bright");
    let inputs = e.target.parentElement.querySelectorAll("input[type=range]");
    const hue = inputs[0];
    const bright = inputs[1];
    const sat = inputs[2];
    let changedcolor = chroma(bgcolor)
      .set("hsl.h", hue.value)
      .set("hsl.s", sat.value)
      .set("hsl.l", bright.value);

    this.parentElement.style.backgroundColor = changedcolor;
    palCol.colorizeSliders(changedcolor, hue, bright, sat);
  }
  updateText(index) {
    const activeDiv = this.colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const hextext = activeDiv.querySelector("h2");
    //Get Controls Icons For adjusting their colors with bgcolor
    const icons = activeDiv.querySelectorAll(".controls span");
    this.checkTextContrastbyInput(color, hextext, icons);
    hextext.innerText = color;
  }
  resetInput() {
    const sliders = document.querySelectorAll(".adjustment-panel input");
    sliders.forEach((slider) => {
      switch (slider.name) {
        case "hue":
          const huecolor = this.initialColors[slider.getAttribute("data-hue")];
          const huevalue = chroma(huecolor).hsl()[0];
          slider.value = huevalue;
          break;
        case "saturation":
          const satcolor = this.initialColors[slider.getAttribute("data-sat")];
          const satvalue = chroma(satcolor).hsl()[1];
          slider.value = satvalue;
          break;
        case "brightness":
          const brightcolor = this.initialColors[
            slider.getAttribute("data-bright")
          ];
          const brightvalue = chroma(brightcolor).hsl()[2];
          slider.value = brightvalue;
          break;

        default:
          console.log("Line 126");
          break;
      }
    });
  }
}

// Global Selectors and Variables
const palCol = new paletteColor();
const slider = document.querySelectorAll(".adjustment-panel");
const currentHexes = document.querySelectorAll(".column h2");
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjustBtn = document.querySelectorAll(".close-adjustment");
const btnGenerate = document.querySelector(".btn-generate");

//EventListners
slider.forEach((slide) => {
  slide.addEventListener("input", palCol.hbsChnage);
});
palCol.colorDivs.forEach((div, index) => {
  div.addEventListener("input", () => {
    palCol.updateText(index);
  });
});
//Copy to clipboard
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex.innerText);
  });
});
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});
adjustBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});
closeAdjustBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});
btnGenerate.addEventListener("click", () => {
  palCol.paletteLoop();
});

//Functions

function copyToClipboard(hex) {
  let inputElement = document.createElement("input");
  inputElement.setAttribute("value", hex);
  document.body.appendChild(inputElement);
  inputElement.select();
  const x=document.execCommand("copy");
  console.log(x);
  document.body.removeChild(inputElement);
  //Pop up animation
  const popupBox = popup.children[0];

  popup.classList.add("active");
  popupBox.classList.add("active");
}
function openAdjustmentPanel(index) {
  slider[index].classList.toggle("active");
}
function closeAdjustmentPanel(index) {
  slider[index].classList.remove("active");
}

//Webstorage stuff
const saveBtn = document.querySelector(".btnsave");
const submitSave = document.querySelector(".btnsavesubmit");
const closeSave = document.querySelector(".btnclosesave");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".saveinput");
//library
const libraryBtn = document.querySelector(".btn-library");
const closeLibrary = document.querySelector(".btn-library-close");
const libraryContainer = document.querySelector(".library-container");
const btnDelete = document.querySelector(".btn-library-remove");
//For storing all needed data for webstorage
let savedPalette = [];

saveBtn.addEventListener("click", () => {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
});
libraryBtn.addEventListener("click", () => {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
});
btnDelete.addEventListener("click", () => {
  removefromlocalst();
});
closeSave.addEventListener("click", closeSaveContainer);
closeLibrary.addEventListener("click", closeLibraryContainer);
submitSave.addEventListener("click", submitSaveContainer);
function closeSaveContainer() {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}
function closeLibraryContainer() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}
function removefromlocalst() {
  let paletteobj;

  paletteobj = JSON.parse(localStorage.getItem("palettes"));
  if (paletteobj != null) {
    localStorage.removeItem("palettes");
    location.reload();
  }
}
function submitSaveContainer() {
  if (saveInput.value != "") {
    closeSaveContainer();
    const name = saveInput.value;
    const color = [];
    currentHexes.forEach((hex) => {
      color.push(hex.innerText);
    });
    let paletteNr;
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    if (paletteObjects) {
      paletteNr = paletteObjects.length;
    } else {
      paletteNr = savedPalette.length;
    }
    //Generate Object
    const paletteObj = { name, color, nr: paletteNr };
    savedPalette.push(paletteObj);
    //save to local storage
    savetoLocal(paletteObj);
    saveInput.value = "";
    //generate palette for library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("preview");
    const btnSelect = document.createElement("button");
    btnSelect.innerText = "Select";
    btnSelect.classList.add("selectPalette");
    btnSelect.classList.add(paletteObj.nr);
    btnSelect.addEventListener("click", (event) => {
      closeLibraryContainer();
      const smallIndex = event.target.classList[1];
      initialColors = [];
      savedPalette[smallIndex].color.forEach((color, index) => {
        initialColors.push(color);
        palCol.colorDivs[index].style.backgroundColor = color;
        palCol.colorDivs[index].children[0].innerText = color;
        const div = palCol.colorDivs[index];
        checkContrast(color, div);
      });
      palCol.resetInput();
    });
    paletteObj.color.forEach((obj) => {
      const smallColor = document.createElement("div");
      smallColor.style.backgroundColor = obj;
      preview.appendChild(smallColor);
    });
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(btnSelect);

    libraryContainer.children[0].appendChild(palette);
  } else alert("Enter the palette's name please!!");
}
function checkContrast(text, div) {
  var color = chroma(text);
  const contrast = chroma.contrast(color, "white");
  const icon = div.children[1].querySelector(".center");
  if (contrast < 1.7) {
    div.children[0].style.color = "black";
    icon.style.backgroundImage = "url(../Images/slider_60pxblack.png)";
  } else {
    div.children[0].style.color = "white";
    icon.style.backgroundImage = " url(../Images/slider_60px.png)";
  }
}
function savetoLocal(paletteObj) {
  //Check if we have sth in localstorage
  let localPalette;
  if (localStorage.getItem("palettes") == null) {
    localPalette = [];
  } else {
    localPalette = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalette.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalette));
}
function getFromLocal() {
  let localPalette;
  if (localPalette == null) {
    localPalette = [];
  } else {
    localPalette = JSON.parse(localStorage.getItem("palettes"));
    savedPalette = [...localPalette];
    localPalette.forEach((paletteObj) => {
      //generate palette for library
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("preview");
      const btnSelect = document.createElement("button");
      btnSelect.innerText = "Select";
      btnSelect.classList.add("selectPalette");
      btnSelect.classList.add(paletteObj.nr);
      btnSelect.addEventListener("click", (event) => {
        closeLibraryContainer();
        const smallIndex = event.target.classList[1];
        initialColors = [];
        paletteObj.color.forEach((color, index) => {
          initialColors.push(color);
          palCol.colorDivs[index].style.backgroundColor = color;
          palCol.colorDivs[index].children[0].innerText = color;
          const div = palCol.colorDivs[index];
          checkContrast(color, div);
        });
        palCol.resetInput();
      });
      paletteObj.color.forEach((obj) => {
        const smallColor = document.createElement("div");
        smallColor.style.backgroundColor = obj;
        preview.appendChild(smallColor);
      });
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(btnSelect);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}
palCol.paletteLoop();
window.addEventListener("DOMContentLoaded", (event) => {
  getFromLocal();
});
