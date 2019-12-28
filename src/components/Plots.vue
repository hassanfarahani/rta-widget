<template>
    <div class="plots">                     
        <div class="plots-box">
            <div class="plots-box-header">Plots</div>
            <div class="plots-box-graphs">
              <div id="production-plot">
                
                <RangeSlider label="p_p" :min="0" :max="1000" :initVal="[0, 1000]" sliderTitle="Time" />
              </div>
              <div id="rta-plot">
                
                <RangeSlider label="rta_p" :min="0" :max="3000" :initVal="[0, 3000]" sliderTitle="MBT" />
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import RangeSlider from '@/components/RangeSlider.vue'

export default {
  name: 'Plots',
  components: {
    RangeSlider
  },
  data () {
    return {
      width:500,
      height: 400,
      margin: {left: 70, top:20, right:20, bottom: 60},
    }
  },
  computed: {
    plotsParams() {
      // console.log('plots - computed', this.$store.getters.newPlotsParameters)
      return this.$store.getters.newPlotsParameters;
    },
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.width - this.margin.top - this.margin.bottom;
    },
    p_p_sliderValues() {
      return this.$store.getters.p_p_sliderValues;
    },
    rta_p_sliderValues() {
      return this.$store.getters.rta_p_sliderValues;
    }
  },
  watch: {
    plotsParams(val) {      
      this.updateInitVis('#production-plot', 'p_p', val);

      this.updateInitVis('#rta-plot', 'rta_p', val);
    },
    p_p_sliderValues(val) {
      let p_p_data = this.dataFilter('time', 'q', this.plotsParams);
      let new_p_p_data = this.filterDataValues(p_p_data, val,'time');
      this.updateInitVis('#production-plot', 'p_p', new_p_p_data);
    },
    rta_p_sliderValues(val) {
      let rta_p_data = this.dataFilter('MBT', 'q', this.plotsParams);
      let new_rta_p_data = this.filterDataValues(rta_p_data, val,'MBT');
      this.updateInitVis('#rta-plot', 'rta_p', new_rta_p_data);
    }
  },  
  mounted() {
    this.initVis('#production-plot', 'p_p', this.plotsParams);

    this.initVis('#rta-plot', 'rta_p', this.plotsParams);  
  },
  methods: {
    // filtering the original data (with all object keys like time, q, MBT, ...) into two specific object keys like time & q or q & MBT
    dataFilter(keyOne, keyTwo, data) {
      let allPlotsParams = [];
      data.forEach(plotsDataSet => {        
        let singlePlotsParams = [];
        plotsDataSet.forEach(obj => {
          let newObj = { // to set object key by variable, in ES6, we have to put the variable in square brackets in order to evaluate it.
            [keyOne]: obj[keyOne],
            [keyTwo]: obj[keyTwo]
          };
          singlePlotsParams.push(newObj);
        });
        allPlotsParams.push(singlePlotsParams);
      });
      return allPlotsParams;
    },
    // filtering the output of dataFilter function to select the data based on what user select on the dual slider
    filterDataValues(data, val, keyOne) {
      let allDataArr = [];
      data.forEach(dataArr => {
        let singlePlotsParams = dataArr.filter(obj => obj[keyOne] >= val[0] && obj[keyOne] <= val[1]);
        allDataArr.push(singlePlotsParams);
      })
      return allDataArr;
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
    lineGenerator(xVal, yVal, x, y) {
        let path = d3.line()
              .x(d => x(d[xVal]))
              .y(d => y(d[yVal]));
        
        return path;
    },
    // this method is called to dispaly all the plots with default values in the input section of the page when the page first loaded
    initVis(parentElement, plotType, data) {
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
      let x;
      let y;

      if (plotType === 'p_p') {
          x = d3.scaleLinear().range([0, this.innerWidth]);
          y = d3.scaleLinear().range([this.innerHeight, 0]);
      } else if (plotType === 'rta_p') {
          x = d3.scaleLog().range([0, this.innerWidth]);
          y = d3.scaleLog().range([this.innerHeight, 0]);
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
        
        // finding the minimum & maximum y-axis (range) between all the arrays in data array (plots with different y ranges) ===> data = [ [...], [...], ...]
        let max_q = this.findMax(data, 'q');
        let min_q = this.findMin(data, 'q');
        
        let pathGenerator;
        // Update scales
        if (plotType === 'p_p') {
            // x label & y label
            xLabel.text('Time');
            yLabel.text('Rate');

            // finding the maximum x-axis range between all the arrays in data array (plots with different x ranges) ===> data = [ [...], [...], ...]
            let max_time = this.findMax(data, 'time');

            x.domain([1, max_time]);
            y.domain([min_q, max_q]);

            // Path generator
            pathGenerator = this.lineGenerator('time', 'q', x, y);

        } else if (plotType === 'rta_p') {
            // x label & y label
            xLabel.text('MBT');
            yLabel.text('Rate');
            // finding the maximum x-axis range between all the arrays in data array ===> data = [ [...], [...], ...]
            let max_MBT = this.findMax(data, 'MBT');

            x.domain([1, max_MBT]);
            y.domain([min_q, max_q]);

            // Path generator
            pathGenerator = this.lineGenerator('MBT', 'q', x, y);
        }

        let nestedData = [];
        data.forEach((dataItem, index) => {
          let newDataItem = {
            key: index,
            values: dataItem
          };
          nestedData.push(newDataItem);
        });

        // Update axes
        xAxisCall.scale(x);
        xAxis.call(xAxisCall);
        // xAxis.transition(t()).call(xAxisCall);
        yAxisCall.scale(y);
        yAxis.call(yAxisCall);
        // yAxis.transition(t()).call(yAxisCall);

        // Update our line path
        g.selectAll('.line').data(nestedData)
          .enter().append('path')
            .attr('class', 'line')
            // .attr('fill', 'none')
            .attr('d', d => pathGenerator(d.values));
              
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
