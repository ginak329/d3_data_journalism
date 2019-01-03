// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
    top: 30,
    right: 40,
    bottom: 100,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .append("g")
  .attr("transform","translate("+ margin.left + "," + margin.top + ")");

//   var chart = svg.append("g");

  var div = d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

  d3.csv("assets/data/data.csv", function(censusData){
  //   if (error) throw error;
    censusData.forEach(function(data){
  //   censusData.forEach(function(data){
        data.age=+data.age;
        data.smokes=+data.smokes;
        data.abbr=data.abbr;
        console.log(data.abbr)
        console.log(data.smokes)
        console.log(data.age)
    });

var xLinearScale = d3.scaleLinear().range([0, width]);
var yLinearScale = d3.scaleLinear().range([height,0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

xLinearScale.domain([30, d3.max(censusData, function(data){
    return +data.age;
})]);
yLinearScale.domain([5, d3.max(censusData,function(data){
    return +data.smokes;
})]);

var toolTip = d3.tip()
	  .attr("class", "toolTip")
	  .offset([80, -60])
	  .html(function(data) {
        var state=data.abbr;
	    var age = data.age;
	    var smokers = +data.smokes;
	    return ("<br> State: "+ state + "<br> Age of Smoker: " + age + "<br> Percentage of Smokers: "+ smokers);
	  });

     svg.call(toolTip);

     svg.selectAll("circle")
     .data(censusData)
     .enter()
     .append("circle")
       .attr("cx", function(data, index) {
           console.log("age");
           console.log(data.age);
           return xLinearScale(data.age);
       })
       .attr("cy", function(data, index) {
            console.log("smoke");
           console.log(data.smokes);
           return yLinearScale(data.smokes);
       })
       .attr("r", "15")
       .attr("fill","green")
       .style("opacity", 0.5)
       .on("click", function(data) {
           toolTip.show(data);
       })
       .on("mouseout", function(data, index) {
           toolTip.hide(data);
       })

       svg.selectAll("text")
       .data(censusData)
       .enter()
       .append("text")
       .attr("cx",d=>xLinearScale(d[bottomAxis]))
       .attr("cy",d=>yLinearScale(d[leftAxis]))
       .attr("text-anchor", "middle")
       .attr("font-size", "12px")
       .attr("class", "stateText")
       .text(function(data,index){
           console.log("state");
           console.log(data.abbr);
           return data.abbr;
         });
     
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        svg.append("g")
       .call(leftAxis);

       svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (height))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("Smokers (%)");

       svg.append("text")
       .attr("transform", "translate(" + (width/3) + "," + (height + margin.top + 30) + ")") 
       .attr("class", "axisText")
       .text("Age");

  });
