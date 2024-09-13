import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { collection, getDocs, getFirestore, query, where, db } from "firebase/firestore";
import firebaseConf from '../../utils/firebase-config';
import PanelLayout from "../layouts/panel/layout";

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalGenerated: {
        isLoading: true,
        data: []
      },
      historiesPerPlatform: {
        isLoading: true,
        data: []
      }
    }
    this.renderSpinner = this.renderSpinner.bind(this)
  }

  renderSpinner(position = "center") {
    return <div class={"d-flex justify-content-" + position}>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  componentDidMount() {
    this.getAllGenerated()
    this.getHistoriesPerPlatform()
  }

  async getAllGenerated() {
    const database = getFirestore(firebaseConf)

    await getDocs(collection(database, "histories"))
      .then((snapshot) => {
        this.setState((prevState) => ({
          totalGenerated: {
            isLoading: false,
            data: snapshot.docs.length
          }
        }))
      })
  }

  async getHistoriesPerPlatform() {
    const database = getFirestore(firebaseConf)

    await getDocs(collection(database, "histories_per_platform"))
      .then((snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          platform: doc.id,
          ...doc.data()
        }))

        this.setState((prevState) => ({
          historiesPerPlatform: {
            isLoading: false,
            data: newData
          }
        }))
      })



    // const getData = await getDocs(query(collection(database, collectionName), where("platform", "==", "php-laravel")))
    // .then((querySnapshot) => {
    //   const newData = querySnapshot.docs.map((doc) => {
    //     console.log(doc.data())
    //   })
    // })


    // onValue(collectionRef, (snapshot) => {
    //   console.log('snapshot', snapshot)
    //   const dataItem = snapshot.val()

    //   // Check if dataItem exists
    //   if (dataItem) {
    //     // Convert the object values into an array
    //     const displayItem = Object.values(dataItem)

    //     console.log(displayItem)
    //   }
    // })
  }

  render() {
    return (
      <PanelLayout>
        <div className="page-wrapper">
          <div className="page-header d-print-none">
            <div className="container-xl">
              <div className="row g-2 align-items-center">
                <div className="col">

                  <div className="page-pretitle">
                    Apps
                  </div>
                  <h2 className="page-title">
                    Dashboard
                  </h2>
                </div>

                <div className="col-auto ms-auto d-print-none">
                  <div className="btn-list">

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-body">
            <div className="container-xl">
              <div className="row row-deck row-cards mb-4">
                <div class="col-sm-6 col-lg-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center">
                        <div class="subheader">Sales</div>
                        <div class="ms-auto lh-1">
                          <div class="dropdown">
                            <a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                            <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item active" href="#">Last 7 days</a>
                              <a class="dropdown-item" href="#">Last 30 days</a>
                              <a class="dropdown-item" href="#">Last 3 months</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="h1 mb-3">75%</div>
                      <div class="d-flex mb-2">
                        <div>Conversion rate</div>
                        <div class="ms-auto">
                          <span class="text-green d-inline-flex align-items-center lh-1">
                            7%
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 17l6 -6l4 4l8 -8"></path><path d="M14 7l7 0l0 7"></path></svg>
                          </span>
                        </div>
                      </div>
                      <div class="progress progress-sm">
                        <div className="progress-bar bg-primary" style={{ width: '75%' }} role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} aria-label="75% Complete">
                          <span className="visually-hidden">75% Complete</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center">
                        <div class="subheader">Revenue</div>
                        <div class="ms-auto lh-1">
                          <div class="dropdown">
                            <a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                            <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item active" href="#">Last 7 days</a>
                              <a class="dropdown-item" href="#">Last 30 days</a>
                              <a class="dropdown-item" href="#">Last 3 months</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex align-items-baseline">
                        <div class="h1 mb-0 me-2">$4,300</div>
                        <div class="me-auto">
                          <span class="text-green d-inline-flex align-items-center lh-1">
                            8%
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon ms-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 17l6 -6l4 4l8 -8"></path><path d="M14 7l7 0l0 7"></path></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div id="chart-revenue-bg" className="chart-sm" style={{ minHeight: 40 }}>
                    <div id="apexchartsz8ot903m" className="apexcharts-canvas apexchartsz8ot903m apexcharts-theme-light" style={{ width: 278, height: 40 }}>
                      <svg id="SvgjsSvg2167" width={278} height={40} xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsxlink="http://www.w3.org/1999/xlink" xmlnssvgjs="http://svgjs.dev" className="apexcharts-svg" xmlnsdata="ApexChartsNS" transform="translate(0, 0)" style={{ background: 'transparent' }}>
                        <foreignObject x={0} y={0} width={278} height={40}>
                          <div className="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml" style={{ maxHeight: 20 }} />
                        </foreignObject>
                        <rect id="SvgjsRect2174" width={0} height={0} x={0} y={0} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fefefe" />
                        <g id="SvgjsG2233" className="apexcharts-yaxis" rel={0} transform="translate(-18, 0)" />
                        <g id="SvgjsG2169" className="apexcharts-inner apexcharts-graphical" transform="translate(0, 1)">
                          <defs id="SvgjsDefs2168">
                            <clipPath id="gridRectMaskz8ot903m">
                              <rect id="SvgjsRect2206" width={284} height={44} x={-3} y={-3} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fff" />
                            </clipPath>
                            <clipPath id="forecastMaskz8ot903m" />
                            <clipPath id="nonForecastMaskz8ot903m" />
                            <clipPath id="gridRectMarkerMaskz8ot903m">
                              <rect id="SvgjsRect2207" width={282} height={42} x={-2} y={-2} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fff" />
                            </clipPath>
                          </defs>
                          <line id="SvgjsLine2175" x1={0} y1={0} x2={0} y2={38} stroke="#b6b6b6" strokeDasharray={3} strokeLinecap="butt" className="apexcharts-xcrosshairs" x={0} y={0} width={1} height={38} fill="#b1b9c4" filter="none" fillOpacity="0.9" strokeWidth={1} />
                          <g id="SvgjsG2214" className="apexcharts-grid">
                            <g id="SvgjsG2215" className="apexcharts-gridlines-horizontal" style={{ display: 'none' }}>
                              <line id="SvgjsLine2218" x1={0} y1={0} x2={278} y2={0} stroke="#e0e0e0" strokeDasharray={4} strokeLinecap="butt" className="apexcharts-gridline" />
                              <line id="SvgjsLine2219" x1={0} y1={38} x2={278} y2={38} stroke="#e0e0e0" strokeDasharray={4} strokeLinecap="butt" className="apexcharts-gridline" />
                            </g>
                            <g id="SvgjsG2216" className="apexcharts-gridlines-vertical" style={{ display: 'none' }} />
                            <line id="SvgjsLine2221" x1={0} y1={38} x2={278} y2={38} stroke="transparent" strokeDasharray={0} strokeLinecap="butt" />
                            <line id="SvgjsLine2220" x1={0} y1={1} x2={0} y2={38} stroke="transparent" strokeDasharray={0} strokeLinecap="butt" />
                          </g>
                          <g id="SvgjsG2217" className="apexcharts-grid-borders" style={{ display: 'none' }} />
                          <g id="SvgjsG2208" className="apexcharts-area-series apexcharts-plot-series">
                            <g id="SvgjsG2209" className="apexcharts-series" zindex={0} seriesname="Profits" datalongestseries="true" rel={1} datarealindex={0}>
                              <path id="SvgjsPath2212" d="M 0 26.599999999999998C 3.3551724137931034 26.599999999999998 6.231034482758621 27.444444444444443 9.586206896551724 27.444444444444443C 12.941379310344828 27.444444444444443 15.817241379310346 23.644444444444442 19.17241379310345 23.644444444444442C 22.52758620689655 23.644444444444442 25.40344827586207 30.4 28.75862068965517 30.4C 32.11379310344827 30.4 34.98965517241379 27.02222222222222 38.3448275862069 27.02222222222222C 41.7 27.02222222222222 44.57586206896552 32.08888888888889 47.93103448275862 32.08888888888889C 51.28620689655172 32.08888888888889 54.162068965517236 14.777777777777775 57.51724137931034 14.777777777777775C 60.87241379310345 14.777777777777775 63.748275862068965 29.133333333333333 67.10344827586206 29.133333333333333C 70.45862068965516 29.133333333333333 73.3344827586207 26.599999999999998 76.6896551724138 26.599999999999998C 80.04482758620689 26.599999999999998 82.92068965517241 25.755555555555553 86.27586206896551 25.755555555555553C 89.63103448275861 25.755555555555553 92.50689655172414 16.04444444444444 95.86206896551724 16.04444444444444C 99.21724137931034 16.04444444444444 102.09310344827587 20.688888888888886 105.44827586206897 20.688888888888886C 108.80344827586207 20.688888888888886 111.67931034482758 27.444444444444443 115.03448275862068 27.444444444444443C 118.38965517241378 27.444444444444443 121.26551724137931 24.911111111111108 124.62068965517241 24.911111111111108C 127.97586206896551 24.911111111111108 130.85172413793103 27.444444444444443 134.20689655172413 27.444444444444443C 137.56206896551723 27.444444444444443 140.43793103448277 30.822222222222223 143.79310344827587 30.822222222222223C 147.14827586206897 30.822222222222223 150.0241379310345 2.9555555555555486 153.3793103448276 2.9555555555555486C 156.7344827586207 2.9555555555555486 159.6103448275862 19.84444444444444 162.9655172413793 19.84444444444444C 166.3206896551724 19.84444444444444 169.19655172413792 16.466666666666665 172.55172413793102 16.466666666666665C 175.90689655172412 16.466666666666665 178.78275862068966 30.822222222222223 182.13793103448276 30.822222222222223C 185.49310344827586 30.822222222222223 188.36896551724138 19.42222222222222 191.72413793103448 19.42222222222222C 195.07931034482758 19.42222222222222 197.9551724137931 24.066666666666663 201.3103448275862 24.066666666666663C 204.6655172413793 24.066666666666663 207.54137931034484 34.2 210.89655172413794 34.2C 214.25172413793103 34.2 217.12758620689655 22.799999999999997 220.48275862068965 22.799999999999997C 223.83793103448275 22.799999999999997 226.71379310344827 25.755555555555553 230.06896551724137 25.755555555555553C 233.42413793103447 25.755555555555553 236.3 16.04444444444444 239.6551724137931 16.04444444444444C 243.0103448275862 16.04444444444444 245.88620689655173 20.688888888888886 249.24137931034483 20.688888888888886C 252.59655172413792 20.688888888888886 255.47241379310347 27.444444444444443 258.82758620689657 27.444444444444443C 262.18275862068964 27.444444444444443 265.0586206896552 24.911111111111108 268.41379310344826 24.911111111111108C 271.7689655172414 24.911111111111108 274.6448275862069 13.93333333333333 278 13.93333333333333C 278 13.93333333333333 278 13.93333333333333 278 38 L 0 38z" fill="rgba(6,111,209,0.16)" fillOpacity={1} strokeOpacity={1} strokeLinecap="round" strokeWidth={0} strokeDasharray={0} className="apexcharts-area" index={0} clipPath="url(#gridRectMaskz8ot903m)" pathto="M 0 26.599999999999998C 3.3551724137931034 26.599999999999998 6.231034482758621 27.444444444444443 9.586206896551724 27.444444444444443C 12.941379310344828 27.444444444444443 15.817241379310346 23.644444444444442 19.17241379310345 23.644444444444442C 22.52758620689655 23.644444444444442 25.40344827586207 30.4 28.75862068965517 30.4C 32.11379310344827 30.4 34.98965517241379 27.02222222222222 38.3448275862069 27.02222222222222C 41.7 27.02222222222222 44.57586206896552 32.08888888888889 47.93103448275862 32.08888888888889C 51.28620689655172 32.08888888888889 54.162068965517236 14.777777777777775 57.51724137931034 14.777777777777775C 60.87241379310345 14.777777777777775 63.748275862068965 29.133333333333333 67.10344827586206 29.133333333333333C 70.45862068965516 29.133333333333333 73.3344827586207 26.599999999999998 76.6896551724138 26.599999999999998C 80.04482758620689 26.599999999999998 82.92068965517241 25.755555555555553 86.27586206896551 25.755555555555553C 89.63103448275861 25.755555555555553 92.50689655172414 16.04444444444444 95.86206896551724 16.04444444444444C 99.21724137931034 16.04444444444444 102.09310344827587 20.688888888888886 105.44827586206897 20.688888888888886C 108.80344827586207 20.688888888888886 111.67931034482758 27.444444444444443 115.03448275862068 27.444444444444443C 118.38965517241378 27.444444444444443 121.26551724137931 24.911111111111108 124.62068965517241 24.911111111111108C 127.97586206896551 24.911111111111108 130.85172413793103 27.444444444444443 134.20689655172413 27.444444444444443C 137.56206896551723 27.444444444444443 140.43793103448277 30.822222222222223 143.79310344827587 30.822222222222223C 147.14827586206897 30.822222222222223 150.0241379310345 2.9555555555555486 153.3793103448276 2.9555555555555486C 156.7344827586207 2.9555555555555486 159.6103448275862 19.84444444444444 162.9655172413793 19.84444444444444C 166.3206896551724 19.84444444444444 169.19655172413792 16.466666666666665 172.55172413793102 16.466666666666665C 175.90689655172412 16.466666666666665 178.78275862068966 30.822222222222223 182.13793103448276 30.822222222222223C 185.49310344827586 30.822222222222223 188.36896551724138 19.42222222222222 191.72413793103448 19.42222222222222C 195.07931034482758 19.42222222222222 197.9551724137931 24.066666666666663 201.3103448275862 24.066666666666663C 204.6655172413793 24.066666666666663 207.54137931034484 34.2 210.89655172413794 34.2C 214.25172413793103 34.2 217.12758620689655 22.799999999999997 220.48275862068965 22.799999999999997C 223.83793103448275 22.799999999999997 226.71379310344827 25.755555555555553 230.06896551724137 25.755555555555553C 233.42413793103447 25.755555555555553 236.3 16.04444444444444 239.6551724137931 16.04444444444444C 243.0103448275862 16.04444444444444 245.88620689655173 20.688888888888886 249.24137931034483 20.688888888888886C 252.59655172413792 20.688888888888886 255.47241379310347 27.444444444444443 258.82758620689657 27.444444444444443C 262.18275862068964 27.444444444444443 265.0586206896552 24.911111111111108 268.41379310344826 24.911111111111108C 271.7689655172414 24.911111111111108 274.6448275862069 13.93333333333333 278 13.93333333333333C 278 13.93333333333333 278 13.93333333333333 278 38 L 0 38z" pathfrom="M 0 42.22222222222222 L 0 42.22222222222222 L 9.586206896551724 42.22222222222222 L 19.17241379310345 42.22222222222222 L 28.75862068965517 42.22222222222222 L 38.3448275862069 42.22222222222222 L 47.93103448275862 42.22222222222222 L 57.51724137931034 42.22222222222222 L 67.10344827586206 42.22222222222222 L 76.6896551724138 42.22222222222222 L 86.27586206896551 42.22222222222222 L 95.86206896551724 42.22222222222222 L 105.44827586206897 42.22222222222222 L 115.03448275862068 42.22222222222222 L 124.62068965517241 42.22222222222222 L 134.20689655172413 42.22222222222222 L 143.79310344827587 42.22222222222222 L 153.3793103448276 42.22222222222222 L 162.9655172413793 42.22222222222222 L 172.55172413793102 42.22222222222222 L 182.13793103448276 42.22222222222222 L 191.72413793103448 42.22222222222222 L 201.3103448275862 42.22222222222222 L 210.89655172413794 42.22222222222222 L 220.48275862068965 42.22222222222222 L 230.06896551724137 42.22222222222222 L 239.6551724137931 42.22222222222222 L 249.24137931034483 42.22222222222222 L 258.82758620689657 42.22222222222222 L 268.41379310344826 42.22222222222222 L 278 42.22222222222222 L 0 42.22222222222222" />
                              <path id="SvgjsPath2213" d="M 0 26.599999999999998C 3.3551724137931034 26.599999999999998 6.231034482758621 27.444444444444443 9.586206896551724 27.444444444444443C 12.941379310344828 27.444444444444443 15.817241379310346 23.644444444444442 19.17241379310345 23.644444444444442C 22.52758620689655 23.644444444444442 25.40344827586207 30.4 28.75862068965517 30.4C 32.11379310344827 30.4 34.98965517241379 27.02222222222222 38.3448275862069 27.02222222222222C 41.7 27.02222222222222 44.57586206896552 32.08888888888889 47.93103448275862 32.08888888888889C 51.28620689655172 32.08888888888889 54.162068965517236 14.777777777777775 57.51724137931034 14.777777777777775C 60.87241379310345 14.777777777777775 63.748275862068965 29.133333333333333 67.10344827586206 29.133333333333333C 70.45862068965516 29.133333333333333 73.3344827586207 26.599999999999998 76.6896551724138 26.599999999999998C 80.04482758620689 26.599999999999998 82.92068965517241 25.755555555555553 86.27586206896551 25.755555555555553C 89.63103448275861 25.755555555555553 92.50689655172414 16.04444444444444 95.86206896551724 16.04444444444444C 99.21724137931034 16.04444444444444 102.09310344827587 20.688888888888886 105.44827586206897 20.688888888888886C 108.80344827586207 20.688888888888886 111.67931034482758 27.444444444444443 115.03448275862068 27.444444444444443C 118.38965517241378 27.444444444444443 121.26551724137931 24.911111111111108 124.62068965517241 24.911111111111108C 127.97586206896551 24.911111111111108 130.85172413793103 27.444444444444443 134.20689655172413 27.444444444444443C 137.56206896551723 27.444444444444443 140.43793103448277 30.822222222222223 143.79310344827587 30.822222222222223C 147.14827586206897 30.822222222222223 150.0241379310345 2.9555555555555486 153.3793103448276 2.9555555555555486C 156.7344827586207 2.9555555555555486 159.6103448275862 19.84444444444444 162.9655172413793 19.84444444444444C 166.3206896551724 19.84444444444444 169.19655172413792 16.466666666666665 172.55172413793102 16.466666666666665C 175.90689655172412 16.466666666666665 178.78275862068966 30.822222222222223 182.13793103448276 30.822222222222223C 185.49310344827586 30.822222222222223 188.36896551724138 19.42222222222222 191.72413793103448 19.42222222222222C 195.07931034482758 19.42222222222222 197.9551724137931 24.066666666666663 201.3103448275862 24.066666666666663C 204.6655172413793 24.066666666666663 207.54137931034484 34.2 210.89655172413794 34.2C 214.25172413793103 34.2 217.12758620689655 22.799999999999997 220.48275862068965 22.799999999999997C 223.83793103448275 22.799999999999997 226.71379310344827 25.755555555555553 230.06896551724137 25.755555555555553C 233.42413793103447 25.755555555555553 236.3 16.04444444444444 239.6551724137931 16.04444444444444C 243.0103448275862 16.04444444444444 245.88620689655173 20.688888888888886 249.24137931034483 20.688888888888886C 252.59655172413792 20.688888888888886 255.47241379310347 27.444444444444443 258.82758620689657 27.444444444444443C 262.18275862068964 27.444444444444443 265.0586206896552 24.911111111111108 268.41379310344826 24.911111111111108C 271.7689655172414 24.911111111111108 274.6448275862069 13.93333333333333 278 13.93333333333333" fill="none" fillOpacity={1} stroke="#066fd1" strokeOpacity={1} strokeLinecap="round" strokeWidth={2} strokeDasharray={0} className="apexcharts-area" index={0} clipPath="url(#gridRectMaskz8ot903m)" pathto="M 0 26.599999999999998C 3.3551724137931034 26.599999999999998 6.231034482758621 27.444444444444443 9.586206896551724 27.444444444444443C 12.941379310344828 27.444444444444443 15.817241379310346 23.644444444444442 19.17241379310345 23.644444444444442C 22.52758620689655 23.644444444444442 25.40344827586207 30.4 28.75862068965517 30.4C 32.11379310344827 30.4 34.98965517241379 27.02222222222222 38.3448275862069 27.02222222222222C 41.7 27.02222222222222 44.57586206896552 32.08888888888889 47.93103448275862 32.08888888888889C 51.28620689655172 32.08888888888889 54.162068965517236 14.777777777777775 57.51724137931034 14.777777777777775C 60.87241379310345 14.777777777777775 63.748275862068965 29.133333333333333 67.10344827586206 29.133333333333333C 70.45862068965516 29.133333333333333 73.3344827586207 26.599999999999998 76.6896551724138 26.599999999999998C 80.04482758620689 26.599999999999998 82.92068965517241 25.755555555555553 86.27586206896551 25.755555555555553C 89.63103448275861 25.755555555555553 92.50689655172414 16.04444444444444 95.86206896551724 16.04444444444444C 99.21724137931034 16.04444444444444 102.09310344827587 20.688888888888886 105.44827586206897 20.688888888888886C 108.80344827586207 20.688888888888886 111.67931034482758 27.444444444444443 115.03448275862068 27.444444444444443C 118.38965517241378 27.444444444444443 121.26551724137931 24.911111111111108 124.62068965517241 24.911111111111108C 127.97586206896551 24.911111111111108 130.85172413793103 27.444444444444443 134.20689655172413 27.444444444444443C 137.56206896551723 27.444444444444443 140.43793103448277 30.822222222222223 143.79310344827587 30.822222222222223C 147.14827586206897 30.822222222222223 150.0241379310345 2.9555555555555486 153.3793103448276 2.9555555555555486C 156.7344827586207 2.9555555555555486 159.6103448275862 19.84444444444444 162.9655172413793 19.84444444444444C 166.3206896551724 19.84444444444444 169.19655172413792 16.466666666666665 172.55172413793102 16.466666666666665C 175.90689655172412 16.466666666666665 178.78275862068966 30.822222222222223 182.13793103448276 30.822222222222223C 185.49310344827586 30.822222222222223 188.36896551724138 19.42222222222222 191.72413793103448 19.42222222222222C 195.07931034482758 19.42222222222222 197.9551724137931 24.066666666666663 201.3103448275862 24.066666666666663C 204.6655172413793 24.066666666666663 207.54137931034484 34.2 210.89655172413794 34.2C 214.25172413793103 34.2 217.12758620689655 22.799999999999997 220.48275862068965 22.799999999999997C 223.83793103448275 22.799999999999997 226.71379310344827 25.755555555555553 230.06896551724137 25.755555555555553C 233.42413793103447 25.755555555555553 236.3 16.04444444444444 239.6551724137931 16.04444444444444C 243.0103448275862 16.04444444444444 245.88620689655173 20.688888888888886 249.24137931034483 20.688888888888886C 252.59655172413792 20.688888888888886 255.47241379310347 27.444444444444443 258.82758620689657 27.444444444444443C 262.18275862068964 27.444444444444443 265.0586206896552 24.911111111111108 268.41379310344826 24.911111111111108C 271.7689655172414 24.911111111111108 274.6448275862069 13.93333333333333 278 13.93333333333333" pathfrom="M 0 42.22222222222222 L 0 42.22222222222222 L 9.586206896551724 42.22222222222222 L 19.17241379310345 42.22222222222222 L 28.75862068965517 42.22222222222222 L 38.3448275862069 42.22222222222222 L 47.93103448275862 42.22222222222222 L 57.51724137931034 42.22222222222222 L 67.10344827586206 42.22222222222222 L 76.6896551724138 42.22222222222222 L 86.27586206896551 42.22222222222222 L 95.86206896551724 42.22222222222222 L 105.44827586206897 42.22222222222222 L 115.03448275862068 42.22222222222222 L 124.62068965517241 42.22222222222222 L 134.20689655172413 42.22222222222222 L 143.79310344827587 42.22222222222222 L 153.3793103448276 42.22222222222222 L 162.9655172413793 42.22222222222222 L 172.55172413793102 42.22222222222222 L 182.13793103448276 42.22222222222222 L 191.72413793103448 42.22222222222222 L 201.3103448275862 42.22222222222222 L 210.89655172413794 42.22222222222222 L 220.48275862068965 42.22222222222222 L 230.06896551724137 42.22222222222222 L 239.6551724137931 42.22222222222222 L 249.24137931034483 42.22222222222222 L 258.82758620689657 42.22222222222222 L 268.41379310344826 42.22222222222222 L 278 42.22222222222222" fillRule="evenodd" />
                              <g id="SvgjsG2210" className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown" datarealindex={0}>
                                <g className="apexcharts-series-markers">
                                  <circle id="SvgjsCircle2237" r={0} cx={0} cy={0} className="apexcharts-marker wdg129f3 no-pointer-events" stroke="#ffffff" fill="#066fd1" fillOpacity={1} strokeWidth={2} strokeOpacity="0.9" default-marker-size={0} />
                                </g>
                              </g>
                            </g>
                            <g id="SvgjsG2211" className="apexcharts-datalabels" datarealindex={0} />
                          </g>
                          <line id="SvgjsLine2222" x1={0} y1={0} x2={278} y2={0} stroke="#b6b6b6" strokeDasharray={0} strokeWidth={1} strokeLinecap="butt" className="apexcharts-ycrosshairs" />
                          <line id="SvgjsLine2223" x1={0} y1={0} x2={278} y2={0} strokeDasharray={0} strokeWidth={0} strokeLinecap="butt" className="apexcharts-ycrosshairs-hidden" />
                          <g id="SvgjsG2224" className="apexcharts-xaxis" transform="translate(0, 0)">
                            <g id="SvgjsG2225" className="apexcharts-xaxis-texts-g" transform="translate(0, -4)" />
                          </g>
                          <g id="SvgjsG2234" className="apexcharts-yaxis-annotations" />
                          <g id="SvgjsG2235" className="apexcharts-xaxis-annotations" />
                          <g id="SvgjsG2236" className="apexcharts-point-annotations" />
                        </g>
                      </svg>
                      <div className="apexcharts-tooltip apexcharts-theme-dark">
                        <div className="apexcharts-tooltip-title" style={{ fontFamily: 'inherit', fontSize: 12 }} />
                        <div className="apexcharts-tooltip-series-group" style={{ order: 1 }}>
                          <span className="apexcharts-tooltip-marker" style={{ backgroundColor: 'rgb(6, 111, 209)' }} />
                          <div className="apexcharts-tooltip-text" style={{ fontFamily: 'inherit', fontSize: 12 }}>
                            <div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label" /><span className="apexcharts-tooltip-text-y-value" /></div>
                            <div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label" /><span className="apexcharts-tooltip-text-goals-value" /></div>
                            <div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label" /><span className="apexcharts-tooltip-text-z-value" /></div>
                          </div>
                        </div>
                      </div>
                      <div className="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-dark">
                        <div className="apexcharts-yaxistooltip-text" />
                      </div>
                    </div>
                  </div> */}

                  </div>
                </div>
              </div>
              <div className="row row-deck row-cards mb-4">
                <div class="col-12">
                  <div class="row row-cards">
                    <div class="col-sm-6 col-lg-3">
                      <div class="card card-sm">
                        <div class="card-body">
                          <div class="row align-items-center">
                            <div class="col-auto">
                              <span class="bg-primary text-white avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path><path d="M12 3v3m0 12v3"></path></svg>
                              </span>
                            </div>
                            <div class="col">
                              <div class="font-weight-medium">
                                {this.state.totalGenerated.isLoading ? this.renderSpinner('start') : this.state.totalGenerated.data}
                              </div>
                              <div class="text-secondary">
                                Project generated
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                      <div class="card card-sm">
                        <div class="card-body">
                          <div class="row align-items-center">
                            <div class="col-auto">
                              <span class="bg-green text-white avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M17 17h-11v-14h-2"></path><path d="M6 5l14 1l-1 7h-13"></path></svg>
                              </span>
                            </div>
                            <div class="col">
                              <div class="font-weight-medium">
                                78 Orders
                              </div>
                              <div class="text-secondary">
                                32 shipped
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                      <div class="card card-sm">
                        <div class="card-body">
                          <div class="row align-items-center">
                            <div class="col-auto">
                              <span class="bg-x text-white avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
                              </span>
                            </div>
                            <div class="col">
                              <div class="font-weight-medium">
                                623 Shares
                              </div>
                              <div class="text-secondary">
                                16 today
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                      <div class="card card-sm">
                        <div class="card-body">
                          <div class="row align-items-center">
                            <div class="col-auto">
                              <span class="bg-facebook text-white avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path></svg>
                              </span>
                            </div>
                            <div class="col">
                              <div class="font-weight-medium">
                                132 Likes
                              </div>
                              <div class="text-secondary">
                                21 today
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-deck row-cards">
                <div className="col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Platform generated</h3>
                    </div>
                    <table className="table card-table table-vcenter">
                      <thead>
                        <tr>
                          <th>Platform</th>
                          <th colSpan={2}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.historiesPerPlatform.isLoading ? (
                          <tr>
                            <td colSpan={2}>{this.renderSpinner()}</td>
                          </tr>) : this.state.historiesPerPlatform.data.map((data, key) => {
                            return <tr key={key}>
                              <td>{data.platform}</td>
                              <td>{data.count}</td>
                            </tr>
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </PanelLayout>
    )
  }
}

export default Dashboard;