<template>
    <div class="plots">                     
        <div class="plots-box">
            <div class="plots-box-header">Plots</div>
            <div class="plots-box-graphs">
              <div id="production-plot">
                
                <div class="sliderRange">
                    <label class="labeltext">
                      Time (days): <em>{{ productionPlotSliderParams.sliderValues[0] }} - {{ productionPlotSliderParams.sliderValues[1] }}</em>
                    </label> 
                    <vue-slider 
                        ref="slider" 
                        v-model="productionPlotSliderParams.sliderValues" 
                        :min="productionPlotSliderParams.min" 
                        :max="productionPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('productionPlot')" 
                        :interval="1"
                        :enable-cross="false">
                        <template v-slot:dot="{ value, focus }">
                          <div :class="['custom-dot', { focus }]"></div>
                        </template>
                    </vue-slider>
                </div>
              </div>

              <div id="rta-plot">
                
                <div class="sliderRange">
                    <label class="labeltext">
                      MBT (1/day): <em>{{ rtaPlotSliderParams.sliderValues[0] }} - {{ rtaPlotSliderParams.sliderValues[1] }}</em>
                    </label> 
                    <vue-slider 
                        ref="slider"
                        v-model="rtaPlotSliderParams.sliderValues" 
                        :min="rtaPlotSliderParams.min" 
                        :max="rtaPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('rtaPlot')"
                        :interval="1"
                        :enable-cross="false">
                        <template v-slot:dot="{ value, focus }">
                          <div :class="['custom-dot', { focus }]"></div>
                        </template>
                    </vue-slider>
                </div>
              </div>

              <div id="rnp-plot">
                
                <div class="sliderRange">
                    <label class="labeltext">
                      MBT (1/day): <em>{{ rnpPlotSliderParams.sliderValues[0] }} - {{ rnpPlotSliderParams.sliderValues[1] }}</em>
                    </label> 
                    <vue-slider 
                        ref="slider"
                        v-model="rnpPlotSliderParams.sliderValues" 
                        :min="rnpPlotSliderParams.min" 
                        :max="rnpPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('rnpPlot')"
                        :interval="1"
                        :enable-cross="false">
                        <template v-slot:dot="{ value, focus }">
                          <div :class="['custom-dot', { focus }]"></div>
                        </template>
                    </vue-slider>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Plots',
  data () {
    return {
      width:500,
      height: 400,
      margin: {left: 70, top:20, right:20, bottom: 60},
      productionPlotSliderParams : {min: 0, max: 500, sliderValues: [0, 500]},
      rtaPlotSliderParams : {min: 0, max: 300, sliderValues: [0, 300]},
      rnpPlotSliderParams : {min: 0, max: 400, sliderValues: [0, 400]}
    }
  },
  computed: {
    plotsParams() {
      return this.$store.getters.newPlotsParameters;
    },
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.width - this.margin.top - this.margin.bottom;
    },
    productionPlotSliderValues() {
      return this.$store.getters.productionPlotSliderValues;
    },
    rtaPlotSliderValues() {
      return this.$store.getters.rtaPlotSliderValues;
    },
    rnpPlotSliderValues() {
      return this.$store.getters.rnpPlotSliderValues;
    }
  },
  watch: {
    plotsParams(val) {      
      this.updateInitVis('#production-plot', 'productionPlot', val);

      this.updateInitVis('#rta-plot', 'rtaPlot', val);

      this.updateInitVis('#rnp-plot', 'rnpPlot', val);
    },
    productionPlotSliderValues(updatedSliderValues) {
      console.log('pp plot slider updated')
      let productionPlotData = this.filterDatabyPlotTypeParams('time', 'q', this.plotsParams);      
      let selectedProductionPlotData = this.filterDataByUpdatedSliderValues(productionPlotData, updatedSliderValues,'time');
      this.updateInitVis('#production-plot', 'productionPlot', selectedProductionPlotData);
    },
    rtaPlotSliderValues(updatedSliderValues) {
      console.log('rta plot slider updated')
      let rtaPlotData = this.filterDatabyPlotTypeParams('MBT', 'q', this.plotsParams);
      let selectedRtaPlotData = this.filterDataByUpdatedSliderValues(rtaPlotData, updatedSliderValues,'MBT');
      this.updateInitVis('#rta-plot', 'rtaPlot', selectedRtaPlotData);
    },
    rnpPlotSliderValues(updatedSliderValues) {
      console.log('rnp plot slider updated')
      let rnpPlotData = this.filterDatabyPlotTypeParams('MBT', 'RNP', this.plotsParams);
      let selectedRnpPlotData = this.filterDataByUpdatedSliderValues(rnpPlotData, updatedSliderValues,'MBT');
      this.updateInitVis('#rnp-plot', 'rnpPlot', selectedRnpPlotData);
    }

  },  
  mounted() {
    this.initVis('#production-plot', 'productionPlot', this.plotsParams);

    this.initVis('#rta-plot', 'rtaPlot', this.plotsParams);  

    this.initVis('#rnp-plot', 'rnpPlot', this.plotsParams);  
  },
  methods: {
    reRenderPlotByUpdatedSliderValues(plotType) {
      let values = this[`${plotType}SliderParams`].sliderValues;
      let data = {
        plotType,
        values
      };
      this.$store.dispatch('getSliderValues', data);
    },
    // filtering the original data (with all object keys like time, q, MBT, ...) into two specific object keys like time & q or q & MBT
    filterDatabyPlotTypeParams(xAxisParam, yAxisParam, data) {
      let plotTypeParamsData = [];
      data.forEach(plotsDataSet => {        
        let singlePlotsParams = [];
        plotsDataSet.forEach(obj => {
          let newObj = { // to set object key by variable, in ES6, we have to put the variable in square brackets in order to evaluate it.
            [xAxisParam]: obj[xAxisParam],
            [yAxisParam]: obj[yAxisParam],
            endOfLinearFlowParams: obj.endOfLinearFlowParams
          };
          singlePlotsParams.push(newObj);
        });
        plotTypeParamsData.push(singlePlotsParams);
      });
      return plotTypeParamsData;
    },
    // filtering the output of dataFilter function to select the data based on what user select on the dual slider
    filterDataByUpdatedSliderValues(plotTypeData, updatedSliderValues, xAxisParam) {
      let selectedPlotTypeData = [];
      plotTypeData.forEach(dataArr => {
        let singlePlotsParams = dataArr.filter(obj => obj[xAxisParam] >= updatedSliderValues[0] && obj[xAxisParam] <= updatedSliderValues[1]);
        selectedPlotTypeData.push(singlePlotsParams);
      })
      return selectedPlotTypeData;
    },
    // Adding the new plot (generated from the new user inputs) to the existing plots on the page
    updateInitVis(parentElement, plotType, data) {
      let svgIdPart = this.createSvgIdPart(parentElement);

      d3.select(`#svg-${svgIdPart}`).remove();

      this.initVis(parentElement, plotType, data);
    },
    // getting the parent element id and eliminating #
    createSvgIdPart(parentElement) {
      let svgId = parentElement.split('');
      svgId.shift();
      return svgId.join('');
    },
    lineGenerator(xAxisParam, yAxisParam, xScale, yScale) {
        let path = d3.line()
              .x(d => xScale(d[xAxisParam]))
              .y(d => yScale(d[yAxisParam]));
        
        return path;
    },
    findAxesMinMax(data, xAxisParam, yAxisParam) {
        // finding the maximum x-axis range between all the arrays in data array (plots with different x ranges) ===> data = [ [...], [...], ...]
        let xAxisMin = parseInt(this.findMin(data, xAxisParam));
        let xAxisMax = parseInt(this.findMax(data, xAxisParam));

        // finding the minimum & maximum y-axis (range) between all the arrays in data array (plots with different y ranges) ===> data = [ [...], [...], ...]
        let yAxisMin = parseInt(this.findMin(data, yAxisParam));
        let yAxisMax = parseInt(this.findMax(data, yAxisParam));

        return {
          xAxisExtremse: [xAxisMin, xAxisMax],
          yAxisExtremse: [yAxisMin, yAxisMax]
        }

    },
    updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator, plotType) {

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // set color scale range
        colorScale.domain(data.map((d, index) => index)); // set color domain

        // Update axes
        xAxisCall.scale(xScale);
        xAxis.call(xAxisCall)

        yAxisCall.scale(yScale);
        yAxis.call(yAxisCall);

         // Update our line path
        g.selectAll('.line').data(data)
          .enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'red')
            .attr('d', pathGenerator)
            .attr('stroke', (d, index) => colorScale(index));

        // insertion of end of linear flow time line into the plots
        this.addEndOfLinearFlowTimeLine(plotType, data, xScale, yScale, g);        
    },
    // add a vertical line to each plot to show the end of linear flow time
    addEndOfLinearFlowTimeLine(plotType, data, xScale, yScale, g) {
      let xAxisLabel;
      let yAxisLabel;
      let verticalLineLabel;
      if (plotType === 'productionPlot') {
        xAxisLabel = 'time';
        yAxisLabel = 'q';
        verticalLineLabel = 'telf';
      } else if (plotType === 'rtaPlot') {
        xAxisLabel = 'MBT';
        yAxisLabel = 'q';
        verticalLineLabel = 'MBTelf';
      } else if (plotType === 'rnpPlot') {
        xAxisLabel = 'MBT';
        yAxisLabel = 'RNP';
        verticalLineLabel = 'MBTelf';
      }
      const distanceFromCurve = 5;
        data.forEach(dataSet => {
              g.append('line')
                .attr('x1', xScale(dataSet[0].endOfLinearFlowParams[xAxisLabel]))
                .attr('x2', xScale(dataSet[0].endOfLinearFlowParams[xAxisLabel]))
                .attr('y1', yScale(dataSet[0].endOfLinearFlowParams[yAxisLabel]))
                .attr('y2', this.innerHeight)
                .attr('stroke', 'green')
                .style('stroke-dasharray', ('3, 3'));
              
              g.append('text')
                .text(`${verticalLineLabel} = ${dataSet[0].endOfLinearFlowParams[xAxisLabel]}`)
                  .attr('fill', 'black')
                  .attr('x', `${xScale(dataSet[0].endOfLinearFlowParams[xAxisLabel])}`)
                  .attr('y', `${yScale(dataSet[0].endOfLinearFlowParams[yAxisLabel]) - distanceFromCurve}` )
                  .attr('text-anchor', 'start')
                  .attr('font-size', '0.8rem')
                  .attr('font-style', 'italic')
                  .style('fill', 'maroon') 
        })
    },
    // this method is called to dispaly all the plots with default values in the input section of the page when the page first loaded
    initVis(parentElement, plotType, data) {
      console.log('plot type :', plotType)
      // Creating & Adding svg to the page
      let svgIdPart = this.createSvgIdPart(parentElement);

      const svg = d3.select(parentElement)
            .append('svg')
            .attr('width', this.innerWidth + this.margin.left + this.margin.right)
            .attr('height', this.innerHeight + this.margin.top + this.margin.bottom)
            .attr('id', `svg-${svgIdPart}`);

      const g = svg.append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
        .attr('margin', 'auto')
      
      // Scales
      let xScale;
      let yScale;

      // scale definition
      if (plotType === 'productionPlot' || plotType === 'rnpPlot') {
          xScale = d3.scaleLinear().range([0, this.innerWidth]);
          yScale = d3.scaleLinear().range([this.innerHeight, 0]);

      } else if (plotType === 'rtaPlot') {
          xScale = d3.scaleLog().range([0, this.innerWidth]);
          yScale = d3.scaleLog().range([this.innerHeight, 0]); 
      } 

      // X-axis
      const xAxisCall = d3.axisBottom()
          .ticks(3, ",f")
          .tickFormat(d3.format(",.0f"));
    
      const xAxis = g.append('g')
          .attr('class', 'x axis')
          .attr('transform', `translate(0,${this.innerHeight})`);

      // Y-axis
      const yAxisCall = d3.axisLeft()
          .ticks(10)
          .tickFormat(d3.format(",.0f"));
      const yAxis = g.append('g')
          .attr('class', 'y axis');

      // Axes Labels
      let xLabel = g.append("text")
          .attr("y", this.innerHeight + 50)
          .attr("x", this.innerWidth/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          // .text("Time");
      let yLabel = g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -40 )
          .attr("x", -this.innerHeight/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          // .text("Rate")

      // const t = () => d3.transition().duration(1000);     

      
        // Update scales
        if (plotType === 'productionPlot') {
            // x label & y label
            xLabel.text('Time');
            yLabel.text('Rate');

            // finding the minimum & maximum y-axis (range) between all the arrays in data array (plots with different y ranges) ===> data = [ [...], [...], ...]
            let {xAxisExtremse, yAxisExtremse} = this.findAxesMinMax(data, 'time', 'q');

            if (xAxisExtremse[1] >= this.productionPlotSliderParams.max) {
              this.setSliderExtremeThenSliderValue(xAxisExtremse[1], [this.productionPlotSliderParams.sliderValues[0] , xAxisExtremse[1]], 'productionPlot', 'max');
            }

            if (xAxisExtremse[0] <= this.productionPlotSliderParams.min) {
              this.setSliderExtremeThenSliderValue(xAxisExtremse[0], [xAxisExtremse[0] , this.productionPlotSliderParams.sliderValues[1]], 'productionPlot', 'min');
            }

            // Path generator
            let pathGenerator = this.lineGenerator('time', 'q', xScale, yScale);

            xScale.domain(xAxisExtremse);
            yScale.domain(yAxisExtremse);

            // update axes & line path
            this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator, 'productionPlot');


        } else if (plotType === 'rtaPlot') {
            // x label & y label
            xLabel.text('MBT');
            yLabel.text('Rate');

            // finding the minimum & maximum y-axis (range) between all the arrays in data array (plots with different y ranges) ===> data = [ [...], [...], ...]
            let {xAxisExtremse, yAxisExtremse} = this.findAxesMinMax(data, 'MBT', 'q');

            if (xAxisExtremse[0] < this.rtaPlotSliderParams.min) {
              this.setSliderExtremeThenSliderValue(xAxisExtremse[0], [xAxisExtremse[0], this.rtaPlotSliderParams.sliderValues[1]], 'rtaPlot', 'min');
            }
 
            if (xAxisExtremse[1] > this.rtaPlotSliderParams.max) {
              this.setSliderExtremeThenSliderValue(xAxisExtremse[1], [this.rtaPlotSliderParams.sliderValues[0] ,xAxisExtremse[1]], 'rtaPlot', 'max');
            }

            // Path generator
            let pathGenerator = this.lineGenerator('MBT', 'q', xScale, yScale);

            xScale.domain(xAxisExtremse);
            // x.domain([0, 10000]);
            yScale.domain(yAxisExtremse);

            // update axes & line path
            this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator, 'rtaPlot');


            // tooltip ----------------------------------------------------------------------------
            // tooltip ----------------------------------------------------------------------------

          //   let updatedData = [];
          //   data.forEach((dataItem, i) => {
          //     let updatedDataItem = [];
          //     dataItem.forEach(obj => {
          //       obj = {...obj, index: String(i)}
          //       updatedDataItem.push(obj)
          //     });
          //     updatedData.push(updatedDataItem)
          //   })
          //   console.log('updated data: ', updatedData)

          //   let nestedData = [];
          //   updatedData.forEach((dataItem, i) => {
          //     let obj = {key: String(i), values: dataItem};
          //     nestedData.push(obj)
          //   })


          //   console.log('nested data', nestedData)

          //   let lineStroke = '3px';

          //   let tooltip = d3.select("#rta-plot").append("div")
          //     .attr('id', 'tooltip')
          //     .style('position', 'absolute')
          //     .style("background-color", "#D3D3D3")
          //     .style('padding', 6)
          //     .style('display', 'none')

          //   let mouseG = g.append("g")
          //     .attr("class", "mouse-over-effects");

          //   mouseG.append("path") // create vertical line to follow mouse
          //     .attr("class", "mouse-line")
          //     .style("stroke", "#A9A9A9")
          //     .style("stroke-width", lineStroke)
          //     .style("opacity", "0");

          //   // let lines = document.getElementsByClassName('line');

          //   let mousePerLine = mouseG.selectAll('.mouse-per-line')
          //     .data(nestedData)
          //     .enter()
          //     .append("g")
          //     .attr("class", "mouse-per-line");

          //   mousePerLine.append("circle")
          //     .attr("r", 4)
          //     // .style("stroke", function (d) {
          //     //   return color(d.key)
          //     // })
          //     .style("fill", "red")
          //     .style("stroke-width", lineStroke)
          //     .style("opacity", "0");

          //     let heightInner = this.innerHeight;
          //     let self = this;


          // mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
          //   .attr('width', this.innerWidth) 
          //   .attr('height', this.innerHeight)
          //   .attr('fill', 'none')
          //   .attr('pointer-events', 'all')
          //   .on('mouseout', function () { // on mouse out hide line, circles and text
          //     d3.select(".mouse-line")
          //       .style("opacity", "0");
          //     d3.selectAll(".mouse-per-line circle")
          //       .style("opacity", "0");
          //     d3.selectAll(".mouse-per-line text")
          //       .style("opacity", "0");
          //     d3.selectAll("#tooltip")
          //       .style('display', 'none')

          //   })
          //   .on('mouseover', function () { // on mouse in show line, circles and text
          //     d3.select(".mouse-line")
          //       .style("opacity", "1");
          //     d3.selectAll(".mouse-per-line circle")
          //       .style("opacity", "1");
          //     d3.selectAll("#tooltip")
          //       .style('display', 'block')
          //   })
          //   .on('mousemove', function () { // update tooltip content, line, circles and text when mouse moves
          //     let mouse = d3.mouse(this)

          //     d3.selectAll(".mouse-per-line")
          //       .attr("transform", function (d, i) {
          //         let xMBT = xScale.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
          //         let bisect = d3.bisector(function (d) { return d.MBT; }).left // retrieve row index of date on parsed csv
          //         let idx = bisect(d.values, xMBT);


          //         d3.select(".mouse-line")
          //           .attr("d", function () {
          //             let data = "M" + xScale(d.values[idx].MBT) + "," + (heightInner);
          //             data += " " + xScale(d.values[idx].MBT) + "," + 0;

          //             return data;
          //           });

          //         return "translate(" + xScale(d.values[idx].MBT) + "," + yScale(d.values[idx].q) + ")";

          //       });

          //       self.updateTooltipContent(mouse, nestedData, xScale, tooltip)

          //   });

          // -------------- tooltip ----------------------------------------------------------------------------
          // -------------- tooltip ----------------------------------------------------------------------------

                      

        } else if (plotType === 'rnpPlot') {
            // x label & y label
            xLabel.text('MBT');
            yLabel.text('(Pi - Pwf)/q');

            // finding the minimum & maximum y-axis (range) between all the arrays in data array (plots with different y ranges) ===> data = [ [...], [...], ...]
            let {xAxisExtremse, yAxisExtremse} = this.findAxesMinMax(data, 'MBT', 'RNP');

            if (xAxisExtremse[0] < this.rnpPlotSliderParams.min) {
              this.setSliderExtremeThenSliderValue(xAxisExtremse[0], [xAxisExtremse[0], this.rnpPlotSliderParams.sliderValues[1]], 'rnpPlot', 'min');
            }
 
            if (xAxisExtremse[1] > this.rnpPlotSliderParams.max) {
              this.setSliderExtremeThenSliderValue(xAxisExtremse[1], [this.rnpPlotSliderParams.sliderValues[0] ,xAxisExtremse[1]], 'rnpPlot', 'max');
            }

            // Path generator
            let pathGenerator = this.lineGenerator('MBT', 'RNP', xScale, yScale);

            xScale.domain(xAxisExtremse);
            // x.domain([0, 10000]);
            yScale.domain(yAxisExtremse);

            // update axes & line path
            this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator, 'rnpPlot');
        }
  
            
    },
    // updateTooltipContent(mouse, nestedData, xScale, tooltip) {
    //     // --------------------------- updata function
    //     let sortingObj = []

    //     nestedData.map(d => {
    //       let xMBT = xScale.invert(mouse[0])
    //       let bisect = d3.bisector(d => d.MBT).left;
    //       console.log('bisect: ', bisect)
    //       let idx = bisect(d.values, xMBT);
    //       sortingObj.push({
    //         index: d.values[idx].index,
    //         q: d.values[idx].q, 
    //         MBT: d.values[idx].MBT
    //       })
    //     });

    //     sortingObj.sort(function(x, y){
    //       return d3.descending(x.q, y.q);
    //     })

    //     // var sortingArr = sortingObj.map(d=> d.key)

    //     // var nestedData1 = nestedData.slice().sort(function(a, b){
    //     //   return sortingArr.indexOf(a.key) - sortingArr.indexOf(b.key) // rank vehicle category based on price of premium
    //     // })

    //     // tooltip.html(sortingObj[0].month + "-" + sortingObj[0].year + " (Bidding No:" + sortingObj[0].bidding_no + ')')

    //     tooltip
    //     .html(`rate: ${sortingObj[0].q}`)
    //       .style('display', 'block')
    //       .style('left', d3.event.pageX + 'px')
    //       .style('top', d3.event.pageY + 'px')
    //       .style('font-size', 11.5)
    //       .selectAll()
    //       .data(nestedData).enter() // for each vehicle category, list out name and price of premium
    //       .append('div')
    //       // .style('color', d => {
    //       //   return color(d.key)
    //       // })
    //       .style('font-size', 10)
    //       .html(d => {
    //         let xMBT = xScale.invert(mouse[0])
    //         let bisect = d3.bisector(function (d) { return d.MBT; }).left
    //         let idx = bisect(d.values, xMBT)
    //         return `rate: ${d.values[idx].q}`
    //       })
    // },

    setSliderExtremeThenSliderValue (value, setVal, plotType, valueType) {
    	if  (plotType === 'productionPlot') {
        this.productionPlotSliderParams[valueType] = value;
      } else if (plotType === 'rtaPlot') {
        this.rtaPlotSliderParams[valueType] = value;
      } else if (plotType === 'rnpPlot') {
        this.rnpPlotSliderParams[valueType] = value;
      }
      this.$nextTick(() => {
      	this.$refs.slider.setValue(setVal)
      })
    },
    // find the maximum of any object key (time, q, MBT, ...) in the data array ===> data = [ [...], [...], ...]
    findMax(data, key) {
      let maxArr = [];
      data.forEach(dataItem => {
        let itemMax = d3.max(dataItem, d => +(d[key]));
        maxArr.push(itemMax);
      });

      return Math.max(...maxArr);
    },
    // find the minimum of any object key (time, q, MBT, ...) in the data array ===> data = [ [...], [...], ...]
    findMin(data, key) {
      let minArr = [];
      data.forEach(dataItem => {
        let itemMin = d3.min(dataItem, d => +(d[key]));
        minArr.push(itemMin);
      });

      return Math.min(...minArr);
    }         
    


  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
