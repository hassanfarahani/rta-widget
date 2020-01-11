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
                    <div class="property-name tooltip">&Phi; <span class="tooltiptext">porosity</span></div>
                    <div class="property-unit">fraction</div>
                    <div class="property-value">
                        <input type="text" class="user-input" v-model="userInputs[0].porosity" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[0].porosity[0]" :max="slidersRange[0].porosity[1]" step="0.1" id="porosity" class="slider" 
                            v-model="userInputs[0].porosity" @input="changeSliderColor" :style="{ background: color[0]}">
                    </div>

                    <!-- permeability -->
                    <div class="property-name tooltip">K <span class="tooltiptext">permeability</span></div>
                    <div class="property-unit">md</div>
                    <div class="property-value">
                        <input type="text" class="user-input"  v-model="userInputs[1].permeability" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[1].permeability[0]" :max="slidersRange[1].permeability[1]" step="0.001" id="permeability" class="slider"
                        v-model="userInputs[1].permeability" @input="changeSliderColor" :style="{ background: color[1]}">
                    </div>

                    <!-- fracture half-length -->
                    <div class="property-name tooltip">X<sub>f</sub> <span class="tooltiptext">effective fracture half-length </span></div>
                    <div class="property-unit">ft</div>
                    <div class="property-value">
                        <input type="text" value="100" class="user-input" v-model="userInputs[2].fracHalfLength" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[2].fracHalfLength[0]" :max="slidersRange[2].fracHalfLength[1]" id="fracHalfLength" class="slider"
                        v-model="userInputs[2].fracHalfLength" @input="changeSliderColor" :style="{ background: color[2]}">
                    </div>
                    
                    <!-- fracture height -->
                    <div class="property-name tooltip">h<sub>f</sub> <span class="tooltiptext">effective fracture height</span></div>
                    <div class="property-unit">ft</div>
                    <div class="property-value">
                        <input type="text" value="100" class="user-input" v-model="userInputs[3].fracHeight" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[3].fracHeight[0]" :max="slidersRange[3].fracHeight[1]" id="fracHeight" class="slider"
                        v-model="userInputs[3].fracHeight" @input="changeSliderColor" :style="{ background: color[3]}">
                    </div>

                    <!-- fracture spacing  -->
                    <div class="property-name tooltip">y<sub>e</sub> <span class="tooltiptext">fracture spacing</span></div>
                    <div class="property-unit">ft</div>
                    <div class="property-value">
                        <input type="text" value="100" class="user-input" v-model="userInputs[4].fracSpacing" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[4].fracSpacing[0]" :max="slidersRange[4].fracSpacing[1]" id="fracSpacing" class="slider"
                        v-model="userInputs[4].fracSpacing" @input="changeSliderColor" :style="{ background: color[4]}">
                    </div>

                    <!-- number of fractures -->
                    <div class="property-name tooltip">n<sub>f</sub> <span class="tooltiptext">number of fractures</span></div>
                    <div class="property-unit"></div>
                    <div class="property-value">
                        <input type="text" value="1" class="user-input" v-model="userInputs[5].fracNum" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[5].fracNum[0]" :max="slidersRange[5].fracNum[1]" id="fracNum" class="slider"
                        v-model="userInputs[5].fracNum" @input="changeSliderColor" :style="{ background: color[5]}">
                    </div>
                    
                    <!-- compressibility -->
                    <div class="property-name tooltip">C<sub>t</sub> <span class="tooltiptext">total compressibility</span></div>
                    <div class="property-unit">1/psi</div>
                    <div class="property-value">
                        <input type="text" value="5E-05" class="user-input" v-model="userInputs[6].compressibility" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[6].compressibility[0]" :max="slidersRange[6].compressibility[1]" step="10E-06" id="compressibility" class="slider"
                        v-model="userInputs[6].compressibility" @input="changeSliderColor" :style="{ background: color[6]}">
                    </div>
                </div>

                <div class="properties-title">Fluid Properties</div>
                <div class="properties rock-properties">
                    <!-- reservoir pressure -->
                    <div class="property-name tooltip">P<sub>i</sub> <span class="tooltiptext">initial reservoir pressure</span></div>
                    <div class="property-unit">psia</div>
                    <div class="property-value">
                        <input type="text" value="5000" class="user-input" v-model="userInputs[7].resPressure" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[7].resPressure[0]" :max="slidersRange[7].resPressure[1]" id="resPressure" class="slider"
                        v-model="userInputs[7].resPressure" @input="changeSliderColor" :style="{ background: color[7]}">
                    </div>

                    <!-- flowing wellbore pressure -->
                    <div class="property-name tooltip">P<sub>wf</sub> <span class="tooltiptext">measured sandface pressure</span></div>
                    <div class="property-unit">psia</div>
                    <div class="property-value">
                        <input type="text" value="1000" class="user-input" v-model="userInputs[8].flowingWellPressure" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[8].flowingWellPressure[0]" :max="slidersRange[8].flowingWellPressure[1]" id="flowingWellPressure" class="slider"
                        v-model="userInputs[8].flowingWellPressure" @input="changeSliderColor" :style="{ background: color[8]}">
                    </div>

                    <!-- FVF -->
                    <div class="property-name tooltip">B<sub>o</sub> <span class="tooltiptext">formation volume factor</span></div>
                    <div class="property-unit">rb/STB</div>
                    <div class="property-value">
                        <input type="text" value="1.2" class="user-input" v-model="userInputs[9].FVF" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[9].FVF[0]" :max="slidersRange[9].FVF[1]" step="0.1" id="FVF" class="slider"
                        v-model="userInputs[9].FVF" @input="changeSliderColor" :style="{ background: color[9]}">
                    </div>
                    
                    <!-- viscosity -->
                    <div class="property-name tooltip">&mu;<sub>o</sub> <span class="tooltiptext">viscosity</span></div>
                    <div class="property-unit">cp</div>
                    <div class="property-value">
                        <input type="text" value="0.5" class="user-input" v-model="userInputs[10].viscosity" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[10].viscosity[0]" :max="slidersRange[10].viscosity[1]" step="0.1" id="viscosity" class="slider"
                        v-model="userInputs[10].viscosity" @input="changeSliderColor" :style="{ background: color[10]}">
                    </div>
                    
                    <!-- abondoned rate -->
                    <div class="property-name tooltip">q<sub>ab</sub> <span class="tooltiptext">abondoned rate</span></div>
                    <div class="property-unit">STB/D</div>
                    <div class="property-value">
                        <input type="text" value="0.5" class="user-input" v-model="userInputs[11].rate" @input="changeSliderColor">
                    </div>
                    <div class="property-slider">
                        <input type="range" :min="slidersRange[11].rate[0]" :max="slidersRange[11].rate[1]" step="0.01" id="rate" class="slider"
                        v-model="userInputs[11].rate" @input="changeSliderColor" :style="{ background: color[11]}">
                    </div>
                </div>

            </div>

        </div>        

        <div class="calculation">
            <button @click="calcPlotsParams" class="btn btn-calc">Calculate</button>
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
        
    </div>
</template>

<script>

export default {
  name: 'Inputs',
    data() {
        return {
            // The default input values (along with default input range of slider ) when the app is initially loaded on the page
            userInputs: [
                { porosity: 0.01 },
                { permeability: 0.002 },
                { fracHalfLength: 50 },
                { fracHeight: 50 },
                { fracSpacing: 100 },
                { fracNum: 1 },
                { compressibility: 5E-05 },
                { resPressure: 5000 },
                { flowingWellPressure: 500 },
                { FVF: 1.2 },
                { viscosity: 0.3 },
                { rate: 0.05 }
            ],
            // min & max values of each property
            slidersRange: [
                { porosity: [0, 1] },
                { permeability: [0.001, 0.01] },
                { fracHalfLength: [50, 200] },
                { fracHeight: [50, 200] },
                { fracSpacing: [60, 200] },
                { fracNum: [1, 100] },
                { compressibility: [1E-06, 200E-05] },
                { resPressure: [100, 10000] },
                { flowingWellPressure: [100, 10000] },
                { FVF: [1, 2] },
                { viscosity: [0, 1] },
                { rate: [0, 10] }
            ],
        }
    },
    computed: {
        // the color percent (in order to style each slider ) of different sliders to determine the background color of each slider when the app is initially loaded or when the user change the slider
        color() {
            return this.$store.getters.defColors;         
        },
        defaultInputDataValues() {
            return {
                porosity: this.userInputs[0].porosity,
                permeability: this.userInputs[1].permeability,
                fracHalfLength: this.userInputs[2].fracHalfLength,
                fracHeight: this.userInputs[3].fracHeight,
                fracSpacing: this.userInputs[4].fracSpacing,
                fracNum: this.userInputs[5].fracNum,
                compressibility: this.userInputs[6].compressibility,
                resPressure: this.userInputs[7].resPressure,
                flowingWellPressure: this.userInputs[8].flowingWellPressure,
                FVF: this.userInputs[9].FVF,
                viscosity: this.userInputs[10].viscosity,
                rate: this.userInputs[11].rate
            }
        },
        // calculation of volumetric hydrocarbon in place using user input parameters
        volumetricHCInPlace() {
            const N = 4 * this.userInputs[2].fracHalfLength * this.userInputs[4].fracSpacing * this.userInputs[3].fracHeight * this.userInputs[0].porosity * this.userInputs[5].fracNum / (this.userInputs[9].FVF * 5.615);
            return N.toFixed(2);
        },
        endOfHalfSlopeLineTime() {
            const tehs = (this.userInputs[0].porosity * this.userInputs[10].viscosity * this.userInputs[6].compressibility / this.userInputs[1].permeability) * Math.pow((this.userInputs[4].fracSpacing / 0.1591) , 2);
            return tehs.toFixed(2);
        },
        hcInPlaceFromRNPPlot() {
            const slope = this.$store.getters.rnpPlotSlope;
            const mbtHcInPlace = 1 / (slope * this.userInputs[6].compressibility) * this.userInputs[5].fracNum;
            return mbtHcInPlace.toFixed(2);
        }
    },
    created() {
        // determining the slider background color by dispatching 'getColorSliders' action along with default values data
        const colorData = { userInputs: this.userInputs, slidersRange: this.slidersRange };
        this.$store.dispatch('getColorSliders', colorData);

        this.$store.dispatch('getCalcPlotsParams', this.defaultInputDataValues);
    },
    methods: {
        // slider background color when the user change the slider
        changeSliderColor(e) { 
            const data = { userInputs: this.userInputs, slidersRange: this.slidersRange };
            this.$store.dispatch('getColorSliders', data);
            
            // const fractureData = {
            //     fractureSpacing: this.userInputs[4].fracSpacing,
            //     fractureHalfLength: this.userInputs[2].fracHalfLength,
            //     fractureHeight: this.userInputs[3].fracHeight,
            //     fractureFrequency: this.userInputs[5].fracNum
            // };
            // this.$store.dispatch('getFractureData', fractureData);
            this.$store.dispatch('getFractureSpacing', this.userInputs[4].fracSpacing);
            this.$store.dispatch('getFractureHalfLength', this.userInputs[2].fracHalfLength);
        },
        calcPlotsParams() {
            //quality check of the user input data

            let newData = {
                porosity: parseFloat(this.userInputs[0].porosity),
                permeability: parseFloat(this.userInputs[1].permeability),
                fracHalfLength: parseFloat(this.userInputs[2].fracHalfLength),
                fracHeight: parseFloat(this.userInputs[3].fracHeight),
                fracSpacing: parseFloat(this.userInputs[4].fracSpacing),
                fracNum: parseFloat(this.userInputs[5].fracNum),
                compressibility: parseFloat(this.userInputs[6].compressibility),
                resPressure: parseFloat(this.userInputs[7].resPressure),
                flowingWellPressure: parseFloat(this.userInputs[8].flowingWellPressure),
                FVF: parseFloat(this.userInputs[9].FVF),
                viscosity: parseFloat(this.userInputs[10].viscosity),
                rate: parseFloat(this.userInputs[11].rate)
            };
            
            // console.log(newData)
            
            // // calculation of different plots parameters by dispatching an action along with user input data
            this.$store.dispatch('getCalcPlotsParams', newData);
        }
    }
}
</script>

<style>

</style>

