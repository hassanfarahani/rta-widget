import * as d3 from 'd3';
export const plotsMixin = {
    data () {
        return {
          width:500,
          height: 400,
          margin: {left: 70, top:20, right:20, bottom: 60},
          productionPlotSliderParams : {min: 2, max: 3, sliderValues: [2, 3]},
          rtaPlotSliderParams : {min: 2, max: 3, sliderValues: [2, 3]},
          rnpPlotSliderParams : {min: 2, max: 3, sliderValues: [2, 3]},
          sqrtPlotSliderParams : {min: 5, max: 6, sliderValues: [5, 6]}
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
        },
        sqrtPlotSliderValues() {
            return this.$store.getters.sqrtPlotSliderValues;
        }
    },
    watch: {
        plotsParams(val) {      
            // this.updateLoadPlots('#production-plot', 'productionPlot', val);

            // this.updateLoadPlots('#rta-plot', 'rtaPlot', val);

            // this.updateLoadPlots('#rnp-plot', 'rnpPlot', val);

            // this.updateLoadPlots('#sqrt-plot', 'sqrtPlot', val);
    },
    productionPlotSliderValues(updatedSliderValues) {
        // console.log('pp plot slider updated')
        let productionPlotData = this.filterDatabyPlotTypeParams('time', 'q', this.plotsParams);      
        let selectedProductionPlotData = this.filterDataByUpdatedSliderValues(productionPlotData, updatedSliderValues,'time');
        this.updateLoadPlots('#production-plot', 'productionPlot', selectedProductionPlotData);
    },
    rtaPlotSliderValues(updatedSliderValues) {
        // console.log('rta plot slider updated')
        let rtaPlotData = this.filterDatabyPlotTypeParams('MBT', 'q', this.plotsParams);
        let selectedRtaPlotData = this.filterDataByUpdatedSliderValues(rtaPlotData, updatedSliderValues,'MBT');
        this.updateLoadPlots('#rta-plot', 'rtaPlot', selectedRtaPlotData);
    },
    rnpPlotSliderValues(updatedSliderValues) {
        // console.log('rnp plot slider updated')
        let rnpPlotData = this.filterDatabyPlotTypeParams('MBT', 'RNP', this.plotsParams);
        let selectedRnpPlotData = this.filterDataByUpdatedSliderValues(rnpPlotData, updatedSliderValues,'MBT');
        this.updateLoadPlots('#rnp-plot', 'rnpPlot', selectedRnpPlotData);
    },
    sqrtPlotSliderValues(updatedSliderValues) {
        // console.log('sqrt plot slider updated')
        let sqrtPlotData = this.filterDatabyPlotTypeParams('t_sqrt', 'RNP', this.plotsParams);
        let selectedSqrtPlotData = this.filterDataByUpdatedSliderValues(sqrtPlotData, updatedSliderValues,'t_sqrt');
        this.updateLoadPlots('#sqrt-plot', 'sqrtPlot', selectedSqrtPlotData);
    }

    }, 
    created() {
    // let initialRangeSlidersValues = this.$store.getters.initialRangeSlidersValues;
    // const plotTypeArray = ['productionPlot', 'rtaPlot', 'rnpPlot'];
    // plotTypeArray.forEach(plotType => {
    //   this.setSliderExtremeThenSliderValue(Math.floor(initialRangeSlidersValues[plotType][0]), [initialRangeSlidersValues[plotType][0], this[`${plotType}SliderParams`].sliderValues[1]], plotType, 'min');
    //   this.setSliderExtremeThenSliderValue(Math.ceil(initialRangeSlidersValues[plotType][1]), [this[`${plotType}SliderParams`].sliderValues[0], initialRangeSlidersValues[plotType][1]], plotType, 'max');
    // }) 

    // this.productionPlotSliderParams.min = initialRangeSlidersValues.productionPlot[0];
    // this.productionPlotSliderParams.max = initialRangeSlidersValues.productionPlot[1];
    // this.productionPlotSliderParams.sliderValues = [initialRangeSlidersValues.productionPlot[0], initialRangeSlidersValues.productionPlot[1]];

    // this.rtaPlotSliderParams.min = initialRangeSlidersValues.rtaPlot[0];
    // this.rtaPlotSliderParams.max = initialRangeSlidersValues.rtaPlot[1];
    // this.rtaPlotSliderParams.sliderValues = [initialRangeSlidersValues.rtaPlot[0], initialRangeSlidersValues.rtaPlot[1]];

    // this.rnpPlotSliderParams.min = initialRangeSlidersValues.rnpPlot[0];
    // this.rnpPlotSliderParams.max = initialRangeSlidersValues.rnpPlot[1];
    // this.rnpPlotSliderParams.sliderValues = [initialRangeSlidersValues.rnpPlot[0], initialRangeSlidersValues.rnpPlot[1]];     
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
        // console.log('filtered data p-p:', selectedPlotTypeData)
        return selectedPlotTypeData;
    },
    // Adding the new plot (generated from the new user inputs) to the existing plots on the page
    updateLoadPlots(parentElement, plotType, data) {
        let svgIdPart = this.createSvgIdPart(parentElement);

        d3.select(`#svg-${svgIdPart}`).remove();

        this.loadPlots(parentElement, plotType, data);
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
    updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator, plotType, xAxisParam, yAxisParam, verticalLineLabel) {

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // set color scale range
        colorScale.domain(data.map((d, index) => index)); // set color domain

        
        // Update axes
        xAxisCall.scale(xScale);
        xAxis.call(xAxisCall)

        yAxisCall.scale(yScale);
        yAxis.call(yAxisCall);

        console.log('before line path:', data)

            // Update our line path
        const lineN = g.selectAll('.line').data(data)
            .enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'red')
            .attr('d', pathGenerator)
            .attr('stroke', (d, index) => colorScale(index));

        // line chart animation
        let totalLength = [];
        lineN._groups[0].forEach(path => {
            totalLength.push(path.getTotalLength());
        });

        lineN._groups[0].forEach((path, i) => {
            d3.select(path)
            .attr('stroke-dasharray', totalLength[i] + ' ' + totalLength[i])
            .attr('stroke-dashoffset', totalLength[i])
            .transition()
                .duration(1000)
                // .ease('linear')
                .attr("stroke-dashoffset", 0);
        });

        // insertion of end of linear flow time line into the plots
        this.addEndOfLinearFlowTimeLine(plotType, data, xScale, yScale, g, xAxisParam, yAxisParam, verticalLineLabel);  
        
        // add tooltip to the plot when user hover 
        this.addTooltipByHovering(data, xScale, yScale, g, xAxisParam, yAxisParam)
    },
    // add a vertical line to each plot to show the end of linear flow time
    addEndOfLinearFlowTimeLine(plotType, data, xScale, yScale, g, xAxisParam, yAxisParam, verticalLineLabel) {

        const distanceFromCurve = 5;
        data.forEach(dataSet => {
                // check to make sure end of linear flow line is in the range of x axis 
                if (dataSet[0].endOfLinearFlowParams[xAxisParam] <= dataSet[0][xAxisParam] ) {
                return
                } else {
                g.append('line')
                .attr('x1', xScale(dataSet[0].endOfLinearFlowParams[xAxisParam]))                
                .attr('y1', yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]))
                .attr('x2', xScale(dataSet[0].endOfLinearFlowParams[xAxisParam]))                
                .attr('y2', yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]))
                .transition().duration(1000)
                .attr('x2', xScale(dataSet[0].endOfLinearFlowParams[xAxisParam]))
                .attr('y2', this.innerHeight)
                .attr('stroke', 'green')
                .style('stroke-dasharray', ('3, 3'));
                
                g.append('text')
                .text(`${verticalLineLabel} = ${dataSet[0].endOfLinearFlowParams[xAxisParam]}`)
                    .attr('fill', 'black')
                    .attr('x', `${xScale(dataSet[0].endOfLinearFlowParams[xAxisParam])}`)
                    .attr('y', `${yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]) - distanceFromCurve}` )
                    .attr('text-anchor', 'start')
                    .attr('font-size', '0.8rem')
                    .attr('font-style', 'italic')
                    .style('fill', 'maroon') 
                }
        })
    },
    addTooltipByHovering(data, xScale, yScale, g, xAxisParam, yAxisParam) { 
        
        let bisect = d3.bisector(d => d[xAxisParam]).left;

        let focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");            
            

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", -this.innerHeight);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", 0)
            .attr("x2", this.innerWidth);

        focus.append("circle")
            .attr("r", 7.5);
        
        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 150)
            .attr("height", 50)
            .attr("x", 20)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-x")
            .attr("x", 28)
            .attr("y", -2);  

        focus.append("text")
            .attr("class", "tooltip-y")
            .attr("x", 28)
            .attr("y", 18); 

        let y2 = this.innerHeight;

        g.append("rect")
            .attr("class", "overlay")
            .attr("width", this.innerWidth)
            .attr("height", this.innerHeight)
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => focus.style("display", "none"))
            .on("mousemove", mousemove);

        function mousemove() {
            let x0 = xScale.invert(d3.mouse(this)[0])
                let i = bisect(data[0], x0)
                let d0 = data[0][i - 1]
                let d1 = data[0][i]
                let d = x0 - d0[xAxisParam] > d1[xAxisParam] - x0 ? d1 : d0;
            focus.attr('transform', `translate(${xScale(d[xAxisParam])}, ${yScale(d[yAxisParam])})`);
            focus.select('.tooltip-x').text(`${xAxisParam} = ${d[xAxisParam]}`);
            focus.select('.tooltip-y').text(`${yAxisParam} = ${d[yAxisParam]}`);
            focus.select('.x-hover-line').attr('y2', y2 - yScale(d[yAxisParam]) );
            focus.select('.y-hover-line').attr('x2', -xScale(d[xAxisParam]));

        }
    },
    updateSliderAndGenerateLinePath(plotType ,xAxisLabel, yAxisLabel, xAxisParam, yAxisParam, xScale, yScale, xLabel, yLabel, g, dataArrayWithNoZeroLengthItem, xAxis, yAxis, xAxisCall, yAxisCall, verticalLineLabel) {
        // x label & y label
        xLabel.text(xAxisLabel);
        yLabel.text(yAxisLabel);

        // finding the minimum & maximum y-axis (range) between all the arrays in data array (plots with different y ranges) ===> data = [ [...], [...], ...]
        let {xAxisExtremse, yAxisExtremse} = this.findAxesMinMax(dataArrayWithNoZeroLengthItem, xAxisParam, yAxisParam);

        if (xAxisExtremse[1] >= this[`${plotType}SliderParams`].max) {
            this.setSliderExtremeThenSliderValue(xAxisExtremse[1], [this[`${plotType}SliderParams`].sliderValues[0] , xAxisExtremse[1]], plotType, 'max');
        }

        if (xAxisExtremse[0] <= this[`${plotType}SliderParams`].min) {
            this.setSliderExtremeThenSliderValue(xAxisExtremse[0], [xAxisExtremse[0] , this[`${plotType}SliderParams`].sliderValues[1]], plotType, 'min');
        }

        // Path generator
        let pathGenerator = this.lineGenerator(xAxisParam, yAxisParam, xScale, yScale);

        xScale.domain(xAxisExtremse);
        yScale.domain(yAxisExtremse);

        // update axes & line path
        this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, dataArrayWithNoZeroLengthItem, pathGenerator, plotType, xAxisParam, yAxisParam, verticalLineLabel);
    },
    // this method is called to dispaly all the plots with default values in the input section of the page when the page first loaded
    loadPlots(parentElement, plotType, data) {
        // console.log('plot type :', plotType)
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

        } else if (plotType === 'rtaPlot' || plotType === 'sqrtPlot') {
            xScale = d3.scaleLog().range([0, this.innerWidth]);
            yScale = d3.scaleLog().range([this.innerHeight, 0]); 
        } 

        // X-axis
        const xAxisCall = d3.axisBottom()
            .ticks(10, ",f")
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
            .attr("font-size", "15px")
            .attr("font-style", "italic")
            .attr("text-anchor", "middle")
            // .text("Time");
        let yLabel = g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40 )
            .attr("x", -this.innerHeight/2)
            .attr("font-size", "15px")
            .attr("font-style", "italic")
            .attr("text-anchor", "middle")
            // .text("Rate")

        let xAxisLabel; // x axis label of each plot
        let yAxisLabel; // y axis label of each plot
        let xAxisParam; // x axis property value (time, MBT or sqrt(t) ) in the data object
        let yAxisParam; // y axis property value (q, RNP ) in the data object
        let verticalLineLabel;

        if (plotType === 'productionPlot') {
        xAxisLabel = 'Time (days)';
        yAxisLabel = 'Rate (STBD)';
        xAxisParam = 'time';
        yAxisParam = 'q';
        verticalLineLabel = 't@elf';
        }

        if (plotType === 'rtaPlot') {
        xAxisLabel = 'MBT (stb/stbd)';
        yAxisLabel = 'Rate (STBD)';
        xAxisParam = 'MBT';
        yAxisParam = 'q';
        verticalLineLabel = 'MBT@elf';
        }

        if (plotType === 'rnpPlot') {
        xAxisLabel = 'MBT (stb/stbd)';
        yAxisLabel = '(Pi - Pwf)/q';
        xAxisParam = 'MBT';
        yAxisParam = 'RNP';
        verticalLineLabel = 'MBT@elf';
        }

        if (plotType === 'sqrtPlot') {
        xAxisLabel = 'sqrt(t)';
        yAxisLabel = '(Pi - Pwf)/q';
        xAxisParam = 't_sqrt';
        yAxisParam = 'RNP';
        verticalLineLabel = 'sqrt(t)@elf';
        }

        // const t = () => d3.transition().duration(1000);    

        // data = [[{}, ..], [{}, ..], ...]
        // elimination of the items in the data array, which has zero length due to the range of x-axis values that user select by the range slider
        let dataArrayWithNoZeroLengthItem = [];
        data.forEach(dataArr => {
            if (dataArr.length !== 0) {
            dataArrayWithNoZeroLengthItem.push(dataArr);
            }
        });
            
        this.updateSliderAndGenerateLinePath(plotType ,xAxisLabel, yAxisLabel, xAxisParam, yAxisParam, xScale, yScale, xLabel, yLabel, g, dataArrayWithNoZeroLengthItem, xAxis, yAxis, xAxisCall, yAxisCall, verticalLineLabel);          
    },
    setSliderExtremeThenSliderValue (value, setVal, plotType, valueType) {

        this[`${plotType}SliderParams`][valueType] = value;
        // this.$nextTick(() => {
        // 	this.$refs.slider.setValue(setVal);
        // })
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
};