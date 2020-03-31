import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {   
        // userInputs: [], // an array of objects including the user inputs values
        defSlidersColors: null, // sliders length percentage : an array of strings
        plotsParams: [],  // an array of arrays contains the required parameters to make different plots
        productionPlotSliderValues: [], // slider values of production plot
        rtaPlotSliderValues: [], // slider values of rta plot
        rnpPlotSliderValues: [], // slider values of rnp plot
        sqrtPlotSliderValues: [], // slider values of sqrt plot
        rnpPlotSlope: null,
        fractureData: null,
        fractureSpacing: null,
        fractureHalfLength: null,
        inputSlidersDisplayList: [],
        lessonNumber: null
        // initialRangeSlidersValues: null
    },
    mutations: {
        setDefaultFractureSpacing(state, fracSpacing) {
            state.fractureSpacing = fracSpacing;
        },
        setLessonNumberToBeColored(state, lessonNumber) {
            state.lessonNumber = lessonNumber;
        },
        setInputSlidersListToBeDisplayed(state, inputSlidersDisplayList) {
            state.inputSlidersDisplayList = inputSlidersDisplayList;
        },
        // storing the length percentage of each slider in an object when the app is initially loaded
        setColorSliders(state, colors) {
            state.defSlidersColors = colors;
        },
        setUserInputsValues(state, userInputs) {
            // console.log('mutation userInputs:', userInputs)
            state.userInputs = userInputs;
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
            } else if (updatedSliderData.plotType === 'sqrtPlot') {
                state.sqrtPlotSliderValues = updatedSliderData.values;
                // console.log(state.rta_p_sliderValues)
            }
        },
        setTheSlopeOfRNPPlot(state, slope) {
            state.rnpPlotSlope = slope;
        },
        setFractureData(state, fractureData) {
            state.fractureData = fractureData;
        },
        setFractureSpacing(state, fractureSpacing) {            
            state.fractureSpacing = fractureSpacing;
        },
        setFractureHalfLength(state, fractureHalfLength) {            
            state.fractureHalfLength = fractureHalfLength;
        }  
        // setInitialRangeSlidersValues(state, initialRangeSlidersValues) {
        //     state.initialRangeSlidersValues = initialRangeSlidersValues;
        // }
    },
    actions: {
        getLessonNumberToBeColored({ commit }, lessonNumber) {
            commit('setLessonNumberToBeColored', lessonNumber);
        },
        getInputSlidersListToBeDisplayed({ commit }, inputSlidersDisplayList) {
            commit('setInputSlidersListToBeDisplayed', inputSlidersDisplayList);
        },
        // slider background color along with all the slider default values when the app is initially loaded
        // getColorSliders({ commit }, { userInputs, slidersRange }) {
        getColorSliders({ commit }, slidersProperties) {

            // calculation of the percentage ((value - min) / (max - min)) of the slider length that should be colored when the app is initially loaded
            let colors = [];
            console.log('new prop:', slidersProperties)
            slidersProperties.map((prop, index) => {  
                const color = `linear-gradient(90deg, rgb(245, 153, 32)
                 ${ (prop.value - prop.min) / (prop.max - prop.min) * 100 }%,
                 rgb(255, 255, 255) ${ (prop.value - prop.min) / (prop.max - prop.min) * 100 }%)`;
                colors.push(color);
            });
            
            // sending the length percentage of all sliders with commiting the mutation wlong with the related color data
            commit('setColorSliders', colors);
            // commit('setUserInputsValues', userInputs); // userInputs: an array of objects ==> sending the user inputs values to the mutation
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
            console.log('slope in store:',linearRegressionResults.slope)
            commit('setTheSlopeOfRNPPlot', linearRegressionResults.slope);
        },
        // Calculation of rates based on the user inputs
        getCalcPlotsParams({ commit, dispatch }, 
            { porosity, permeability, fracHalfLength, fracHeight, fracSpacing, fracNum, compressibility, resPressure, flowingWellPressure, FVF, viscosity, rate }) {

            // sending the default fracture spacing to the mutation
            commit('setDefaultFractureSpacing', fracSpacing);

            // Calculation of volumetric Oil In Place
            const volumetricHCInPlace = 4 * fracHalfLength * fracSpacing * fracHeight * porosity * fracNum / FVF;
            
            // ---------------------------------------- calculation of end of half-slope line time (tehs) --------------------------------------------
            const tehs = (porosity * viscosity * compressibility / permeability) * Math.pow((fracSpacing / 0.1591) , 2);
           
            // in case of high perm reservoir, in which tehs is relatively short
            let timeRange;
            if (tehs <= 10) {
                timeRange = 20;
            } else {
                // the time range that is going to be displayed on the plots
                // timeRange = 2 * tehs;
                timeRange = tehs;
            }

            // the time step on the plots
            const deltaT = Math.ceil(timeRange / 250);

            
            // --------------------------------- calculation of time axis & its range ==> time array ----------------------------------------------------
            let endTime = 2 * timeRange ; // end of x axis (time)
            // let endTime = tehs + tehs/2; // end of x axis (time)
            let tDxe = [];  // dimensionless time array contains dimensionless time value for each specific time tDxe          
            let time = []; // time array
            for (let t=1; t <= endTime; t=t+deltaT) {
                // tDxi === dimensionless time in a one specific t
                let tDxi = (0.00633 * permeability * t) / (porosity * viscosity * compressibility * Math.pow(fracHalfLength, 2));
                tDxe.push(tDxi);
                time.push(t);
            };
            // ---------------------------------------------- insertion of tehs into the time array ---------------------------------------------------
            let tehsIndexInTimeArray = 0; // index of end of linear flow time value in the time array
            for (let i=0; i < time.length; i++) {
                if (tehs >= time[i] && tehs <= time[i+1]) {
                    tehsIndexInTimeArray = i + 1;
                }
            }
            time[tehsIndexInTimeArray] = parseFloat(tehs.toFixed(3));

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
                return (4 / Math.PI) * (fracHalfLength/fracSpacing) * sum_i;
            });

            // ------------------------------------ calculation of rate (q_org) without considering abondoned rate ---------------------------------------
            let q_org = qD.map(qDi => alpha * qDi * fracNum);

            //------------------------------------------ filtering the calculated rates based on abondoned rate -------------------------------------------
            let q = [];
            q_org.forEach(qi => {
                if (qi > rate) {
                    q.push(parseFloat(qi.toFixed(2)));
                }
            });
            // ---------------------------------------------------- calculation of the reciprocal of q --------------------------------------------------
            let q_rec = q.map(qi => parseFloat((1/qi).toFixed(3)));

            // --------------------------------------------------- calculation of square root of time ----------------------------------------------------
            let t_sqrt = time.map(ti => parseFloat((Math.pow(ti, 0.5)).toFixed(3)));


            // ------------------------------------------ calculation of (Pi - Pwf)/ q (rate-normalized pressure) ------------------------------------------
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

            // ------------------------------------------ calculation of MBT (material balance time) ------------------------------------------
            let MBT = q.map((qi, index) => parseFloat((Q[index]/qi).toFixed(3)));

            // --------------------- calculation of HC in place using the slope of RNP plot after end of linear flow --------------------------
            // first step: selection of data points
            let dataForRNPSlopeCalculation = {
                MBTDataPoints: MBT.slice(tehsIndexInTimeArray),
                RNPDataPoints: RNP.slice(tehsIndexInTimeArray)
            };
            // calculation of slope
            dispatch('getTheSlopeOfRNPPlot', dataForRNPSlopeCalculation);

            // ------------------------------------------------------ update range slider values -----------------------------------------------
            // let rangeSlidersExtremesValues = {
            //     productionPlot: [5, time[time.length - 1] - 5],
            //     rtaPlot: [5, MBT[MBT.length - 1] - 5],
            //     rnpPlot: [5, MBT[MBT.length - 1] - 5]
            // };

            // console.log('vuex slider values: ', rangeSlidersExtremesValues)
            // commit('setInitialRangeSlidersValues', rangeSlidersExtremesValues);



            // -------------------------------------- preparing the required data to be sent to the mutation ------------------------------------
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
                        t_sqrt: t_sqrt[tehsIndexInTimeArray],
                        MBT: MBT[tehsIndexInTimeArray],
                        RNP: RNP[tehsIndexInTimeArray],
                        q: q[tehsIndexInTimeArray]
                    }
                };
                
                plotsParams.push(plotParams);
            });            
            // console.log('time:', time)
            // console.log('q:', q)
            console.log('parameters:',plotsParams)

            // commiting the mutation
            commit('setCalcPlotsParams', plotsParams);
        },
        getFractureData({ commit }, fractureData) {
            commit('setFractureData', fractureData);
        },
        getFractureSpacing({ commit}, fractureSpacing) {
            commit('setFractureSpacing', fractureSpacing);
        },
        getFractureHalfLength({ commit }, fractureHalfLength) {
            commit('setFractureHalfLength', fractureHalfLength);
        }
        
    },
    getters: {
        getLessonNumber(state) {
            return state.lessonNumber;
        },
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
        // slider values of rta plot
        rtaPlotSliderValues(state) {
            return state.rtaPlotSliderValues;
        },
        // slider values of rnp plot
        rnpPlotSliderValues(state) {
            return state.rnpPlotSliderValues;
        },
        // slider values of sqrt plot
        sqrtPlotSliderValues(state) {
            return state.sqrtPlotSliderValues;
        },
        rnpPlotSlope(state) {
            return state.rnpPlotSlope;
        },
        // initialRangeSlidersValues(state) {
        //     return state.initialRangeSlidersValues;
        // },
        allFractureData(state) {
            return state.fractureData;
        },
        fractureSpacing(state) {
            return state.fractureSpacing;
        },
        fractureHalfLength(state) {
            return state.fractureHalfLength;
        },
        getInputSlidersDisplayList(state) {
            return state.inputSlidersDisplayList;
        }
    }
});