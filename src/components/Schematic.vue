<template>
    <div class="schematic">
        <div class="schematic-box">
            <div class="schematic-box-header">Well - Hydraulic Fracture Schematic</div>
            <div class="schematic-box-content">
              <div>
                <svg width="31.25rem" :height="svgHeight">
                  <g id="fracture-spacing">
                    <rect x="10" :y="svgHeight/4" :width="0.9 * svgWidth" :height="svgHeight/1.7" stroke="#c7b49b" fill="#c7b49b" />
                    <path d="M30,100 l360, 0 q30,-10 40 -50 v-45" stroke="blue" stroke-width="10px" fill="none" />
                    <!-- dotted green lines -->
                    <g id="horizontal-well-section-lines">
                      <line x1="99" y1="60" x2="99" y2="140" stroke="green" stroke-width="3" stroke-dasharray="5 5" />
                      <line x1="201" y1="60" x2="201" y2="140" stroke="green" stroke-width="3" stroke-dasharray="5 5" />
                    </g>
                    <!-- fracture lines -->
                    <g id="fracture-lines">
                      <line id="first-line" :x1="defaultFirstFractureXCoordinate" y1="60" :x2="defaultFirstFractureXCoordinate" y2="140" stroke="orange" stroke-width="2" />
                      <line id="second-line" :x1="defaultLastFractureXCoordinate" y1="60" :x2="defaultLastFractureXCoordinate" y2="140" stroke="orange" stroke-width="2" />
                    </g>
                    
                    <defs id="arrow-heads">
                        <marker fill="#fff" id="rightArrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" >
                          <path d="M0,0 L0,6 L6,3 z" fill="#000" />
                        </marker>
                        <marker fill="#fff" id="leftArrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse" >
                            <path d="M0,0 L0,6 L6,3 z" fill="#000"  />
                        </marker> 
                    </defs>

                     <line id="fracture-spacing-arrow-line" :x1="defaultFirstFractureXCoordinate" y1="53" :x2="defaultLastFractureXCoordinate" y2="53" fill="#fff" stroke="#fff" stroke-width="1" marker-start="url(#leftArrow)" marker-end="url(#rightArrow)" />
                     <text x="20" y="40" text-anchor="start" fill="#75592f" font-weight="bold" >fracture spacing (ye): {{ fractureSpacing }} ft </text>

                     <line id="horizontal-well-section-length" :x1="defaultFirstFractureXCoordinate" y1="145" :x2="defaultLastFractureXCoordinate" y2="145" fill="#fff" stroke="#fff" stroke-width="1" marker-start="url(#leftArrow)" marker-end="url(#rightArrow)" />
                     <text x="60" y="165" text-anchor="start" fill="#75592f" font-weight="bold" >horizontal well section: {{ defaultFractureSpacing > 200 ? defaultFractureSpacing : horizontalWellSection }} ft </text>

                     <!-- <text x="100" y="160" text-anchor="start" fill="#fff" >hydraulic fracture</text>
                     <path d="M70,130 l20,20 " stroke="#fff"  marker-end="url(#rightArrow)" /> -->

                     <path d="M300,100 l20,20 " stroke="#fff"  marker-end="url(#rightArrow)" />
                     <text x="300" y="140" text-anchor="start" fill="blue" >horizontal well</text>
                     
                  </g>
                </svg>
              </div>

              <div>
                <svg width="31.25rem" :height="svgHeight">
                  <g id="fracture-area">
                    <path d="M100,92.5 q-5,5 0,10" fill="blue" stroke="black" />
                    <!-- <path d="M100, 92.5 l300,0" /> -->
                    <path d="M400, 91.5 l-300,0 l0,12 l300,0 l-3.5,-3.5 l0,-3.5 l3.5,-3.5 z" fill="blue" />
                    <ellipse cx="400" cy="97.5" rx="3" ry="5" fill="none" stroke="black" />                    
       
                    <!-- fracture area & fracture half length arrow -->
                    <path id="parallelogram" d="M220,70 l57,-40 l0,95 l-57,40 l0,-95" stroke="red" stroke-dasharray="10 10 " stroke-width="2" fill="#ffd737" /> 
                    <path id="fracture-half-length-arrow" d="M250,42 l24,-17" stroke="black" fill="black" marker-start="url(#leftArrow)" marker-end="url(#rightArrow)" />
                    <text x="55" y="30" text-anchor="start" fill="#75592f" font-weight="bold" >fracture half-length (xf) = {{ defaultFractureHalfLength }} ft</text>

                    <path id="horizontal-well-cover-curve" d="M250,92.5 q-5,5 0,10" fill="none" stroke="black" />

                    <path id="horizontal-well-cover" d="M250,92 l27,0 l0,11 l-27,0 l-3,-3 l0,-5 l3,-3" stroke="blue" fill="blue" />

                       <!-- vertical line - fracture height -->
                    <line id="horizontal-well-dottedline" x1="250" y1="54" x2="250" y2="140" stroke="black" stroke-dasharray="8 8" marker-start="url(#leftArrow)" marker-end="url(#rightArrow)" />

                    <line x1="360" y1="50" x2="330" y2="50" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="350" y1="65" x2="320" y2="65" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="360" y1="80" x2="330" y2="80" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />

                    <line x1="360" y1="120" x2="330" y2="120" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="350" y1="135" x2="320" y2="135" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="360" y1="150" x2="330" y2="150" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />   

                    <line x1="130" y1="50" x2="160" y2="50" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="140" y1="65" x2="170" y2="65" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="130" y1="80" x2="160" y2="80" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />               

                    <line x1="130" y1="120" x2="160" y2="120" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="140" y1="135" x2="170" y2="135" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />
                    <line x1="130" y1="150" x2="160" y2="150" stroke="green" stroke-width="2" marker-end="url(#rightArrow)" />    

                    <text x="370" y="70" text-anchor="start" fill="green">linear flow</text>           
                    <text x="410" y="102" text-anchor="start" fill="blue">horizontal well</text>   

                    <line x1="252" y1="130" x2="300" y2="180" id="fracture-height-arrow" stroke="#75592f" stroke-width="1" marker-end="url(#rightArrow)" />
                    <text x="310" y="190" text-anchor="start" fill="#75592f" font-weight="bold">fracture height</text>
                    
                  </g>
                </svg>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Schematic',
  data () {
    return {
      svgWidth: 500,
      svgHeight: 200,
      fractureWidth: 5,
      fractureHeight: 70,
      defaultFractureSpacing: 200,
      horizontalWellSection: 200, // the green dotted line: part of the well to view the fracture spacing & the number of fractures
      defaultFractureHalfLength: 50,
      defaultFirstFractureXCoordinate: 100,
      defaultLastFractureXCoordinate: 200
    }
  },
  computed: {
    // fractureData() {
    //   return this.$store.getters.allFractureData;
    // },
    fractureSpacing() {
      return this.$store.getters.fractureSpacing;
    },
    fractureHalfLength() {
      return this.$store.getters.fractureHalfLength;
    }
  },
  watch: {
    // fractureData(updatedFractureData) {
    //   // this.changeFractureHeight(updatedFractureData.fractureHeight);
    // }
    fractureSpacing(updatedFractureSpacing) {
      this.changeFractureSpacing(updatedFractureSpacing);
      this.defaultFractureSpacing = updatedFractureSpacing;
    },
    fractureHalfLength(updatedFractureHalfLength) {
      this.changeFractureHalfLength(updatedFractureHalfLength);
      this.defaultFractureHalfLength = updatedFractureHalfLength;
    }
  },
  mounted() {
    const defaultFractureSpacing = this.$store.getters.fractureSpacing;
    this.changeFractureSpacing(defaultFractureSpacing);    
  },
  methods: {
    changeFractureSpacing(updatedFractureSpacing) {
      const horizontalWellSection = this.horizontalWellSection;
      const x1 = 100;
      const x2 = 200;
      // const x1 = d3.select('#fracture-lines')._groups[0]['0'].firstChild.x1.baseVal.value;
      // const x2 = d3.select('#fracture-lines')._groups[0]['0'].lastChild.x1.baseVal.value;
      const mathematicalFractureSpacing = x2 - x1;
      d3.select('#fracture-lines').remove();

      let fractureLinesXCoordinates = [];
      if (updatedFractureSpacing <= horizontalWellSection) {
        const fracturePairNumber = Math.floor(horizontalWellSection/updatedFractureSpacing);
        console.log('frac pair number:', fracturePairNumber);

        const distanceReducedFromhorizontalWellSection = horizontalWellSection % updatedFractureSpacing;

        const mathematicalDistanceReducedFromMathematicalFrcatureSpacing = mathematicalFractureSpacing * distanceReducedFromhorizontalWellSection / horizontalWellSection;

        const firstFractureLineXCoordinate = x1 + mathematicalDistanceReducedFromMathematicalFrcatureSpacing/2;

        fractureLinesXCoordinates.push(firstFractureLineXCoordinate);

        const mathematicalUpdatedFractureSpacing = updatedFractureSpacing * mathematicalFractureSpacing / horizontalWellSection;        

        let newFractureLineXCoordinate = firstFractureLineXCoordinate;
        for (let i=1; i<=fracturePairNumber; i++) {
          newFractureLineXCoordinate = newFractureLineXCoordinate + mathematicalUpdatedFractureSpacing;
          fractureLinesXCoordinates.push(newFractureLineXCoordinate);
        };     
      } else {
        d3.select('#horizontal-well-section-lines').remove();
        d3.select('#horizontal-well-section-length').remove();

        const mathematicalUpdatedFractureSpacing = updatedFractureSpacing * mathematicalFractureSpacing / horizontalWellSection;

        const addedDistanceToFractureLinesXCoordinate = (mathematicalUpdatedFractureSpacing - mathematicalFractureSpacing) / 2;

        const firstFractureLineXCoordinate = x1 - addedDistanceToFractureLinesXCoordinate;

        const lastFractureLineXCoordinate = x2 + addedDistanceToFractureLinesXCoordinate;

        fractureLinesXCoordinates.push(firstFractureLineXCoordinate);
        fractureLinesXCoordinates.push(lastFractureLineXCoordinate);        

        const g = d3.select('#fracture-spacing')
          .append('g').attr('id', 'horizontal-well-section-lines');

        const horizontalWellSectionXCoordinates = [firstFractureLineXCoordinate - 1, lastFractureLineXCoordinate + 1];

        // Adding vertical green dotted lines to the horizontal well section 
        horizontalWellSectionXCoordinates.forEach(x => {
          g.append('line')             
            .attr('x1', x)
            .attr('y1', 60)
            .attr('x2', x)         
            .attr('y2', 140)
            .attr('stroke', 'green')
            .attr('stroke-width', '3')
            .attr('stroke-dasharray', '5 5')
        });

        // Adding arrow line to the horizontal well section (length of horizontal well section)
        d3.select('#fracture-spacing').append('line')
            .attr('id', 'horizontal-well-section-length')             
            .attr('x1', horizontalWellSectionXCoordinates[0])
            .attr('y1', 145)
            .attr('x2', horizontalWellSectionXCoordinates[1])         
            .attr('y2', 145)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr("marker-start", "url(#leftArrow)")
            .attr("marker-end", "url(#rightArrow)")
            .style('fill', '#fff')
      };



      const g = d3.select('#fracture-spacing').append('g').attr('id', 'fracture-lines');
      fractureLinesXCoordinates.forEach(x => {
        g.append('line') 
        .attr('x1', x)
        .attr('y1', 60)
        .attr('x2', x)         
        .attr('y2', 140)
        .attr('stroke', 'orange')
        .attr('stroke-width', '2')
      });

      d3.select('#fracture-spacing-arrow-line').remove();

      g.append('line')
        .attr('id', 'fracture-spacing-arrow-line')
        .attr('x1', fractureLinesXCoordinates[0] + 4)
        .attr('y1', 53)
        .attr('x2', fractureLinesXCoordinates[1] - 4)         
        .attr('y2', 53)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr("marker-start", "url(#leftArrow)")
        .attr("marker-end", "url(#rightArrow)")

    },
    changeFractureHalfLength(fractureHalfLength) {
      const dAttributeString = d3.select('#parallelogram').attr('d');

      const dAttributeArray = dAttributeString.split(' ');

      const startingPointsCoordinatesArray = dAttributeArray[0].split('');
      const commaIndexStartPoint = startingPointsCoordinatesArray.findIndex(item => item === ',');

      const currentXStartPoint = Number(startingPointsCoordinatesArray.slice(1, commaIndexStartPoint).join(''));
      const currentYStartPoint = Number(startingPointsCoordinatesArray.slice(commaIndexStartPoint+1).join(''));

      // getting the half length of the fracture page from the d attribute  
      const dAttributeArrayFractureHalfString = dAttributeArray[1];
      const commaIndexEndPoint = dAttributeArrayFractureHalfString.split('').findIndex(item => item === ',');
  
      // selcting & removing the current fracture area path from the page
      const g = d3.select('#fracture-area');
      g.select('#parallelogram').remove();

      // changing the fracture half-length

      const xStartPoint = 220; // x value of the starting point of the fracture half-length line
      const yStartPoint = 70;  // y value of the starting point of the fracture half-length line

      const xEndPoint = 277; // x value of the ending point of the fracture half-length line
      const yEndPoint = 30; // y value of the ending point of the fracture half-length line

      const slope = -0.70175; // slope of current line (y = -0.70175x + 224.386) of fracture half-length 
      const intercept = 224.386; // intercept of current line (y = -0.70175x + 224.386) of fracture half-length  

      const deltaX = fractureHalfLength/7;    // change in x value of any point on the current line (y = -0.70175x + 224.386) of fracture half-length 
      const updatedXStartPoint = xStartPoint - deltaX; //current x value of starting point of the line 
      const updatedYStartPoint = slope * updatedXStartPoint + intercept;  //current y value of starting point of the line 
 
      const updatedXEndPoint = xEndPoint + deltaX; // current x value of ending point of the line 
      const updatedYEndPoint = slope * updatedXEndPoint + intercept; // current y value of ending point of the line 
 
      const deltaLengthX = 2 * deltaX + xEndPoint - xStartPoint; // increase in length in the x direction from the new starting point
      const deltaLengthY = (updatedYStartPoint - yStartPoint) + (yStartPoint - yEndPoint) + (yEndPoint - updatedYEndPoint); // increase in length in the y direction from the new starting point  

      // adding the updated fracture area path to the page
      const d = `M${updatedXStartPoint},${updatedYStartPoint} l${deltaLengthX},${-deltaLengthY} l0,95 l${-deltaLengthX},${deltaLengthY} l0,-95`;

      // fracture half length decreases

      g.append('path')
        .attr('id', 'parallelogram')
        .attr('d', d)
        .attr('stroke', 'red')
        .attr('stroke-width', '2')
        .attr('stroke-dasharray', '10 10')
        .attr('fill', '#ffd737');    

      d3.select('#horizontal-well-cover').remove();
      g.append('path') // *
        .attr('id', 'horizontal-well-cover')
        .attr('d', 'M250,92 l57,0 l0,11 l-57,0 l-3,-3 l0,-5 l3,-3')
        .attr('stroke', 'blue')
        .attr('fill', 'blue');
  
      d3.select('#horizontal-well-cover-curve').remove();
      g.append('path') // *
        .attr('id', 'horizontal-well-cover-curve')
        .attr('d', 'M250,92.5 q-5,5 0,10')
        .attr('stroke', 'black')
        .attr('fill', 'none');

      // changing the length of the fracture half length arrow on the fracture area
      const currentXArrowStartPoint = 250;
      const currentYArrowStartPoint = 42;
      const currentXArrowEndPoint = 272;
      const currentYArrowEndPoint = 25;

      // the straight line equation parameters from points (240, 45) & (275, 20) 
      const arrowSlope = -0.70175;
      const arrowIntercept = 218.4545455;

      const updatedXArrowStartPoint = currentXArrowStartPoint - deltaX/5; // ****
      const updatedYArrowStartPoint = arrowSlope * updatedXArrowStartPoint + arrowIntercept; // ****
      const updatedXArrowEndPoint = currentXArrowEndPoint + deltaX;
      const updatedYArrowEndPoint = arrowSlope * updatedXArrowEndPoint + arrowIntercept;

      const arrowDeltaLengthX = updatedXArrowEndPoint - updatedXArrowStartPoint; // ****
      const arrowDeltaLengthY = updatedYArrowEndPoint - updatedYArrowStartPoint; // ****

      // selcting & removing the current half length fracture arrow path from the page
      d3.select('#fracture-half-length-arrow').remove();
      
      // generating the dynamic half length fracture arrow path
      const arrowDAttribute = `M${updatedXArrowStartPoint},${updatedYArrowStartPoint} l${arrowDeltaLengthX},${arrowDeltaLengthY}`;

      // adding the updated half length fracture arrow path to the page
      g.append('path')
        .attr('d', arrowDAttribute)
        .attr('id', 'fracture-half-length-arrow')
        .attr('stroke', 'black')
        .attr('fill', 'none')
        .attr("marker-start", "url(#leftArrow)")
        .attr("marker-end", "url(#rightArrow)")

      // <line x1="250" y1="54" x2="250" y2="140" stroke="black" stroke-dasharray="8 8" marker-start="url(#leftArrow)" marker-end="url(#rightArrow)" />
      d3.select('#horizontal-well-dottedline').remove();
      g.append('line') // *
        .attr('id', 'horizontal-well-dottedline')
        .attr('x1', 250)
        .attr('y1', 54)
        .attr('x2', 250)         
        .attr('y2', 140)
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '8 8')
        .attr("marker-start", "url(#leftArrow)")
        .attr("marker-end", "url(#rightArrow)");

      d3.select('#fracture-height-arrow').remove();
      g.append('line')
        .attr('id', 'fracture-height-arrow')
        .attr('x1', 252)
        .attr('y1', 130)
        .attr('x2', 300)         
        .attr('y2', 180)
        .attr('stroke', '#75592f')
        .attr('stroke-width', '1')
        .attr("marker-end", "url(#rightArrow)")
        
    }
    // changeFractureHeight(fractureHeight) {
    //   const dAttributeString = d3.select('#parallelogram').attr('d');
    //   const dAttributeArray = dAttributeString.split(' ');

    //   // getting the half length of the fracture page from the d attribute in the form of string (top side & bottom side of fracture page)
    //   const dAttributeHalfLengthStringTop = dAttributeArray[1]; // *****
    //   const dAttributeHalfLengthStringBottom = dAttributeArray[3]; // *****    
   
    //   // getting the height length of the fracture page from the d attribute  
    //   const dAttributeArrayFractureHeightString = dAttributeArray[2];
    //   const currentFractureHeightLength = Number(dAttributeArrayFractureHeightString.split('').splice(3).join('')); // *****      
     
    //   // getting the current x & y start point of the fracture page from the d attribute
    //   const dAttributeHalfLengthStartPointString= dAttributeArray[0];
    //   const dAttributeHalfLengthStartPointArray = dAttributeHalfLengthStartPointString.split('');
    //   // get x
    //   const commaIndexStartPoint = dAttributeHalfLengthStartPointArray.findIndex(item => item === ',');
    //   const currentXStartPoint = Number(dAttributeHalfLengthStartPointArray.slice(1, commaIndexStartPoint-1).join('')); // *****

    //   // get y
    //   const currentYStartPoint = Number(dAttributeHalfLengthStartPointArray.slice(commaIndexStartPoint+1).join('')); // *****

    //   // getting the current x & y end point of the fracture page from the d attribute
    //   const dAttributeHalfLengthArrayTop = dAttributeHalfLengthStringTop.split('');
    //   const commaIndexEndPoint = dAttributeHalfLengthArrayTop.findIndex(item => item === ',');

    //   const currentXEndPoint = Number(dAttributeHalfLengthArrayTop.slice(1, commaIndexEndPoint).join('')); // *****
    //   const currentYEndPoint = Number(dAttributeHalfLengthArrayTop.slice(commaIndexEndPoint+1).join('')); // ****

    //   const g = d3.select('#fracture-area');
    //   g.select('#parallelogram').remove();

    //   const slope = -0.70175; // slope of current line (y = -0.70175x + 224.386) of fracture half-length 
    //   const intercept = 224.386; // intercept of current line (y = -0.70175x + 224.386) of fracture half-length        

    //   const deltaY = fractureHeight/7;    // change in x value of any point on the current line (y = -0.70175x + 224.386) of fracture half-length 

    //   const updatedFractureHeightLength = currentFractureHeightLength + deltaY;

    //   // const updatedXStartPoint = xStartPoint - deltaX; //current x value of starting point of the line 
    //   const updatedYStartPoint = currentYStartPoint - deltaY/2;  //current y value of starting point of the line 
 
    //   // const updatedXEndPoint = xEndPoint + deltaX; // current x value of ending point of the line 
    //   const updatedYEndPoint = currentYEndPoint - deltaY/2; // current y value of ending point of the line 
 

    //   const d = `M${currentXStartPoint},${updatedYStartPoint} ${dAttributeHalfLengthStringTop} l0,${updatedFractureHeightLength} ${dAttributeHalfLengthStringBottom} l0,${-updatedFractureHeightLength}`;
      
    //   g.append('path')
    //     .attr('id', 'parallelogram')
    //     .attr('d', d)
    //     .attr('stroke', 'red')
    //     .attr('stroke-width', '2')
    //     .attr('stroke-dasharray', '1 1')
    //     .attr('fill', 'yellow')

    // }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>