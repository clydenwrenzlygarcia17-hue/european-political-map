/* =========================================================================
   EUROPEAN POLITICAL MAP
   ========================================================================= */

/* =========================================================================
   EXPLANATIONS
   ========================================================================= */

const explanations = {
  header: "This interactive map presents the different political systems of countries in Europe. It allows users to explore each country and view its government system and capital.",
  red: "",
  blue: "",
  yellow: "",
  violet: "",
  green: ""
};


/* =========================================================================
   CATEGORY CONFIG
   ========================================================================= */

const categories = {

  red: {
    title: "Authoritarian / Hybrid Regime",
    color: "#fd3f00",
    legendIcon: "assets/l_red.png",
    legendPos: {
      x: 0.0584,
      y: 0.4775
    },
    bbox: [
      0.5718,
      0.0096,
      0.9927,
      0.9325
    ]
  },

  blue: {
    title: "Constitutional Monarchy",
    color: "#1ea0e6",
    legendIcon: "assets/l_blue.png",
    legendPos: {
      x: 0.0584,
      y: 0.3958
    },
    bbox: [
      0.2982,
      0.1325,
      0.7018,
      0.9839
    ]
  },

  yellow: {
    title: "Presidential Republic",
    color: "#e0a028",
    legendIcon: "assets/l_yellow.png",
    legendPos: {
      x: 0.0584,
      y: 0.7190
    },
    bbox: [
      0.2091,
      0.0907,
      0.7064,
      0.9640
    ]
  },

  violet: {
    title: "Semi-Presidential Republic",
    color: "#6e1496",
    legendIcon: "assets/l_violet.png",
    legendPos: {
      x: 0.0568,
      y: 0.6357
    },
    bbox: [
      0.3100,
      0.6257,
      0.4732,
      0.8579
    ]
  },

  green: {
    title: "Parliamentary Republic",
    color: "#2a6e2a",
    legendIcon: "assets/l_green.png",
    legendPos: {
      x: 0.0576,
      y: 0.5590
    },
    bbox: [
      0.2168,
      0.1595,
      0.7000,
      0.9672
    ]
  }

};


/* =========================================================================
   DOM
   ========================================================================= */

let activeCategory = null;
let mapModeActive = false;

const page =
  document.getElementById("page");

const mapFrame =
  document.getElementById("mapFrame");

const basisImg =
  document.getElementById("basisImg");

const mapModeImage =
  document.getElementById("mapModeImage");

const legendWrap =
  document.getElementById("legendHotspots");

const scrim =
  document.getElementById("scrim");

const explainer =
  document.getElementById("explainer");

const explainerDot =
  document.getElementById("explainerDot");

const explainerTitle =
  document.getElementById("explainerTitle");

const explainerBody =
  document.getElementById("explainerBody");

const explainerClose =
  document.getElementById("explainerClose");

const headerTrigger =
  document.getElementById("headerTrigger");

const hitLayer =
  document.getElementById("hitLayer");

const mapModePanel =
  document.getElementById("mapModePanel");

const mapModeClose =
  document.getElementById("mapModeClose");

const mapResetButton =
  document.getElementById("mapResetButton");

const countryHitLayer =
  document.getElementById("countryHitLayer");


/*
   Keep the SVG country-hit layer aligned with the map images.

   The map images use object-fit: contain.
   Therefore the SVG should use the equivalent
   preserveAspectRatio behavior: xMidYMid meet.
*/

if (countryHitLayer) {

  countryHitLayer.setAttribute(
    "preserveAspectRatio",
    "xMidYMid meet"
  );

}


const mapModeTitle =
  mapModePanel
    ? mapModePanel.querySelector(
        ".map-mode-head h2"
      )
    : null;

const mapModeBody =
  mapModePanel
    ? mapModePanel.querySelector(
        ".map-mode-body"
      )
    : null;


/* =========================================================================
   GLOW ELEMENTS
   ========================================================================= */

const glowEls = {};

document
  .querySelectorAll(".glow")
  .forEach(el => {

    glowEls[
      el.dataset.glow
    ] = el;

  });


/* =========================================================================
   LEGEND
   ========================================================================= */

if (legendWrap) {

  Object.entries(categories)
    .forEach(
      ([key, cat]) => {

        const dot =
          document.createElement("button");

        dot.type = "button";

        dot.className =
          "legend-dot";

        dot.style.left =
          `${cat.legendPos.x * 100}%`;

        dot.style.top =
          `${cat.legendPos.y * 100}%`;

        dot.style.color =
          cat.color;

        dot.dataset.category =
          key;

        dot.setAttribute(
          "aria-label",
          cat.title
        );


        /*
           Legend is for reference only.

           It does not open a popup
           or zoom the map.
        */

        dot.addEventListener(
          "click",
          function(e) {

            e.preventDefault();
            e.stopPropagation();

          }
        );


        const tip =
          document.createElement("img");

        tip.src =
          cat.legendIcon;

        tip.alt = "";

        tip.className =
          "legend-tip";

        dot.appendChild(tip);

        legendWrap.appendChild(dot);

      }
    );

}


/* =========================================================================
   MAP CLICK LAYER
   ========================================================================= */

/*
   HOMEPAGE:

   Clicking anywhere on the map
   opens Map Mode.


   MAP MODE:

   The SVG country-hit layer handles
   individual country clicks.
*/

if (hitLayer) {

  hitLayer.addEventListener(
    "click",
    function(e) {

      e.preventDefault();
      e.stopPropagation();


      /*
         If Map Mode is already active,
         do not reopen it.

         Individual countries are handled
         by the SVG country-hit layer.
      */

      if (mapModeActive) {
        return;
      }


      openMapMode();

    }
  );

}


/* =========================================================================
   RESET MAP MODE INFORMATION
   ========================================================================= */

function resetMapModeInformation() {

  if (
    !mapModeTitle ||
    !mapModeBody
  ) {
    return;
  }


  mapModeTitle.textContent =
    "Explore the Map";


  mapModeBody.innerHTML = `
    <p>
      Select an area of the map to explore its political system.
    </p>

    <div class="map-mode-placeholder">
      Country information will appear here in the next stage.
    </div>
  `;

}


/* =========================================================================
   HEADER
   ========================================================================= */

function openHeader() {

  closeMapMode();

  clearMapSelection();

  removeZoom();

  activeCategory =
    "header";


  openExplainer({

    title:
      "About this map",

    color:
      "#8a3f14",

    text:
      explanations.header

  });

}


if (headerTrigger) {

  headerTrigger.addEventListener(
    "click",
    openHeader
  );


  headerTrigger.addEventListener(
    "keydown",
    function(e) {

      if (
        e.key === "Enter" ||
        e.key === " "
      ) {

        e.preventDefault();

        openHeader();

      }

    }
  );

}


/* =========================================================================
   SELECT CATEGORY
   ========================================================================= */

function selectCategory(key) {

  if (mapModeActive) {

    closeMapMode();

  }


  if (
    activeCategory === key
  ) {

    resetView();

    return;

  }


  activeCategory =
    key;


  const cat =
    categories[key];


  if (!cat) {
    return;
  }


  Object.entries(
    glowEls
  ).forEach(
    ([k, el]) => {

      el.classList.toggle(
        "is-active",
        k === key
      );

    }
  );


  document
    .querySelectorAll(
      ".legend-dot"
    )
    .forEach(
      dot => {

        dot.classList.toggle(
          "is-active",
          dot.dataset.category === key
        );

      }
    );


  zoomToBbox(
    cat.bbox
  );


  openExplainer({

    title:
      cat.title,

    color:
      cat.color,

    text:
      explanations[key]

  });

}


/* =========================================================================
   MAP MODE — STAGE 1
   ========================================================================= */

function openMapMode() {

  if (mapModeActive) {
    return;
  }


  startBackgroundMusic();


  closeExplainer();

  clearMapSelection();

  removeZoom();

  activeCategory =
    null;


  /*
     Restore the default Map Mode
     information every time Map Mode
     is opened.
  */

  resetMapModeInformation();


  mapModeActive =
    true;


  page.classList.add(
    "map-mode-active"
  );


  mapModePanel.hidden =
    false;


  mapModePanel.setAttribute(
    "aria-hidden",
    "false"
  );


  scrim.hidden =
    false;


  setTimeout(
    () => {

      if (mapModeClose) {

        mapModeClose.focus();

      }

    },
    50
  );

}


/* =========================================================================
   CLOSE MAP MODE
   ========================================================================= */

function closeMapMode() {

  if (!mapModeActive) {
    return;
  }


  mapModeActive =
    false;


  page.classList.remove(
    "map-mode-active"
  );


  if (mapModePanel) {

    mapModePanel.hidden =
      true;

    mapModePanel.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  if (scrim) {

    scrim.hidden =
      true;

  }


  clearMapSelection();

  removeZoom();

  activeCategory =
    null;

}


/* =========================================================================
   CLEAR MAP SELECTION
   ========================================================================= */

function clearMapSelection() {

  Object.values(
    glowEls
  ).forEach(
    el => {

      el.classList.remove(
        "is-active"
      );

    }
  );


  document
    .querySelectorAll(
      ".legend-dot"
    )
    .forEach(
      dot => {

        dot.classList.remove(
          "is-active"
        );

      }
    );

}


function removeZoom() {

  if (mapFrame) {

    mapFrame.classList.remove(
      "is-zoomed"
    );

    mapFrame.classList.remove(
      "country-zoomed"
    );

  }


  [
    basisImg,
    mapModeImage,
    countryHitLayer,
    ...Object.values(glowEls)
  ]
    .filter(Boolean)
    .forEach(
      el => {

        el.style.transform =
          "";

        el.style.transformOrigin =
          "";

        el.style.transition =
          "";

      }
    );

}


/* =========================================================================
   RESET
   ========================================================================= */

function resetView() {

  if (mapModeActive) {

    closeMapMode();

    return;

  }


  activeCategory =
    null;


  clearMapSelection();

  removeZoom();

  closeExplainer();

}


/* =========================================================================
   ZOOM
   ========================================================================= */

function zoomToBbox(
  [x0, y0, x1, y1]
) {

  if (!mapFrame) {
    return;
  }


  const cx =
    (x0 + x1) / 2;

  const cy =
    (y0 + y1) / 2;


  const spanX =
    x1 - x0;

  const spanY =
    y1 - y0;


  const span =
    Math.max(
      spanX,
      spanY,
      0.001
    );


  const scale =
    Math.min(
      1.85,
      Math.max(
        1.12,
        0.72 / span
      )
    );


  const originX =
    cx * 100;

  const originY =
    cy * 100;


  mapFrame.classList.add(
    "is-zoomed"
  );


  [
    basisImg,
    ...Object.values(glowEls)
  ]
    .filter(Boolean)
    .forEach(
      el => {

        el.style.transformOrigin =
          `${originX}% ${originY}%`;

        el.style.transform =
          `scale(${scale})`;

      }
    );

}

/* =========================================================================
   COUNTRY ZOOM — MAP MODE
   ========================================================================= */

const COUNTRY_ZOOM_SCALE =
  1.40;

const COUNTRY_ZOOM_DURATION =
  0.45;


function zoomToCountry(
  hit
) {

  if (
    !mapFrame ||
    !hit
  ) {
    return;
  }


  /*
     Read the actual position
     of the tapped country polygon.
  */

  const box =
    hit.getBBox();


  if (
    !box ||
    box.width <= 0 ||
    box.height <= 0
  ) {
    return;
  }


  /*
     Find the center of the
     tapped country.
  */

  const centerX =
    box.x +
    box.width / 2;

  const centerY =
    box.y +
    box.height / 2;


  /*
     Convert the SVG coordinates
     into percentages.

     The country SVG uses:

     viewBox="0 0 2048 1447"
  */

  const originX =
    (centerX / 2048) * 100;

  const originY =
    (centerY / 1447) * 100;


  /*
     Add the country-zoom state.
  */

  mapFrame.classList.add(
    "is-zoomed"
  );

  mapFrame.classList.add(
    "country-zoomed"
  );


  /*
     These layers must move together
     so the map and invisible click
     areas stay perfectly aligned.
  */

  [
  basisImg,
  mapModeImage,
  countryHitLayer,
  ...Object.values(glowEls)
]
  .filter(Boolean)
  .forEach(
    el => {

      el.style.transformOrigin =
        "50% 50%";

      el.style.transition =
        `transform ${COUNTRY_ZOOM_DURATION}s ease`;

      const translateX =
        (50 - originX) *
        (COUNTRY_ZOOM_SCALE - 1);

      const translateY =
        (50 - originY) *
        (COUNTRY_ZOOM_SCALE - 1);

      el.style.transform =
        `translate(${translateX}%, ${translateY}%) scale(${COUNTRY_ZOOM_SCALE})`;

    }
  );

}


/* =========================================================================
   EXPLAINER
   ========================================================================= */

function openExplainer({
  title,
  color,
  text
}) {

  if (
    !explainer ||
    !explainerDot ||
    !explainerTitle ||
    !explainerBody ||
    !scrim
  ) {
    return;
  }


  explainerDot.style.background =
    color;


  explainerTitle.textContent =
    title;


  explainerBody.innerHTML =
    "";


  if (
    text &&
    text.trim()
  ) {

    const p =
      document.createElement(
        "p"
      );

    p.textContent =
      text;

    explainerBody.appendChild(
      p
    );

  }

  else {

    const placeholder =
      document.createElement(
        "div"
      );

    placeholder.className =
      "explainer-placeholder";

    explainerBody.appendChild(
      placeholder
    );

  }


  scrim.hidden =
    false;


  explainer.hidden =
    false;


  explainer.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* =========================================================================
   CLOSE EXPLAINER
   ========================================================================= */

function closeExplainer() {

  if (
    !scrim ||
    !explainer
  ) {
    return;
  }


  scrim.hidden =
    true;


  explainer.hidden =
    true;


  explainer.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================================================================
   X BUTTON — OLD CATEGORY POPUP
   ========================================================================= */

if (explainerClose) {

  explainerClose.addEventListener(
    "click",
    function(e) {

      e.preventDefault();
      e.stopPropagation();

      resetView();

    }
  );

}


/* =========================================================================
   X BUTTON — MAP MODE
   ========================================================================= */

if (mapModeClose) {

  mapModeClose.addEventListener(
    "click",
    function(e) {

      e.preventDefault();
      e.stopPropagation();

      resetView();

    }
  );

}


/* =========================================================================
   RESET VIEW BUTTON — MAP MODE
   ========================================================================= */

if (mapResetButton) {

  mapResetButton.addEventListener(
    "click",
    function(e) {

      e.preventDefault();
      e.stopPropagation();

      resetView();

    }
  );

}


/* =========================================================================
   SCRIM
   ========================================================================= */

if (scrim) {

  scrim.addEventListener(
    "click",
    function() {

      if (mapModeActive) {

        closeMapMode();

        return;

      }


      resetView();

    }
  );

}


/* =========================================================================
   ESCAPE
   ========================================================================= */

document.addEventListener(
  "keydown",
  function(e) {

    if (
      e.key === "Escape"
    ) {

      resetView();

    }

  }
);


/* =========================================================================
   BACKGROUND MUSIC
   ========================================================================= */

const music =
  document.getElementById(
    "backgroundMusic"
  );

const musicToggle =
  document.getElementById(
    "musicToggle"
  );


function startBackgroundMusic() {

  if (
    !music ||
    !musicToggle
  ) {
    return;
  }


  if (music.paused) {

    const playPromise =
      music.play();


    if (
      playPromise &&
      typeof playPromise.catch === "function"
    ) {

      playPromise
        .then(
          () => {

            musicToggle.textContent =
              "🔊";

          }
        )
        .catch(
          () => {

            /*
               Browser may block
               automatic playback.
            */

          }
        );

    }

  }

}


if (musicToggle) {

  musicToggle.addEventListener(
    "click",
    () => {

      if (!music) {
        return;
      }


      if (music.paused) {

        const playPromise =
          music.play();


        if (
          playPromise &&
          typeof playPromise.catch === "function"
        ) {

          playPromise
            .then(
              () => {

                musicToggle.textContent =
                  "🔊";

              }
            )
            .catch(
              () => {

                musicToggle.textContent =
                  "🔇";

              }
            );

        }

      }

      else {

        music.pause();

        musicToggle.textContent =
          "🔇";

      }

    }
  );

}


/* =========================================================================
   COUNTRY INFORMATION — MAP MODE
   ========================================================================= */

const countryInformation = {

  denmark: {
    name: "Denmark",
    flag: "🇩🇰",
    system: "Constitutional Monarchy",
    capital: "Copenhagen"
  },
  netherlands: {
    name: "Netherlands",
    flag: "🇳🇱",
    system: "Constitutional Monarchy",
    capital: "Amsterdam"
  },

  belgium: {
    name: "Belgium",
    flag: "🇧🇪",
    system: "Constitutional Monarchy",
    capital: "Brussels"
  },

  france: {
    name: "France",
    flag: "🇫🇷",
    system: "Semi-Presidential Republic",
    capital: "Paris"
  },

  turkey: {
  name: "Turkey",
  flag: "🇹🇷",
  system: "Authoritarian/Hybrid Regime",
  capital: "Ankara"
},

cyprus: {
  name: "Cyprus",
  flag: "🇨🇾",
  system: "Parliamentary Republic",
  capital: "Nicosia"
},

romania: {
  name: "Romania",
  flag: "🇷🇴",
  system: "Presidential Republic",
  capital: "Bucharest"
},

moldova: {
  name: "Moldova",
  flag: "🇲🇩",
  system: "Authoritarian/Hybrid Regime",
  capital: "Chișinău"
},

ukraine: {
  name: "Ukraine",
  flag: "🇺🇦",
  system: "Authoritarian/Hybrid Regime",
  capital: "Kyiv"
},

belarus: {
  name: "Belarus",
  flag: "🇧🇾",
  system: "Authoritarian/Hybrid Regime",
  capital: "Minsk"
},

russia: {
  name: "Russia",
  flag: "🇷🇺",
  system: "Authoritarian/Hybrid Regime",
  capital: "Moscow"
},

  switzerland: {
    name: "Switzerland",
    flag: "🇨🇭",
    system: "Federal State (Direct Democracy)",
    capital: "Bern"
  },

    germany: {
    name: "Germany",
    flag: "🇩🇪",
    system: "Parliamentary Republic",
    capital: "Berlin"
  },

  poland: {
    name: "Poland",
    flag: "🇵🇱",
    system: "Parliamentary Republic",
    capital: "Warsaw"
  },

  czechia: {
    name: "Czechia",
    flag: "🇨🇿",
    system: "Parliamentary Republic",
    capital: "Prague"
  },

  slovakia: {
    name: "Slovakia",
    flag: "🇸🇰",
    system: "Parliamentary Republic",
    capital: "Bratislava"
  },

  austria: {
    name: "Austria",
    flag: "🇦🇹",
    system: "Parliamentary Republic",
    capital: "Vienna"
  },

    italy: {
    name: "Italy",
    flag: "🇮🇹",
    system: "Parliamentary Republic",
    capital: "Rome"
  },

  hungary: {
    name: "Hungary",
    flag: "🇭🇺",
    system: "Parliamentary Republic",
    capital: "Budapest"
  },

  croatia: {
    name: "Croatia",
    flag: "🇭🇷",
    system: "Parliamentary Republic",
    capital: "Zagreb"
  },

  bosniaandherzegovina: {
    name: "Bosnia & Herzegovina",
    flag: "🇧🇦",
    system: "Parliamentary Republic",
    capital: "Sarajevo"
  },

    kosovo: {
    name: "Kosovo",
    flag: "🇽🇰",
    system: "Parliamentary Republic",
    capital: "Pristina"
  },

  albania: {
    name: "Albania",
    flag: "🇦🇱",
    system: "Parliamentary Republic",
    capital: "Tirana"
  },

  bulgaria: {
    name: "Bulgaria",
    flag: "🇧🇬",
    system: "Parliamentary Republic",
    capital: "Sofia"
  },

  greece: {
    name: "Greece",
    flag: "🇬🇷",
    system: "Parliamentary Republic",
    capital: "Athens"
  },

  estonia: {
    name: "Estonia",
    flag: "🇪🇪",
    system: "Parliamentary Republic",
    capital: "Tallinn"
  },

  finland: {
    name: "Finland",
    flag: "🇫🇮",
    system: "Parliamentary Republic",
    capital: "Helsinki"
  },

  iceland: {
    name: "Iceland",
    flag: "🇮🇸",
    system: "Parliamentary Republic",
    capital: "Reykjavík"
  },

  ireland: {
    name: "Ireland",
    flag: "🇮🇪",
    system: "Parliamentary Republic",
    capital: "Dublin"
  },

  latvia: {
    name: "Latvia",
    flag: "🇱🇻",
    system: "Parliamentary Republic",
    capital: "Riga"
  },

  lithuania: {
    name: "Lithuania",
    flag: "🇱🇹",
    system: "Semi-Presidential Republic",
    capital: "Vilnius"
  },

  norway: {
    name: "Norway",
    flag: "🇳🇴",
    system: "Constitutional Monarchy",
    capital: "Oslo"
  },

  sweden: {
    name: "Sweden",
    flag: "🇸🇪",
    system: "Constitutional Monarchy",
    capital: "Stockholm"
  },

  unitedkingdom: {
    name: "United Kingdom",
    flag: "🇬🇧",
    system: "Constitutional Monarchy",
    capital: "London"
  },

  montenegro: {
    name: "Montenegro",
    flag: "🇲🇪",
    system: "Parliamentary Republic",
    capital: "Podgorica"
  },

northmacedonia: {
  name: "North Macedonia",
  flag: "🇲🇰",
  system: "Parliamentary Republic",
  capital: "Skopje"
},

  portugal: {
    name: "Portugal",
    flag: "🇵🇹",
    system: "Semi-Presidential Republic",
    capital: "Lisbon"
  },

  sanmarino: {
    name: "San Marino",
    flag: "🇸🇲",
    system: "Parliamentary Republic",
    capital: "San Marino"
  },

serbia: {
  name: "Serbia",
  flag: "🇷🇸",
  system: "Parliamentary Republic",
  capital: "Belgrade"
},

  slovenia: {
    name: "Slovenia",
    flag: "🇸🇮",
    system: "Parliamentary Republic",
    capital: "Ljubljana"
  },

  spain: {
    name: "Spain",
    flag: "🇪🇸",
    system: "Parliamentary Monarchy",
    capital: "Madrid"
  },

  vaticancity: {
    name: "Vatican City (Holy See)",
    flag: "🇻🇦",
    system: "Theocratic Monarchy (Elective)",
    capital: "Vatican City"
  }

  

};


/* =========================================================================
   SHOW COUNTRY INFORMATION IN MAP MODE
   ========================================================================= */

function showCountryInformation(key) {

  const country =
    countryInformation[key];


  if (
    !country ||
    !mapModePanel
  ) {
    return;
  }


  /*
     Keep Map Mode open.
  */

  mapModeActive =
    true;


  page.classList.add(
    "map-mode-active"
  );


  mapModePanel.hidden =
    false;


  mapModePanel.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
     Change title.
  */

  const panelTitle =
    mapModePanel.querySelector(
      "h2"
    );


  if (panelTitle) {

    panelTitle.textContent =
      country.name;

  }


  /*
     Change information.
  */

  const panelBody =
    mapModePanel.querySelector(
      ".map-mode-body"
    );


  if (panelBody) {

    panelBody.innerHTML = `

      <div class="map-mode-country-info">

        <div class="country-name-display">

          <span class="country-flag">
            ${country.flag}
          </span>

          <strong>
            ${country.name}
          </strong>

        </div>


        <div class="country-detail">

          <span class="country-detail-label">
            Government System
          </span>

          <span class="country-detail-value">
            ${country.system}
          </span>

        </div>


        <div class="country-detail">

          <span class="country-detail-label">
            Capital
          </span>

          <span class="country-detail-value">
            ${country.capital}
          </span>

        </div>

      </div>

    `;

  }

}


/* =========================================================================
   COUNTRY CLICK EVENTS
   ========================================================================= */

/*
   This is now the ONLY country-click system.

   There is no separate Iceland image
   or Iceland canvas hit test anymore.

   Iceland is treated exactly like
   the other countries.
*/

if (countryHitLayer) {

  countryHitLayer
    .querySelectorAll(
      ".country-hit"
    )
    .forEach(
      hit => {

        hit.addEventListener(
          "click",
          function(e) {

            e.preventDefault();
            e.stopPropagation();


            /*
               Country information is only
               available while Map Mode is open.
            */

            if (!mapModeActive) {
              return;
            }


           const countryKey =
           hit.dataset.country;

           if (!countryKey) {
           return;
           }

           zoomToCountry(
           hit
           );

           showCountryInformation(
           countryKey
           );

          }
        );

      }
    );

}


/* =========================================================================
   STARTUP INTRO
   ========================================================================= */

const startupIntro =
  document.getElementById(
    "startupIntro"
  );

const startupSkip =
  document.getElementById(
    "startupSkip"
  );


let startupFinished =
  false;


function finishStartupIntro() {

  if (
    startupFinished ||
    !startupIntro
  ) {
    return;
  }


  startupFinished =
    true;


  startupIntro.classList.add(
    "is-hidden"
  );


  setTimeout(
    () => {

      if (startupIntro) {

        startupIntro.remove();

      }

    },
    1000
  );

}


/* Automatically reveal the map
   after the intro */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        finishStartupIntro();

      },
      3200
    );

  }
);


/* Allow the visitor to skip
   the intro */

if (startupSkip) {

  startupSkip.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      finishStartupIntro();

    }
  );

}


/* Also allow tapping anywhere
   on the intro to skip */

if (startupIntro) {

  startupIntro.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        startupSkip
      ) {
        return;
      }


      finishStartupIntro();

    }
  );

}


/* Allow ESC to skip
   the startup */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      !startupFinished
    ) {

      finishStartupIntro();

    }

  }
);
