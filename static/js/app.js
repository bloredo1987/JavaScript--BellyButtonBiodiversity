const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});


// Fetch the JSON data and console log it
//module 14, day 3, activity 10, init
function init() {
  d3.json(url).then(function(data) {
      console.log(data);
      
      // Select the dropdown element
      let dropdown = d3.select("#selDataset");
  
      // Populate the dropdown options with sample names
      data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value", name);
      });
    
      // Initial display
      let initialSample = data.names[0];
      buildCharts(initialSample); // only needs ID number "data" is not needed as a parameter
  })
};

init();

function optionChanged(newSample) {
  buildCharts(newSample);
};


  // Function to build the bar chart and other charts
function buildCharts(sample) {
  d3.json(url).then(function(data) {
    // Filter data to get the selected sample
    let selectedSample = data.samples.find(sampleData => sampleData.id === sample);
  
    if (selectedSample) {
      // Get the top 10 OTUs and reverse the arrays
      let top10OtuIds = selectedSample.otu_ids.slice(0, 10).reverse();
      let top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
      let top10OtuLabels = selectedSample.otu_labels.slice(0, 10).reverse();
    
      // Create a horizontal bar chart
      let trace1 = {
        type: "bar",
        orientation: "h",
        x: top10SampleValues,
        y: top10OtuIds.map(otuId => `OTU ${otuId}`),
        text: top10OtuLabels,
      };
    
      let barData = [trace1];
    
      let barLayout = {
        title: "Top 10 OTUs Found",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" },
      };
    
      Plotly.newPlot("bar", barData, barLayout);

      //Build the bubble chart
      let bubbleTrace = {
        type: "bubble",
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: "markers",
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids,
        },
      };
      let bubbleData = [bubbleTrace];

      let bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" },
        showlegend: false,
      }; 
      
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    }
  })
};

function init() {
  d3.json(url).then(function(data) {
    console.log(data);

    // Select the dropdown element
    let dropdown = d3.select("#selDataset");

    // Populate the dropdown options with sample names
    data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value", name);
    });

    // Initial display
    let initialSample = data.names[0];
    buildCharts(initialSample);
    showMetadata(initialSample);
  });
}
function showMetadata(sample) {
  d3.json(url).then(function(data) {
    let metadata = data.metadata.find(metadata => metadata.id.toString() === sample);

    // Select the metadata panel
    let metadataPanel = d3.select("#sample-metadata");

    // Clear any existing content
    metadataPanel.html("");

    // Loop through each key-value pair in metadata and append to panel
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

