import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {        
        defSlidersColors: null, // sliders length percentage : an array of strings
        plotsParams: [],  // an array of objects contains the required parameters to make different plots
        productionPlotSliderValues: [], // slider values of production plot
        rtaPlotSliderValues: [], // slider values of rta plot
        rnpPlotSliderValues: [], // slider values of rnp plot
        rnpPlotSlope: null
    },
    mutations: {
        // storing the length percentage of each slider in an object when the app is initially loaded
        setColorSliders(state, colors) {
            state.defSlidersColors = colors;
        },
        // storing the length percentage of each slider in an object when the user change the slider (each time just on slider in the object has been changed compared to the previous object)
        setNewColorSlider(state, colorData) {
            state.defSlidersColors = colorData;
        },
        setCalcPlotsParams(state, plotsParams) {
            state.plotsParams.push(plotsParams);  
        },
        setSliderValues(state, updatedSliderData) {
            if (updatedSliderData.plotType === 'productionPlot') {
                state.productionPlotSliderValues = updatedSliderData.values;
                // console.log(state.p_p_sliderValues)
            } else if (updatedSliderData.plotType === 'rtaPlot') {
                state.rtaPlotSliderValues = updatedSliderData.values;
                // console.log(state.rta_p_sliderValues)
            } else if (updatedSliderData.plotType === 'rnpPlot') {
                state.rnpPlotSliderValues = updatedSliderData.values;
                // console.log(state.rta_p_sliderValues)
            }
        },
        setTheSlopeOfRNPPlot(state, slope) {
            state.rnpPlotSlope = slope;
        }
    },
    actions: {
        // slider background color along with all the slider default values when the app is initially loaded
        getColorSliders({ commit }, { userInputs, slidersRange }) {

            // calculation of the percentage of the slider length that should be colored when the app is initially loaded
            const properties = ['porosity', 'permeability', 'fracHalfLength', 'fracHeight', 'fracSpacing', 'fracNum', 'compressibility', 'resPressure', 'flowingWellPressure', 'FVF', 'viscosity', 'rate'];
            let colors = [];
            userInputs.map((prop, index) => {                
                const color = `linear-gradient(90deg, rgb(84, 250, 37) ${ prop[properties[index]] / slidersRange[index][properties[index]][1] * 100 }%, rgb(255, 255, 255) ${ prop[properties[index]] / slidersRange[index][properties[index]][1] * 100 }%)`
                colors.push(color);
            })
            
            // sending the length percentage of all sliders with commiting the mutation wlong with the related color data
            commit('setColorSliders', colors);
        },
        // getting the new user input values of the input slider 
        getSliderValues({ commit }, updatedSliderData) {
            commit('setSliderValues', updatedSliderData);
        },
        // calculation of the slope of RNP (rate-normalized pressure) plot
        getTheSlopeOfRNPPlot({ commit }, { MBTDataPoints, RNPDataPoints}) {
            let linearRegressionResults = {};
            let n = RNPDataPoints.length;
            let sum_x = 0;
            let sum_y = 0;
            let sum_xy = 0;
            let sum_xx = 0;
            let sum_yy = 0;
        
            for (let i = 0; i < RNPDataPoints.length; i++) {
        
                sum_x += MBTDataPoints[i];
                sum_y += RNPDataPoints[i];
                sum_xy += (MBTDataPoints[i]*RNPDataPoints[i]);
                sum_xx += (MBTDataPoints[i]*MBTDataPoints[i]);
                sum_yy += (RNPDataPoints[i]*RNPDataPoints[i]);
            } 
        
            linearRegressionResults['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
            linearRegressionResults['intercept'] = (sum_y - linearRegressionResults.slope * sum_x)/n;
            linearRegressionResults['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
            console.log(linearRegressionResults)
            commit('setTheSlopeOfRNPPlot', linearRegressionResults.slope);
        },
        // Calculation of rates based on the user inputs
        getCalcPlotsParams({ commit, dispatch }, 
            { porosity, permeability, fracHalfLength, fracHeight, fracSpacing, fracNum, compressibility, resPressure, flowingWellPressure, FVF, viscosity, rate }) {
            // Calculation of volumetric Oil In Place
            const volumetricHCInPlace = 4 * fracHalfLength * fracSpacing * fracHeight * porosity * fracNum / FVF;
            
            // calculation of end of half-slope line time (tehs)
            const tehs = (porosity * viscosity * compressibility / permeability) * Math.pow((fracSpacing / 0.1591) , 2);
           
            // in case of high perm reservoir, in which tehs is relatively short
            let timeRange;
            if (tehs <= 50) {
                timeRange = 150;
            } else {
                // the time range that is going to be displayed on the plots
                // timeRange = 2 * tehs;
                timeRange = tehs;
            }

            // the time step on the plots
            const deltaT = Math.ceil(timeRange / 250);

            // dimensionless time array contains dimensionless time value for each specific time tDxe
            // calculation of time axis & its range ==> timeAxisRange
            let initialTime = tehs - tehs/2; // start of x axis (time)
            let endTime = tehs + tehs/2; // end of x axis (time)
            let tDxe = [];            
            let time = [];
            // for (let t=1; t <= timeRange; t=t+deltaT) {
            for (let t=1; t <= endTime; t=t+deltaT) {
                // tDxi === dimensionless time in a one specific t
                let tDxi = (0.00633 * permeability * t) / (porosity * viscosity * compressibility * Math.pow(fracHalfLength, 2));
                tDxe.push(tDxi);
                time.push(t);
            };
            // console.log('time', time)
            // insertion of tehs into the time array
            let tehsIndexInTimeArray = 0; // index of end of linear flow time value in the time array
            for (let i=0; i < time.length; i++) {
                if (tehs >= time[i] && tehs <= time[i+1]) {
                    tehsIndexInTimeArray = i + 1;
                }
            }
            time[tehsIndexInTimeArray] = parseFloat(tehs.toFixed(2));

            // sum calculation (exponential term) in Equation 3 
            const n_max = 73;
            let sum = [];
            tDxe.forEach(tDxi => {
                let sum_n = [];
                for (let n=1; n <= n_max; n=n+2) {
                    let sum_ni = Math.exp((-1) * Math.pow((n * Math.PI), 2) * 0.25 * Math.pow(fracHalfLength/fracSpacing, 2) * tDxi);
                    sum_n.push(sum_ni);
                }
                let sum_i = sum_n.reduce((a, b) => a + b, 0);
                sum.push(sum_i);
            });

            // calculation of dimensionless rate (qD) coefficient (alpha) ===> q = qD * alpha
            const alpha = (permeability * fracHeight * (resPressure - flowingWellPressure)) / (141.2 * FVF * viscosity);

            // calculation of dimensionless rate (qD)
            let qD = sum.map(sum_i => {
                return (4 / Math.PI) * (fracSpacing/fracHalfLength) * sum_i;
            });

            // calculation of rate (q_org) without considering abondoned rate
            let q_org = qD.map(qDi => alpha * qDi * fracNum);

            // filtering the calculated rates based on abondoned rate
            let q = [];
            q_org.forEach(qi => {
                if (qi > rate) {
                    q.push(parseFloat(qi.toFixed(2)));
                }
            });

            // calculation of the reciprocal of q
            let q_rec = q.map(qi => parseFloat((1/qi).toFixed(3)));

            // calculation of square root of time
            let t_sqrt = time.map(ti => parseFloat((Math.pow(ti, 0.5)).toFixed(3)));


            // calculation of (Pi - Pwf)/ q (rate-normalized pressure)
            let RNP = q.map(qi => parseFloat(((resPressure - flowingWellPressure) / qi).toFixed(3)));

            // calculation of cumulative production (Q)
            let delta_q = []
            q.forEach((qi, index) => {
                if (index === 0) {
                    delta_q.push(qi * time[index]);
                } else {
                    delta_q.push(qi * (time[index] - time[index - 1]));
                }
            })

            let Q = [];
            delta_q.reduce((a, b, index) => Q[index] = a + b, 0);
            console.log('cum Q', Q)

            // calculation of MBT (material balance time) 
            let MBT = q.map((qi, index) => parseFloat((Q[index]/qi).toFixed(3)));

            // calculation of HC in place using the slope of RNP plot after end of linear flow
            // first step: selection of data points
            // let arraySliceIndex = tehsIndexInTimeArray + (MBT.length - tehsIndexInTimeArray) / 2;
            let dataForRNPSlopeCalculation = {
                MBTDataPoints: MBT.slice(tehsIndexInTimeArray),
                RNPDataPoints: RNP.slice(tehsIndexInTimeArray)
            };
            // calculation of slope
            dispatch('getTheSlopeOfRNPPlot', dataForRNPSlopeCalculation);

            // preparing the required data to be sent to the mutation
            let plotsParams = [];
            q.forEach((qi, i) => {
                let plotParams = {
                    time: time[i],
                    q: qi,
                    t_sqrt: t_sqrt[i],
                    q_rec: q_rec[i],
                    Q: Q[i],
                    RNP: RNP[i],
                    MBT: MBT[i],
                    endOfLinearFlowParams: {
                        time: time[tehsIndexInTimeArray],
                        MBT: MBT[tehsIndexInTimeArray],
                        RNP: RNP[tehsIndexInTimeArray],
                        q: q[tehsIndexInTimeArray]
                    }
                };
                
                plotsParams.push(plotParams);
            });            
            console.log('all parameters:', plotsParams)
            // commiting the mutation
            commit('setCalcPlotsParams', plotsParams);
        }
        
    },
    getters: {
        // getting the sliders length percentage from the state
        defColors(state) {
            return state.defSlidersColors;
        },
        // getting the plots axes parameters from the state
        newPlotsParameters(state) {
            return state.plotsParams;
        },
        // slider values of production plot
        productionPlotSliderValues(state) {
            return state.productionPlotSliderValues;
        },
        // slider values of production plot
        rtaPlotSliderValues(state) {
            return state.rtaPlotSliderValues;
        },
        // slider values of production plot
        rnpPlotSliderValues(state) {
            return state.rnpPlotSliderValues;
        },
        rnpPlotSlope(state) {
            return state.rnpPlotSlope;
        }
    }
});