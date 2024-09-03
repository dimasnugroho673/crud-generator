import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";


class Dashboard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div classname="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* Page pre-title */}
                <div className="page-pretitle">
                  Overview
                </div>
                <h2 className="page-title">
                  Dashboard
                </h2>
              </div>
              {/* Page title actions */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <span className="d-none d-sm-inline">
                    <a href="#" className="btn">
                      New view
                    </a>
                  </span>
                  <a href="#" className="btn btn-primary d-none d-sm-inline-block" data-bs-toggle="modal" data-bs-target="#modal-report">
                    {/* Download SVG icon from http://tabler-icons.io/i/plus */}
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                    Create new report
                  </a>
                  <a href="#" className="btn btn-primary d-sm-none btn-icon" data-bs-toggle="modal" data-bs-target="#modal-report" aria-label="Create new report">
                    {/* Download SVG icon from http://tabler-icons.io/i/plus */}
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            <div className="row row-deck row-cards">
              <div className="col-md-6 col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Social Media Traffic</h3>
                  </div>
                  <table className="table card-table table-vcenter">
                    <thead>
                      <tr>
                        <th>Network</th>
                        <th colSpan={2}>Visitors</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Instagram</td>
                        <td>3,550</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '71.0%' }} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Twitter</td>
                        <td>1,798</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '35.96%' }} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Facebook</td>
                        <td>1,245</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '24.9%' }} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>TikTok</td>
                        <td>986</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '19.72%' }} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Pinterest</td>
                        <td>854</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '17.08%' }} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>VK</td>
                        <td>650</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '13.0%' }} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Pinterest</td>
                        <td>420</td>
                        <td className="w-50">
                          <div className="progress progress-xs">
                            <div className="progress-bar bg-primary" style={{ width: '8.4%' }} />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;