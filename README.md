# rta-learning-tool

> A Vue.js project
> > A Rate-Transient Analysis web app which help petroleum engineers to learn about the different parameters that affects the production rate and flowing pressure data.
> Live demo [_here_](https://rta-widget.netlify.app/)

## Technologies

- Vue.js / Vuex / Vue-Router
- D3.js (Data visulaization framework)

## Features
- List of lessons (each lesson is for a specific parameter)
- On the sidebar, there are two sections showing the rock and fluid properties using sliders 
- Each parameter has a slider so by moving the slider, user can change the value of that parameter
- There are specific animations for two specific parameters (effective fracture half-length & fracture spacing) which user can see on Schematic section
- As soon as the user change any of the sliders, the production plots and rate-normalized pressure plots will be updated and the hydrocarbon in place calculated using two methods (volumetric and FMB plot) will also be updated in the output section.

## Project Status

Project is: _complete_

## Room for Improvement
- Give the user the ability to select the fluid type (gas - oil)
- Give the user the ability the units (metric - field)


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Screenshots

![image](https://user-images.githubusercontent.com/48249708/118304082-0f9fe600-b49b-11eb-9ea6-ed486150fd59.png)
![image](https://user-images.githubusercontent.com/48249708/118304283-52fa5480-b49b-11eb-8dfc-c25b01ca0cb6.png)
![image](https://user-images.githubusercontent.com/48249708/118304364-70c7b980-b49b-11eb-8660-e8f9f9c10ee1.png)

