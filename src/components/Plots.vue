<template>
    <div class="plots">                     
        <div class="plots-box">
            <div class="plots-box-header">Plots</div>
            <div class="plots-box-graphs">
              <div id="production-plot">
                
                <div class="sliderRange">
                    <label class="labeltext">Time</label> 
                    <vue-slider 
                        ref="slider" 
                        v-model="productionPlotSliderParams.sliderValues" 
                        :min="productionPlotSliderParams.min" 
                        :max="productionPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('productionPlot')" 
                        :interval="1"
                        :enable-cross="false">
                    </vue-slider>
                </div>
              </div>

              <div id="rta-plot">
                
                <div class="sliderRange">
                    <label class="labeltext">MBT</label> 
                    <vue-slider 
                        ref="slider"
                        v-model="rtaPlotSliderParams.sliderValues" 
                        :min="rtaPlotSliderParams.min" 
                        :max="rtaPlotSliderParams.max" 
                        @change="reRenderPlotByUpdatedSliderValues('rtaPlot')"
                        :interval="1"
                        :enable-cross="false">
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
      productionPlotSliderParams : {min: 0, max: 300, sliderValues: [0, 300]},
      rtaPlotSliderParams : {min: 0, max: 300, sliderValues: [0, 300]}
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
    }
  },
  watch: {
    plotsParams(val) {      
      this.updateInitVis('#production-plot', 'productionPlot', val);

      this.updateInitVis('#rta-plot', 'rtaPlot', val);
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

  },  
  mounted() {
    this.initVis('#production-plot', 'productionPlot', this.plotsParams);

    this.initVis('#rta-plot', 'rtaPlot', this.plotsParams);  
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
            [yAxisParam]: obj[yAxisParam]
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
    updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator) {

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // set color scale range
        colorScale.domain(data.map((d, index) => index)); // set color domain

        // const t = () => d3.transition().duration(100); 

        // Update axes
        xAxisCall.scale(xScale);
        xAxis.call(xAxisCall);
        // xAxis.transition(t()).call(xAxisCall);
        yAxisCall.scale(yScale);
        yAxis.call(yAxisCall);

        // Update our line path
        g.selectAll('.line').data(data)
          .enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'red')
            // .transition(t())
            .attr('d', pathGenerator)
            .attr('stroke', (d, index) => colorScale(index));
    },
    // this method is called to dispaly all the plots with default values in the input section of the page when the page first loaded
    initVis(parentElement, plotType, data) {

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
      if (plotType === 'productionPlot') {
          xScale = d3.scaleLinear().range([0, this.innerWidth]);
          yScale = d3.scaleLinear().range([this.innerHeight, 0]);
      } else if (plotType === 'rtaPlot') {
          xScale = d3.scaleLog().range([0, this.innerWidth]);
          yScale = d3.scaleLog().range([this.innerHeight, 0]);
      }
    
      // X-axis
      const xAxisCall = d3.axisBottom()
          // .ticks(4);
      const xAxis = g.append('g')
          .attr('class', 'x axis')
          .attr('transform', `translate(0,${this.innerHeight})`);

      // Y-axis
      const yAxisCall = d3.axisLeft()
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
            this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator);


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
            this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator);
        }    
              
    },
    setSliderExtremeThenSliderValue (value, setVal, plotType, valueType) {
    	if  (plotType === 'productionPlot') {
        this.productionPlotSliderParams[valueType] = value;
      } else  {
        this.rtaPlotSliderParams[valueType] = value;
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
