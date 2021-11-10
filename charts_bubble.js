function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var result_sample = samples_array.filter(samplegroup => samplegroup.id == sample);
    //console.log(result_sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = result_sample[0];
    console.log('result: ',result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids; 
    var otu_labels; 
    var sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var otu_ids = result.otu_ids.slice(0,10).map(value => value).reverse();
    console.log(otu_ids);
    var otu_labels = result.otu_labels.slice(0,10).map(value => value).reverse();
    console.log(otu_labels);
    var sample_values = result.sample_values.slice(0,10).map(value => value).reverse();
    console.log(sample_values);

    var yticks = result.otu_ids.slice(0,10).map(value => "OTU " +value).reverse();
    console.log(yticks);
    //Create bubble chart.
    var bubbleData = [{
        x:otu_ids,
        y:sample_values,
        mode: 'markers',
        text:otu_labels,
        marker:{
                 size: sample_values,
                 color:otu_ids,
                 colorscale:'Viridis'
               }  
     }];
    
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      hovermode:'closest'
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  });
}
