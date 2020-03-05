import * as d3 from 'd3';
import { event as currentEvent} from 'd3-selection'
// import { event } from 'd3-selection'

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
    // this method is called to dispaly all the plots with default values when the page first loaded
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
            .attr('class', 'x--axis')
            .attr('transform', `translate(0,${this.innerHeight})`);

        // Y-axis
        const yAxisCall = d3.axisLeft()
            .ticks(10)
            .tickFormat(d3.format(",.0f"));
        const yAxis = g.append('g')
            .attr('class', 'y--axis');

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
            
        this.updateSliderAndGenerateLinePath(plotType ,xAxisLabel, yAxisLabel, xAxisParam, yAxisParam, xScale, yScale, xLabel, yLabel, g, dataArrayWithNoZeroLengthItem, xAxis, yAxis, xAxisCall, yAxisCall, verticalLineLabel, svg);          
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
    updateSliderAndGenerateLinePath(plotType ,xAxisLabel, yAxisLabel, xAxisParam, yAxisParam, xScale, yScale, xLabel, yLabel, g, dataArrayWithNoZeroLengthItem, xAxis, yAxis, xAxisCall, yAxisCall, verticalLineLabel, svg) {
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
        this.updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, dataArrayWithNoZeroLengthItem, pathGenerator, plotType, xAxisParam, yAxisParam, verticalLineLabel, xAxisExtremse, yAxisExtremse, svg);
    },
    updateAxesAndLinePath(xAxis, xAxisCall, yAxis, yAxisCall, xScale, yScale, g, data, pathGenerator, plotType, xAxisParam, yAxisParam, verticalLineLabel, xAxisExtremse, yAxisExtremse, svg) {

           
        // Update axes
        xAxisCall.scale(xScale);
        xAxis.call(xAxisCall)

        yAxisCall.scale(yScale);
        yAxis.call(yAxisCall);

        console.log('before line path:', data)

        // opacity values to be applied on a multiline chart
        const opacityValues = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55,0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];

        let dataLength = data.length;
        let selectedOpacities = [];
        const increaseInNextSelectedIndexOfOpacityValuesArray = Math.floor(opacityValues.length/dataLength);

        for (let i=0; i<dataLength; i++) {            
            selectedOpacities.push(opacityValues[i * increaseInNextSelectedIndexOfOpacityValuesArray]);
        };
        selectedOpacities = selectedOpacities.reverse(); 
        
        // Add a clipPath: everything out of this area won't be drawn
        g.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', this.innerWidth)
                .attr('height', this.innerHeight);
        
        // Add brushing
        var brush = d3.brush()
        // .extent( [ [0,0], [this.innerWidth,this.innerHeight] ] )
        .on("end", () => {           

            var s = d3.event.selection;
            console.log('s:', s)
  
            if (!s) {
              if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                xScale.domain(xAxisExtremse);
                yScale.domain(yAxisExtremse);
            } else {
                console.log('x0:',xScale.invert(s[0][0]))
                console.log('x1:',xScale.invert(s[1][0]))
                xScale.domain([xScale.invert(s[0][0]), xScale.invert(s[1][0])]);
                // xScale.domain([s[0][0] * this.innerHeight/this.innerWidth, s[1][0]].map(xScale.invert, xScale));               
                yScale.domain([s[1][1], s[0][1] * this.innerHeight/this.innerWidth].map(yScale.invert, yScale));

                //  yScale.domain([yScale.invert(s[1][1]), yScale.invert(s[0][1])]);
                svg.select(".brush").call(brush.move, null);
            }
            // zoom();
            var t = svg.transition().duration(750);
            svg.select(".x--axis").transition(t).call(xAxisCall);
            g.select(".y--axis").transition(t).call(yAxisCall);

            g.selectAll(".line").transition(t)
                .attr("d", d => pathGenerator(d))
                // .attr("d", pathGenerator)
                // .attr('stroke', (d, index) => 'green')
                // .attr('stroke-opacity', (d, index) =>  `${selectedOpacities[index]}`)
                // .style('stroke-dasharray', (d, index) => index === data.length-1 ? '' : '5 5')
                // .style('fill','none')
        }),

        idleTimeout,
        idleDelay = 350;

        // Create the area variable: where both the area and the brush take place
        var main = g.append('g')
        .attr('class', 'main')
        .attr('clip-path', 'url(#clip)');
    
        // var drag = d3.drag().on('drag', () => {
        //     console.log('drag:', d3.event.x)
        //     d3.selectAll('.line')
        //     .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
        //     g.select(".axis--x").call(xAxisCall);
        //     g.select(".axis--y").call(yAxisCall);
        // });
        
        svg.append("g")
            .attr("class", "brush")
            .call(brush);  

       // add tooltip to the plot when user hover 
       this.addTooltipByHovering(data, xScale, yScale, svg, g, xAxisParam, yAxisParam)


        // Update our line path
        // const lines = g.selectAll('.line').data(data)
        const lines = main.selectAll('.line').data(data)
            .enter().append('path')
            .attr('class', 'line')
            .attr('d', pathGenerator)
            // .attr('stroke', (d, index) => colorScale(index))
            .attr('stroke', (d, index) => 'green')
            .attr('stroke-opacity', (d, index) =>  `${selectedOpacities[index]}`)
            .style('stroke-dasharray', (d, index) => index === data.length-1 ? '' : '5 5')
            .style('fill','none')

        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }
      
        // line chart animation
        let totalLength = [];
        lines._groups[0].forEach(path => {
            totalLength.push(path.getTotalLength());
        });

        lines._groups[0].forEach((path, i) => {
            d3.select(path)
            .attr('stroke-dasharray', totalLength[i] + ' ' + totalLength[i])
            .attr('stroke-dashoffset', totalLength[i])
            .transition()
                .duration(1000)
                // .ease('linear')
                .attr("stroke-dashoffset", 0);
        });


        // insertion of end of linear flow time line into the plots
        // this.addEndOfLinearFlowTimeLine(plotType, data, xScale, yScale, g, xAxisParam, yAxisParam, verticalLineLabel); 
    },  
    addTooltipByHovering(data, xScale, yScale, svg, g, xAxisParam, yAxisParam) { 

        const mouseG = g.append('g')
            .attr('class', 'mouse-over-effects')
            .style("display", "none"); 

        mouseG.append('path') // this is the black vertical line to follow mouse
            .attr('class', 'mouse-line')
            .style('stroke', 'black')
            .style('stroke-width', '2px')
            .style('opacity', '0');

        let lines = document.getElementsByClassName('line');     

        let mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'mouse-per-line');

        mousePerLine.append('circle')
            .attr('r', 3)
            .style('stroke', 'red')
            .style('fill', 'red')
            .style('stroke-width', '1px')
            .style('opacity', '0');

        mousePerLine.append('text')
            .attr('transform', 'translate(10,3)');
        const innerHeight = this.innerHeight;

        // g.append('rect') // append a rect to catch mouse movements on canvas
        svg.select('.overlay') // append a rect to catch mouse movements on canvas
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
        .attr('margin', 'auto')
        .attr('width', this.innerWidth) // can't catch mouse events on a g element
        .attr('height', innerHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', () => { // on mouse out hide line, circles and text
          d3.selectAll('.mouse-line')
            .style('opacity', '0');
          d3.selectAll('.mouse-per-line circle')
            .style('opacity', '0');
          d3.selectAll('.mouse-per-line text')
            .style('opacity', '0');
            mouseG.style('display', 'none')
        })
        .on('mouseover', () => { // on mouse in show line, circles and text
          d3.selectAll('.mouse-line')
            .style('opacity', '1');
          d3.selectAll('.mouse-per-line circle')
            .style('opacity', '1');
          d3.selectAll('.mouse-per-line text')
            .style('opacity', '1');
            mouseG.style('display', null)
        })
        .on('mousemove', function() { // mouse moving over canvas
          let mouse = d3.mouse(this);
          d3.selectAll('.mouse-line')
            .attr('d', () => {
              let d = `M${mouse[0]},${innerHeight}`;
              d += ` ${ mouse[0]},${0}`;   
              return d;
            });

          d3.selectAll('.mouse-per-line')
            .attr('transform', function(d, i) {
              
              let beginning = 0,
                  end = lines[i].getTotalLength(),
                  target = null;
              let pos;
              while (true){
                target = Math.floor((beginning + end) / 2);
                pos = lines[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                    break;
                }
                if (pos.x > mouse[0])      end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
              };             
              
              d3.select(this).select('text')
                .text(yScale.invert(pos.y).toFixed(2));
                // .text(`${xScale.invert(pos.x).toFixed(1)}, ${yScale.invert(pos.y).toFixed(2)}`);
                
              return `translate(${mouse[0]},${pos.y})`;
            });
        });
    },  
    // add a vertical line to each plot to show the end of linear flow time
    addEndOfLinearFlowTimeLine(plotType, data, xScale, yScale, g, xAxisParam, yAxisParam, verticalLineLabel) {

        const distanceFromCurve = 5;
        // console.log('data end of linear:', data[0][0].endOfLinearFlowParams[yAxisParam])
        data.forEach(dataSet => {
                // check to make sure end of linear flow line is in the range of x axis 
                if (dataSet[0].endOfLinearFlowParams[xAxisParam] <= dataSet[0][xAxisParam] ) {
                    return
                } else {
                    console.log('yAxisParam :', yAxisParam)
                    console.log('test no yScale :', dataSet[0].endOfLinearFlowParams[yAxisParam])
                    console.log('test with yScale:', yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]))
                    g.append('line')
                    .attr('x1', xScale(dataSet[0].endOfLinearFlowParams[xAxisParam]))                
                    .attr('y1', yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]))
                    .attr('x2', xScale(dataSet[0].endOfLinearFlowParams[xAxisParam]))                
                    .attr('y2', yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]))
                    .transition().duration(1000)
                    .attr('x2', xScale(dataSet[0].endOfLinearFlowParams[xAxisParam]))
                    .attr('y2', this.innerHeight)
                    .attr('stroke', 'brown')
                    .style('stroke-dasharray', ('3, 3'));
                    
                    g.append('text')
                    .text(`${verticalLineLabel} = ${dataSet[0].endOfLinearFlowParams[xAxisParam]}`)
                        .attr('fill', 'black')
                        .attr('x', `${xScale(dataSet[0].endOfLinearFlowParams[xAxisParam])}`)
                        .attr('y', `${yScale(dataSet[0].endOfLinearFlowParams[yAxisParam]) - distanceFromCurve}` )
                        .attr('text-anchor', 'start')
                        .attr('font-size', '0.5rem')
                        .attr('font-style', 'italic')
                        .style('fill', 'maroon') 
                }
        })
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