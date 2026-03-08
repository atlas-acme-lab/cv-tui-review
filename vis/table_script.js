var itemW = 40;
var itemH = 25;

var sortMode = "year";
var filterItem = "";
var filterOpen = false;

var data = dataLoaded;

var codes = {
"Project Type": [],
"Research Goal": [],
"Environmental Constraints": [],
"System Scale": [],
"Camera Device": [],
"Camera Position": [],
"Display Device": [],
"Display Location": [],
"Computing Device": [],
"Tracker Visibility": [],
"Physical Materials": [],
"CV Method": [],
"Software Architecture": [],
"Input Loop": [],
"IR": [],
"Individual Events": [],
"Relational Events": [],
};

var codesCount = {};

var codesText = [
  "Software Architecture",
  "Physical Materials",
  "Research Goal",
]

window.onload = () => {
  data.forEach((d, i) => {
    for (let c in codes) {
      d[c] = d[c].split(",");
      codes[c].push(...d[c]);
    }
  });
  
  for(let c in codes) {
    const unique = [... new Set(codes[c])];
    console.log(unique);
    const count = [];
    unique.forEach(u => {
      count.push(codes[c].filter(f => f === u).length);
    });
    let zip = unique.map((u, i) => ([u, count[i]]));
    zip.sort((a, b) => (b[1] - a[1]));
    codes[c] = zip.map(z => (z[0]));
    codesCount[c] = zip;
  }
  
  let maxCount = 0;
  for (let c in codesCount) {
    codesCount[c].forEach(co => {
      maxCount = co[1] > maxCount ? co[1] : maxCount;
    });
  }
  
  const visL = document.querySelector("#vis-labels");
  const visD = document.querySelector("#vis-dist");
  let labelContent = `<div class="label-data"><span onclick="sortVis('Label')">Label</span></div>`;
  let distContent = `<div class="label-data"></div>`;

//   let labelContent = `<div class="title"><span onclick="sortVis('Title')">Title</span></div>
//   <div class="authors"><span onclick="sortVis('Authors')">Authors</span></div>
//   <div class="year"><span onclick="sortVis('Year')">Year</span></div>
//   <div class="venue"><span onclick="sortVis('Venue')">Venue</span></div>`;
//   let distContent = `<div class="title"></div><div class="authors"></div><div class="year"></div><div class="venue"><span>n = ${data.length}</span></div>`;
  for(let c in codes) {
    const cat = codes[c];
    let cellsDiv = `<div class="label-cat cat-${c.replace(/\s/g, '')}"><div class="label-cat-title">${c}</div>`;
    let distDiv = `<div class="dist-group cat-${c.replace(/\s/g, '')}">`;
    if (codesText.indexOf(c) >= 0) {
      cellsDiv += `<div class="label code-text code-text-${c.replace(/\s/g, '')}"></div>`;
      distDiv += `<div class="dist code-text code-text-${c.replace(/\s/g, '')}"></div>`;
    } else {
      cat.forEach((co, index) => {
        cellsDiv += `<div class="label code-${co.replace(/\s/g, '')}" onclick="sortVis('code', '${c}', '${co}')"><span>${co}</span></div>`;
        const quant = codesCount[c][index][1];
        distDiv += `<div class="dist code-${co.replace(/\s/g, '')}" style="height:${quant/maxCount*100}%;"><span>${quant}<span></div>`;
      });
    }
    cellsDiv += `</div>`;
    distDiv += `</div>`;
    labelContent += cellsDiv;
    distContent += distDiv;
  }
  visL.innerHTML = labelContent;
  visD.innerHTML = distContent;
  
  document.querySelector("#modal").addEventListener("click", (e) => {
    if (document.querySelector("#modal").classList.contains("active")) {
      document.querySelector("#modal").classList.remove("active");
      if (document.querySelector(".item.active")) {
        document.querySelector(".item.active").classList.remove("active");
      }
    }
  })
  
  renderVis();
};

const sortVis = (input, cat, code) => {
  switch (input) {
    case "Title":
    case "Authors":
    case "Year":
    case "Venue":
      data.sort((a, b) => {
        if (a[input] < b[input]) {
          return -1;
        }
        if (a[input] > b[input]) {
          return 1;
        }
        return 0;
      });
      if (document.querySelector(".sort-active")) {
        document.querySelector(".sort-active").classList.remove("sort-active");
      }
      document.querySelector(`.${input.toLowerCase()}`).classList.add("sort-active");
      break;
    case "code":
      console.log(cat, code);
      
      if (document.querySelector(".sort-active")) {
        document.querySelector(".sort-active").classList.remove("sort-active");
      }
      document.querySelector(`.cat-${cat.replace(/\s/g, '')} .code-${code.replace(/\s/g, '')}`).classList.add("sort-active");
      
      data.sort((a, b) => {
        const aCode = a[cat].indexOf(code);
        const bCode = b[cat].indexOf(code);
        return bCode - aCode;
      });
      break;
  }
  
  renderVis();    
}

const renderVis = () => {
  data.forEach((d, i) => {
    const title = `<div class="title">${d["Title"]}</div>`;
    const authors = `<div class="authors">${d["Authors"].replace(/,.*/,'')} et al.</div>`;
    const year = `<div class="year">${d["Year"]}</div>`;
    const venue = `<div class="venue">${d["Venue"]}</div>`;
    const label = `<div class="label-data">${d["Label"]}</div>`;
    let codeCells = ``;
    for (let c in codes) {
      const cat = codes[c];
      let cellsDiv = `<div class="code-cat cat-${c.replace(/\s/g, '')}">`;
      
      if (codesText.indexOf(c) >= 0) {
        cellsDiv += `<div class="code code-text code-text-${c.replace(/\s/g, '')}"><span>${d[c].join(", ")}</span></div>`;
        cellsDiv += `</div>`;
        codeCells += cellsDiv;
      } else {
        cat.forEach(co => {
          if (d[c].indexOf(co) >= 0) {
            cellsDiv += `<div class="code code-true code-${co.replace(/\s/g, '')}"></div>`;
          } else {
            cellsDiv += `<div class="code code-false code-${co.replace(/\s/g, '')}"></div>`;
          }
        });
        cellsDiv += `</div>`;
        codeCells += cellsDiv;
      }
    }
    
    const element = document.createElement("div");
    element.classList.add("item");
    const cs = d["Project Type"].indexOf("Case Study");
    const sp = d["Project Type"].indexOf("System Paper");
    if (cs >= 0 && sp >= 0) {
      element.classList.add("case-sys");
    } else if (cs >= 0) {
      element.classList.add("case");
    } else {
      element.classList.add("sys");
    }
    // element.innerHTML = title + authors + year + venue + codeCells;
    element.innerHTML = label + codeCells;
    element.addEventListener("click", (e) => {
      displayInformation(d);
      document.querySelector("#modal").classList.add("active");
      e.stopPropagation();
    });
    d.element = element;
  });
  
  const vis = document.querySelector("#vis");
  vis.innerHTML = "";
  data.forEach((d, i) => {
    vis.append(d.element);
  });
}

const displayInformation = (info) => {
  if (info) {
    if (document.querySelector(".item.active")) {
      document.querySelector(".item.active").classList.remove("active");
    }
    info.element.classList.add("active");
    var infoDiv = document.querySelector("#modal");
    infoDiv.innerHTML = `
      <div class="info-label">${info["Project Type"]}</div>
      <div class="info-title">${info["Title"]}</div>
      <div class="info-year">${info["Venue"]} ${info["Year"]}</div>
      <div class="info"><a href="${info["URL"]}" target="_blank">${info["URL"]}</a></div>
      <div class="info">${info["Authors"]}</div>
      <div class="info">${info["Abstract"]}</div>
      <div class="info-code"><span class="code-label">Research Goal:</span> <span>${info["Research Goal"]}</span></div>
      <div class="info-code"><span class="code-label">Environmental Constraints:</span> <span>${info["Environmental Constraints"]}</span></div>
      <div class="info-code"><span class="code-label">System Scale:</span> <span>${info["System Scale"]}</span></div>
      <div class="info-code"><span class="code-label">Camera Device:</span> <span>${info["Camera Device"]}</span></div>
      <div class="info-code"><span class="code-label">Camera Position:</span> <span>${info["Camera Position"]}</span></div>
      <div class="info-code"><span class="code-label">Display Device:</span> <span>${info["Display Device"]}</span></div>
      <div class="info-code"><span class="code-label">Display Location:</span> <span>${info["Display Location"]}</span></div>
      <div class="info-code"><span class="code-label">Computing Device:</span> <span>${info["Computing Device"]}</span></div>
      <div class="info-code"><span class="code-label">Tracker Visibility:</span> <span>${info["Tracker Visibility"]}</span></div>
      <div class="info-code"><span class="code-label">Physical Materials:</span> <span>${info["Physical Materials"]}</span></div>
      <div class="info-code"><span class="code-label">CV Method:</span> <span>${info["CV Method"]}</span></div>
      <div class="info-code"><span class="code-label">Software Architecture:</span> <span>${info["Software Architecture"]}</span></div>
      <div class="info-code"><span class="code-label">Input Loop:</span> <span>${info["Input Loop"]}</span></div>
      <div class="info-code"><span class="code-label">IR:</span> <span>${info["IR"]}</span></div>
      <div class="info-code"><span class="code-label">Individual Evt:</span> <span>${info["Individual Events"]}</span></div>
      <div class="info-code"><span class="code-label">Relational Evt:</span> <span>${info["Relational Events"]}</span></div>
      <div class="info-code"><span class="code-label">Reactivision:</span> <span>${info["Reactivision"]}</span></div>
      <div class="info-code"><span class="code-label">Fiducial Marker:</span> <span>${info["Fiducial Marker"]}</span></div>
    `;
  } else {
    var infoDiv = document.querySelector("#modal");
    infoDiv.innerHTML = ``;
  }
};