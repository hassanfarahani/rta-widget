<template>
    <div class="inputs">
        <div class="inputs-box"> 
            <div class="inputs-box-header">Input</div>

            <div class="inputs-box-content">                       
                <div class="reservoir-type">                    
                    <select name="reservoir-type" class="reservoir-type-select">
                        <option value="OIL" selected>Oil</option>
                        <option value="GAS">Gas</option>
                    </select>
                </div>
                <div class="units">
                    <span class="units-label">
                        <label>Units</label>
                    </span>

                    <span class="units-values">
                        <input type="radio" class="unit-type" name="unit" value="field"> Field &ensp; 
                        <input type="radio" class="unit-type" name="unit" value="metric"> Metric
                    </span>
                </div>
            </div> 
            
            <div class="inputs-box-properties">
                <div class="properties-title">Rock Properties</div>
                <div class="properties rock-properties">
                    <!-- porosity -->
                    <fragment v-if="modifiedSlidersProperties[0].display">
                        <div class="property-name tooltip">&Phi; <span class="tooltiptext">porosity</span></div>
                        <div class="property-unit">fraction</div>
                        <div class="property-value">
                            <input type="text" class="user-input" v-model="modifiedSlidersProperties[0].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[0].min" 
                                :max="modifiedSlidersProperties[0].max" 
                                :step="modifiedSlidersProperties[0].step" 
                                id="porosity" 
                                class="slider" 
                                v-model="modifiedSlidersProperties[0].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[0]}">
                        </div>
                    </fragment>

                    <!-- permeability -->
                    <fragment v-if="modifiedSlidersProperties[1].display">
                        <div class="property-name tooltip">K <span class="tooltiptext">permeability</span></div>
                        <div class="property-unit">md</div>
                        <div class="property-value">
                            <input type="text" class="user-input"  v-model="modifiedSlidersProperties[1].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[1].min" 
                                :max="modifiedSlidersProperties[1].max" 
                                :step="modifiedSlidersProperties[1].step" 
                                id="permeability" 
                                class="slider"
                                v-model="modifiedSlidersProperties[1].value"
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[1]}">
                        </div>
                    </fragment>

                    <!-- fracture half-length -->
                    <fragment v-if="modifiedSlidersProperties[2].display">
                        <div class="property-name tooltip">X<sub>f</sub> <span class="tooltiptext">effective fracture half-length </span></div>
                        <div class="property-unit">ft</div>
                        <div class="property-value">
                            <input type="text" value="100" class="user-input" v-model="modifiedSlidersProperties[2].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[2].min" 
                                :max="modifiedSlidersProperties[2].max"
                                :step="modifiedSlidersProperties[2].step" 
                                id="fracHalfLength" 
                                class="slider"
                                v-model="modifiedSlidersProperties[2].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[2]}">
                        </div>
                    </fragment>
                    
                    <!-- fracture height -->
                    <fragment v-if="modifiedSlidersProperties[3].display">
                        <div class="property-name tooltip">h<sub>f</sub> <span class="tooltiptext">effective fracture height</span></div>
                        <div class="property-unit">ft</div>
                        <div class="property-value">
                            <input type="text" value="100" class="user-input" v-model="modifiedSlidersProperties[3].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[3].min" 
                                :max="modifiedSlidersProperties[3].max"
                                :step="modifiedSlidersProperties[3].step" 
                                id="fracHeight" 
                                class="slider"
                                v-model="modifiedSlidersProperties[3].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[3]}">
                        </div>
                    </fragment>

                    <!-- fracture spacing  -->
                    <fragment v-if="modifiedSlidersProperties[4].display">
                        <div class="property-name tooltip">y<sub>e</sub> <span class="tooltiptext">fracture spacing</span></div>
                        <div class="property-unit">ft</div>
                        <div class="property-value">
                            <input type="text" value="100" class="user-input" v-model="modifiedSlidersProperties[4].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[4].min" 
                                :max="modifiedSlidersProperties[4].max" 
                                :step="modifiedSlidersProperties[4].step"
                                id="fracSpacing" 
                                class="slider"
                                v-model="modifiedSlidersProperties[4].value" 
                                @input="calculateSliderColorPercent"
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[4]}">
                        </div>
                    </fragment>

                    <!-- number of fractures -->
                    <fragment v-if="modifiedSlidersProperties[5].display">
                        <div class="property-name tooltip">n<sub>f</sub> <span class="tooltiptext">number of fractures</span></div>
                        <div class="property-unit"></div>
                        <div class="property-value">
                            <input type="text" value="1" class="user-input" v-model="modifiedSlidersProperties[5].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[5].min" 
                                :max="modifiedSlidersProperties[5].max"
                                :step="modifiedSlidersProperties[5].step" 
                                id="fracNum" 
                                class="slider"
                                v-model="modifiedSlidersProperties[5].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[5]}">
                        </div>
                    </fragment>
                    
                    <!-- compressibility -->
                    <fragment v-if="modifiedSlidersProperties[6].display">
                        <div class="property-name tooltip">C<sub>t</sub> <span class="tooltiptext">total compressibility</span></div>
                        <div class="property-unit">1/psi</div>
                        <div class="property-value">
                            <input type="text" value="5E-05" class="user-input" v-model="modifiedSlidersProperties[6].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[6].min" 
                                :max="modifiedSlidersProperties[6].max" 
                                :step="modifiedSlidersProperties[6].step" 
                                id="compressibility" 
                                class="slider"
                                v-model="modifiedSlidersProperties[6].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[6]}">
                        </div>
                    </fragment>
                </div>

                <div class="properties-title">Fluid Properties</div>
                <div class="properties rock-properties">
                    <!-- reservoir pressure -->
                    <fragment v-if="modifiedSlidersProperties[7].display">
                        <div class="property-name tooltip">P<sub>i</sub> <span class="tooltiptext">initial reservoir pressure</span></div>
                        <div class="property-unit">psia</div>
                        <div class="property-value">
                            <input type="text" value="5000" class="user-input" v-model="modifiedSlidersProperties[7].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[7].min" 
                                :max="modifiedSlidersProperties[7].max" 
                                :step="modifiedSlidersProperties[7].step"
                                id="resPressure" 
                                class="slider"
                                v-model="modifiedSlidersProperties[7].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[7]}">
                        </div>
                    </fragment>

                    <!-- flowing wellbore pressure -->
                    <fragment v-if="modifiedSlidersProperties[8].display">
                        <div class="property-name tooltip">P<sub>wf</sub> <span class="tooltiptext">measured sandface pressure</span></div>
                        <div class="property-unit">psia</div>
                        <div class="property-value">
                            <input type="text" value="1000" class="user-input" v-model="modifiedSlidersProperties[8].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[8].min" 
                                :max="modifiedSlidersProperties[8].max"
                                :step="modifiedSlidersProperties[8].step" 
                                id="flowingWellPressure" 
                                class="slider"
                                v-model="modifiedSlidersProperties[8].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[8]}">
                        </div>
                    </fragment>

                    <!-- FVF -->
                    <fragment v-if="modifiedSlidersProperties[9].display">
                        <div class="property-name tooltip">B<sub>o</sub> <span class="tooltiptext">formation volume factor</span></div>
                        <div class="property-unit">rb/STB</div>
                        <div class="property-value">
                            <input type="text" value="1.2" class="user-input" v-model="modifiedSlidersProperties[9].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[9].min" 
                                :max="modifiedSlidersProperties[9].max" 
                                :step="modifiedSlidersProperties[9].step" 
                                id="FVF" 
                                class="slider"
                                v-model="modifiedSlidersProperties[9].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[9]}">
                        </div>
                    </fragment>
                    
                    <!-- viscosity -->
                    <fragment v-if="modifiedSlidersProperties[10].display">
                        <div class="property-name tooltip">&mu;<sub>o</sub> <span class="tooltiptext">viscosity</span></div>
                        <div class="property-unit">cp</div>
                        <div class="property-value">
                            <input type="text" value="0.5" class="user-input" v-model="modifiedSlidersProperties[10].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[10].min" 
                                :max="modifiedSlidersProperties[10].max" 
                                :step="modifiedSlidersProperties[10].step" 
                                id="viscosity" 
                                class="slider"
                                v-model="modifiedSlidersProperties[10].value" 
                                @input="calculateSliderColorPercent" 
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[10]}">
                        </div>
                    </fragment>
                    
                    <!-- abondoned rate -->
                    <fragment v-if="modifiedSlidersProperties[11].display">
                        <div class="property-name tooltip">q<sub>ab</sub> <span class="tooltiptext">abondoned rate</span></div>
                        <div class="property-unit">STB/D</div>
                        <div class="property-value">
                            <input type="text" value="0.5" class="user-input" v-model="modifiedSlidersProperties[11].value" @change="calculatePlotsParameters">
                        </div>
                        <div class="property-slider">
                            <input type="range" 
                                :min="modifiedSlidersProperties[11].min" 
                                :max="modifiedSlidersProperties[11].max" 
                                :step="modifiedSlidersProperties[11].step" 
                                id="rate" 
                                class="slider"
                                v-model="modifiedSlidersProperties[11].value" 
                                @input="calculateSliderColorPercent"
                                @change="calculatePlotsParameters" 
                                :style="{ background: color[11]}">
                        </div>
                    </fragment>
                </div>

            </div>

        </div>        

        <div class="output-box">
            <div class="output-box-header">Output</div>
            <div class="output-box-parameters">
                <div class="properties-title">Calculated Parameters</div>
                <div class="calculated-parameters">
                    <div class="tooltip">t <sub>elf</sub> (days) <span class="tooltiptext">end of linear flow time</span></div>
                    <div>{{ endOfHalfSlopeLineTime }}</div>
                    <div class="tooltip">N<sub>vol</sub> (STB) <span class="tooltiptext">volumetric hydrocarbon in place</span></div>
                    <div>{{ volumetricHCInPlace }}</div>
                    <div class="tooltip">N <sub>FMB</sub> (STB) <span class="tooltiptext">hydrocarbon in place calculated from flowing material balance (FMB) plot</span></div>
                    <div>{{ hcInPlaceFromRNPPlot }}</div>
                    <div class="tooltip"> error (%): <span class="tooltiptext">FMB hydrocarbon in place calculation error</span> </div>
                    <div> {{ (Math.abs((volumetricHCInPlace - hcInPlaceFromRNPPlot) / volumetricHCInPlace ) * 100).toFixed(2) }} </div>
                </div>
            </div>      


        </div>
        <div>
            <button type="button" @click="goToAllLessonsList" class="button">Back to All Lessons List</button>
        </div>
        
    </div>
</template>

<script>

export default {
  name: 'Inputs',
    data() {
        return {
            // The default input values along with default input range of sliders, their steps when the app is initially loaded on the page 
            slidersProperties: [
                { 
                  name: 'porosity',
                  value: 0.01,
                  min: 0,
                  max: 1,
                  step: 0.1
                },
                { 
                  name: 'permeability',
                  value: 0.002,
                  min: 0.001,
                  max: 0.1,
                  step: 0.001
                },
                { 
                  name: 'fracHalfLength',
                  value: 50,
                  min: 50,
                  max: 200,
                  step: 1
                },
                { 
                  name: 'fracHeight',
                  value: 50,
                  min: 50,
                  max: 200,
                  step: 1
                },
                { 
                  name: 'fracSpacing',
                  value: 100,
                  min: 10,
                  max: 300,
                  step: 1
                },
                { 
                  name: 'fracNum',
                  value: 1,
                  min: 1,
                  max: 100,
                  step: 1
                },
                { 
                  name: 'compressibility',
                  value: 5E-05,
                  min: 1E-06, 
                  max: 200E-05,
                  step: 10E-06
                },
                { 
                  name: 'resPressure',
                  value: 5000,
                  min: 100, 
                  max: 10000,
                  step: 1
                },
                { 
                  name: 'flowingWellPressure',
                  value: 500,
                  min: 100, 
                  max: 10000,
                  step: 1
                },
                { 
                  name: 'FVF',
                  value: 1.2,
                  min: 1, 
                  max: 2,
                  step: 0.1
                },
                { 
                  name: 'viscosity',
                  value: 0.3,
                  min: 0, 
                  max: 1,
                  step: 0.1
                },
                { 
                  name: 'rate',
                  value: 0.05,
                  min: 0, 
                  max: 10,
                  step: 0.01
                }
            ]
            
        }
    },
    computed: {
        currentInputSlidersListToBeDisplayed() {
            return this.$store.getters.getInputSlidersDisplayList;
        },
        modifiedSlidersProperties() {
            this.slidersProperties[0].display = this.currentInputSlidersListToBeDisplayed[0].porosity;
            this.slidersProperties[1].display = this.currentInputSlidersListToBeDisplayed[1].permeability;
            this.slidersProperties[2].display = this.currentInputSlidersListToBeDisplayed[2].fracHalfLength;
            this.slidersProperties[3].display = this.currentInputSlidersListToBeDisplayed[3].fracHeight;
            this.slidersProperties[4].display = this.currentInputSlidersListToBeDisplayed[4].fracSpacing;
            this.slidersProperties[5].display = this.currentInputSlidersListToBeDisplayed[5].fracNum;
            this.slidersProperties[6].display = this.currentInputSlidersListToBeDisplayed[6].compressibility;
            this.slidersProperties[7].display = this.currentInputSlidersListToBeDisplayed[7].resPressure;
            this.slidersProperties[8].display = this.currentInputSlidersListToBeDisplayed[8].flowingWellPressure;
            this.slidersProperties[9].display = this.currentInputSlidersListToBeDisplayed[9].FVF;
            this.slidersProperties[10].display = this.currentInputSlidersListToBeDisplayed[10].viscosity;
            this.slidersProperties[11].display = this.currentInputSlidersListToBeDisplayed[11].rate;

            return this.slidersProperties;
        },
        // the color percent (in order to style each slider ) of different sliders to determine the background color of each slider when the app is initially loaded or when the user change the slider
        color() {
            return this.$store.getters.defColors;         
        },
        inputDataValues() {
            return {
                porosity: this.slidersProperties[0].value,
                permeability: this.slidersProperties[1].value,
                fracHalfLength: this.slidersProperties[2].value,
                fracHeight: this.slidersProperties[3].value,
                fracSpacing: this.slidersProperties[4].value,
                fracNum: this.slidersProperties[5].value,
                compressibility: this.slidersProperties[6].value,
                resPressure: this.slidersProperties[7].value,
                flowingWellPressure: this.slidersProperties[8].value,
                FVF: this.slidersProperties[9].value,
                viscosity: this.slidersProperties[10].value,
                rate: this.slidersProperties[11].value
            }
        },
        // calculation of volumetric hydrocarbon in place using user input parameters
        volumetricHCInPlace() {
            const N = 4 * this.modifiedSlidersProperties[2].value * this.modifiedSlidersProperties[4].value * this.modifiedSlidersProperties[3].value * this.modifiedSlidersProperties[0].value * this.modifiedSlidersProperties[5].value / (this.modifiedSlidersProperties[9].value * 5.615);
            return N.toFixed(2);
        },
        endOfHalfSlopeLineTime() {
            const tehs = (this.modifiedSlidersProperties[0].value * this.modifiedSlidersProperties[10].value * this.modifiedSlidersProperties[6].value / this.modifiedSlidersProperties[1].value) * Math.pow((this.modifiedSlidersProperties[4].value / 0.1591) , 2);
            return tehs.toFixed(2);
        },
        hcInPlaceFromRNPPlot() {
            const slope = this.$store.getters.rnpPlotSlope;
            console.log('slope:', slope)
            const mbtHcInPlace = 1 / (slope * this.modifiedSlidersProperties[6].value) * this.modifiedSlidersProperties[5].value;
            return mbtHcInPlace.toFixed(2);
        }
    },
    created() {
        // determining the slider background color by dispatching 'getColorSliders' action along with default values data
        this.$store.dispatch('getColorSliders', this.modifiedSlidersProperties);

        // this.$store.dispatch('getCalcPlotsParams', this.defaultInputDataValues);
        this.$store.dispatch('getCalcPlotsParams', this.inputDataValues);
    },
    methods: {
        // slider background color when the user change the slider
        calculateSliderColorPercent(e) { 
            this.$store.dispatch('getColorSliders', this.modifiedSlidersProperties);
            
            // const fractureData = {
            //     fractureSpacing: this.userInputs[4].fracSpacing,
            //     fractureHalfLength: this.userInputs[2].fracHalfLength,
            //     fractureHeight: this.userInputs[3].fracHeight,
            //     fractureFrequency: this.userInputs[5].fracNum
            // };
            // this.$store.dispatch('getFractureData', fractureData);

            this.$store.dispatch('getFractureSpacing', this.modifiedSlidersProperties[4].value);
            this.$store.dispatch('getFractureHalfLength', this.modifiedSlidersProperties[2].value);
        },
        calculatePlotsParameters(e) { 
            //quality check of the user input data
            
            // calculation of different plots parameters by dispatching an action along with user input data
            this.$store.dispatch('getCalcPlotsParams', this.inputDataValues);
        },
        goToAllLessonsList() {
            this.$router.push({ name: 'Lessons'});
        }
    }
}
</script>

<style>

</style>

