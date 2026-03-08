var itemW = 40;
var itemH = 25;

var sortMode = "year";
var filterItem = "";
var filterOpen = false;

var data = dataLoaded;

var filters = {
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
  "Reactivision": [],
  "Fiducial Marker": [],
};

window.onload = () => {
  data.forEach((d, i) => {
    d.active = true;
    d.selected = false;
    
    d.element = [];
    
    var labelSize = [];
    for (var fil in filters) {
      labelSize.push(d[fil].length);
    }
    
    for (var i=0; i<Math.max(...labelSize); i++) {
      d.element.push(document.createElement("div"));
    }
    d.element.forEach(e => {
      e.innerHTML = `<span class="item-label">${d["Label"]}</span><span class="item-tooltip">${d["Title"]}</span>`;
    });
    
    for (var f in filters) {
      d[f] = d[f].length > 0 ? d[f].split(",") : [];
      filters[f].push(...d[f]);
    }
    
    var typeNum = d["Label"].split("-");
    d.element.forEach(e => {
      e.classList.add("item");
      switch (typeNum[0]) {
        case "C":
          e.classList.add("type-C");
          break;
        case "S":
          e.classList.add("type-S");
          break;
        case "CS":
          e.classList.add("type-CS");
          break;
      }
      e.addEventListener("click", (evt) => {
        data.forEach((di) => {
          if (di !== d && di.selected) {
            di.selected = false;
          }
        })
        document.querySelectorAll(".item.selected").forEach((ele) => {
          ele.classList.remove("selected");
        });
        
        d.selected = !d.selected;
        if (d.selected) {
          d.element.forEach((ele) => {
            ele.classList.add("selected");
          });
          displayInformation(d); 
        } else {
          displayInformation(undefined); 
        }
      });
    });
    
    d.element.forEach((e) => {
      document.querySelector("#vis").appendChild(e);
    });
  });
  
  
  var filterContainer = document.querySelector("#filter-bar");
  for(var f in filters) {
    filters[f] = filters[f].filter((d, i) => (i === filters[f].indexOf(d)));
    filters[f].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      } else {
        return 1;
      }
    });
    filters[f] = filters[f].map((d, i) => {
      var element = document.createElement("div");
      element.classList.add("filter-item");
      element.innerHTML = d;
      return {"category": f, "name" : d, "active" : false, "element": element, count: 0};
    });    
    filters[f].forEach((d) => {
       d.element.addEventListener("click", (e) => {
         d.active = !d.active;
         e.target.classList.toggle("active");
         filterData();
       });
    });
    
    var categoryEle = document.createElement("div");
    categoryEle.classList.add("filter-category");
    var filterCatItem = document.createElement("div");
    filterCatItem.innerHTML = f;
    filterCatItem.classList.add("filter-category-name");
    filterCatItem.addEventListener("click", (evt) => {
      displaySort("category", evt.target.innerHTML);
    });
    categoryEle.append(filterCatItem);
    
    var filterCatItemsDiv = document.createElement("div");
    filterCatItemsDiv.classList.add("filter-category-items");
    filterCatItemsDiv.append(...filters[f].map(d => (d.element)));
    categoryEle.append(filterCatItemsDiv);
    
    filterContainer.append(categoryEle);
  }
  
  filterData();

  document.querySelector("#sort-year").addEventListener("click", (e) => { 
    sortMode = "year"; 
    filterData();
  });
  document.querySelector("#sort-type").addEventListener("click", (e) => { 
    sortMode = "type"; 
    filterData();
  });
  document.querySelector("#filter-btn").addEventListener("click", (e) => { 
    filterOpen = !filterOpen;
    if (filterOpen) {
      e.target.classList.add("active");
      document.querySelector("#filter-bar").classList.add("open");
      document.querySelector(":root").style.setProperty('--menu-height', '300px');
    } else {
      e.target.classList.remove("active");
      document.querySelector("#filter-bar").classList.remove("open");
      document.querySelector(":root").style.setProperty('--menu-height', '100px');
    }
  });
  document.querySelector("#clear-filter-btn").addEventListener("click", (e) => { 
    clearFilters();
  });
};

const displayInformation = (info) => {
  if (info) {
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

const displaySort = (mode, cat) => {
  sortMode = mode;
  if (cat) {
    filterItem = cat;
  }
  switch(sortMode) {
    case "year":
      displayYear();
      break;
    case "type":
      displayType();
      break;
    case "category":
      displayCategory(filterItem);
  }
}

const displayCategory = (cat) => {
  dataSort("label");
  var catItems = {};
  filters[cat].forEach(item => {
    catItems[item.name] = {
      count: 0,
      data: [],
    };
  });
  
  data.forEach((d, i) => {
    if (d.active) {
      d[cat].forEach((ci, k) => {
        catItems[ci].count++;
        catItems[ci].data.push({
          element: d.element[k],
          index: k,
        });
      });
    }
  });
  
  var w = document.querySelector("#vis").offsetWidth;
  var labelWidth = 150;
  var rowCount = 0;
  var colCount = 0;
  var labels = "";
  
  data.forEach((d, i) => {
    d.element.forEach(e => {
      e.classList.add("inactive");
      e.classList.remove("hidden");
    });
  });
  
  labels += `<div class="label text-left cat-title" style="width: ${labelWidth}px; top: ${rowCount * (itemH + 5)}px; left: ${0}px;">${cat}</div>`;
  rowCount += 2;
  
  for (var i in catItems) {
    labels += `<div class="label text-left" style="width: ${labelWidth}px; top: ${rowCount * (itemH + 5)}px; left: ${0}px;">${i} (${catItems[i].count})</div>`;
    catItems[i].data.forEach((d) => {
      if ((colCount + 3) * (itemW + 5) + labelWidth > w) {
        rowCount++;
        colCount = 0;
      }
      d.element.classList.remove("inactive");
      d.element.style.top = `${rowCount * (itemH + 5)}px`;
      d.element.style.left = `${labelWidth + colCount * (itemW + 5)}px`;
      colCount++;
    });
    
    rowCount += 2;
    colCount = 0;
  }
  
  document.querySelector("#vis-labels").innerHTML = labels;
}

const displayYear = () => {
  var years = data.map((d) => +d["Year"]);
  var minYear = Math.min(...years);
  var maxYear = Math.max(...years);
  
  var yearBuckets = [];
  for (var i = minYear; i <= maxYear; i++) {
    yearBuckets.push(i);
  }
  
  dataSort("label");

  var w = document.querySelector("#vis").offsetWidth;
  var bucketQty = yearBuckets.map((d) => 0);
  var labelHeight = 40;

  data.forEach((d, i) => {
    d.element.forEach((e, k) => {
      if (k > 0) {
        e.classList.add("inactive");
      } else {
        e.classList.remove("inactive");
      }
    });
    if (d.active) {
      var col = yearBuckets.findIndex((y) => y === +d["Year"]);
      var row = bucketQty[col];
      d.element[0].style.top = `${labelHeight + row * (itemH + 5)}px`;
      d.element[0].style.left = `${col * (itemW + 15)}px`;
      bucketQty[col]++;
    }
  });

  var labels = "";
  yearBuckets.forEach((d, i) => {
    labels += `<div class="label text-center" style="width: ${itemW}px; top: ${0}px; left: ${i * (itemW + 15)}px;">${d} (${bucketQty[i]})</div>`;
  });
  document.querySelector("#vis-labels").innerHTML = labels;
};

const displayType = () => {
  dataSort("label");
  
  data.forEach((d, i) => {
    d.element.forEach((e, k) => {
      if (k > 0) {
        e.classList.add("inactive");
      } else {
        e.classList.remove("inactive");
      }
    });
  });
  
  var dataS = data.filter(d => {
    var typeNum = d["Label"].split("-");
    return typeNum[0] === "S" && d.active;
  });
  
  var dataCS = data.filter(d => {
    var typeNum = d["Label"].split("-");
    return typeNum[0] === "CS" && d.active;
  });
  
  var dataC = data.filter(d => {
    var typeNum = d["Label"].split("-");
    return typeNum[0] === "C" && d.active;
  });
  
  var w = document.querySelector("#vis").offsetWidth;
  var labelWidth = 150;
  var rowCount = 0;
  var colCount = 0;
  var labels = "";
  
  labels += `<div class="label text-left" style="width: ${labelWidth}px; top: ${rowCount * (itemH + 5)}px; left: ${0}px;">System Papers (${dataS.length})</div>`;
  dataS.forEach((d, i, arr) => {
    if ((colCount + 3) * (itemW + 5) + labelWidth > w) {
      rowCount++;
      colCount = 0;
    }
    d.element[0].style.top = `${rowCount * (itemH + 5)}px`;
    d.element[0].style.left = `${labelWidth + colCount * (itemW + 5)}px`;
    colCount++;
  });
  
  rowCount += 2;
  colCount = 0;
  labels += `<div class="label text-left" style="width: ${labelWidth}px; top: ${rowCount * (itemH + 5)}px; left: ${0}px;">Case Studies / <br>System Papers (${dataCS.length})</div>`;
  dataCS.forEach((d, i, arr) => {
    if ((colCount + 3) * (itemW + 5) + labelWidth > w) {
      rowCount++;
      colCount = 0;
    }
    d.element[0].style.top = `${rowCount * (itemH + 5)}px`;
    d.element[0].style.left = `${labelWidth + colCount * (itemW + 5)}px`;
    colCount++;
  });
  
  rowCount += 2;
  colCount = 0;
  labels += `<div class="label text-left" style="width: ${labelWidth}px; top: ${rowCount * (itemH + 5)}px; left: ${0}px;">Case Studies (${dataC.length})</div>`;
  dataC.forEach((d, i, arr) => {
    if ((colCount + 3) * (itemW + 5) + labelWidth > w) {
      rowCount++;
      colCount = 0;
    }
    d.element[0].style.top = `${rowCount * (itemH + 5)}px`;
    d.element[0].style.left = `${labelWidth + colCount * (itemW + 5)}px`;
    colCount++;
  });
  
  document.querySelector("#vis-labels").innerHTML = labels;
};

const filterData = () => {
  var activeFilters = [];
  for (var f in filters) {
    activeFilters.push(...filters[f].filter((d) => (d.active)));
  }
  
  if (activeFilters.length > 0) {
    data.forEach((d) => {
      var filter = true;
      activeFilters.forEach((f) => {
        if (d[f.category].indexOf(f.name) === -1) {
          filter = false;
        }
      });
      
      if (filter) {
        d.active = true;
        d.element.forEach(e => {
          e.classList.remove("hidden");
        });
      } else {
        d.active = false;
        d.element.forEach(e => {
          e.classList.add("hidden");
        });
      }
    });
  } else {
    data.forEach((d) => {
      d.active = true;
      d.element.forEach(e => {
        e.classList.remove("hidden");
      });
    });
  }
  
  for (var f in filters) {
    filters[f].forEach((fil) => {
      fil.count = 0;
    });
  }
  data.forEach((d) => {
    if (d.active) {
      for (var f in filters) {
        filters[f].forEach((fil) => {
          if (d[fil.category].indexOf(fil.name) > -1) {
            fil.count++;
          }
        });   
      }
    }
  });
  for (var f in filters) {
    filters[f].forEach((fil) => {
      fil.element.innerHTML = `${fil.name} (${fil.count})`;
      if (fil.count > 0) {
        fil.element.classList.remove("filter-zero");
      } else {
        fil.element.classList.add("filter-zero");
      }
    });
  }
  
  var filteredData = data.filter((d) => (d.active));
  if (activeFilters.length > 0) {
    document.querySelector("#filter-info").innerHTML = `${filteredData.length} / ${data.length} items filtered.<br>Filters: ${activeFilters.map(f => f.name).join(",")}`;
  } else {
    document.querySelector("#filter-info").innerHTML = "";
  }
  
  displaySort(sortMode);
}

const clearFilters = () => {
  document.querySelector("#filter-info").innerHTML = "";
  
  for (var f in filters) {
    filters[f].forEach(f => {
      f.active = false;
      f.element.classList.remove("active");
    });
  }
  
  data.forEach((d) => {
    d.active = true;
    d.element.forEach(e => {
      e.classList.remove("hidden");
    });
  });
  
  filterData();
}

const dataSort = (type) => {
  switch(type) {
    case "label":
      data.sort((a, b) => {
        var typeNumA = a["Label"].split("-");
        var typeNumB = b["Label"].split("-");
        if (typeNumA[0] === typeNumB[0]) {
          return +typeNumA[1] - +typeNumB[1];
        } else {
          if (typeNumA[0] > typeNumB[0]) {
            return -1;
          } else {
            return 1;
          }
        }
      });
      break;
  }
}
