//Read in samples.json from URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Get json data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });
  
  // Initialize the dashboard
  function init() {

       // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Make an array of id names
        let names = data.names;

        // Iterate through the names Array
        names.forEach((name) => {
            // Append each name as an option to the drop down menu
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name = names[0];

        // Call functions to make the demographic panel & 3 charts
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// Define function to generate demographics panel
function demo(value) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Make an array of metadata objects
        let metadata = data.metadata;
        
        // Filter array data where id = selected value
        let filteredData = metadata.filter((meta) => meta.id == value);
      
        // Assign the first object to a variable
        let obj = filteredData[0]
        
        // Clear metadata
        d3.select("#sample-metadata").html("");
  
        // Use Object.entries to add each key/value pair to the panel
         Object.entries(obj).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};
  

// Define function to generate bar chart
function bar(value) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Make an array of sample objects
        let samples = data.samples;

        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === value);

        // Assign the first object to a variable
        let obj = filteredData[0];
        
        // Trace for the horizontal bar chart
        let trace = [{
            // Slice the top 10 otus
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(166,172,237)"
            },
            orientation: "h"
        }];
        
        // Use Plotly to create bar chart
        Plotly.newPlot("bar", trace);
    });
}

// Define function to generate bubble chart
function bubble(value) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {

        // Make an array of sample objects
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === value);
    
        // Assign the first object to a variable
        let obj = filteredData[0];
        
        // Trace for the data for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Sunset"
            }
        }];
    
        // Setup layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Use Plotly to create bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}


// Define function to generate gauge chart 
function gauge(value) {
    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        // Make an array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value 
        let filteredData = metadata.filter((meta) => meta.id == value);
      
        // Assign the first object to a variable
        let obj = filteredData[0]

        // Trace for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "rgb(68,166,198)"},
                steps: [
                    { range: [0, 1], color: "rgb(233,245,248)" },
                    { range: [1, 2], color: "rgb(218,237,244)" },
                    { range: [2, 3], color: "rgb(203,230,239)" },
                    { range: [3, 4], color: "rgb(188,223,235)" },
                    { range: [4, 5], color: "rgb(173,216,230)" },
                    { range: [5, 6], color: "rgb(158,209,225)" },
                    { range: [6, 7], color: "rgb(143,202,221)" },
                    { range: [7, 8], color: "rgb(128,195,216)" },
                    { range: [8, 9], color: "rgb(113,187,212)" },
                    { range: [9, 10], color: "rgb(98,180,207)" }
                ]
            }
        }];

         // Use Plotly to create gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Run all functions when dropdown menu is changed
function optionChanged(value) {
    demo(value);
    bar(value);
    bubble(value);
    gauge(value)
}

init();