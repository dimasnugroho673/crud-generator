import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import SampleProjectCanvasTemplateJson from '../../sample-project-canvas.json';
import * as bootstrap from '../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js'

class ProjectCanvas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: null,
            isLoadingGeneratedResults: false,
            loadingGeneratedResults: null,
            results: [],
            projectCanvas: {
                createProjectFrom: null
            },
            blueprintFormHtmlString: ""
            // projectCanvas: {
            //     templateVersion: '0.1',
            //     titleProject: 'Ruangan', // title is page or class page
            //     createProjectFrom: 'import_text', // import_file, import_text, ui_wizard
            //     exportProjectTo: 'file', // file, text
            //     platform: 'php-laravel', // php-laravel, php-ci3, php-ci4
            //     designPattern: "mvc",
            //     crudType: 'modal', // modal, page
            //     importData: { // fill false to avoid this feature
            //         fileExtension: 'xlsx'
            //     },
            //     exportData: { // fill false to avoid this feature
            //         fileExtension: 'csv'
            //     },
            //     showData: { // fill false to avoid this feature
            //         type: 'list',
            //     },
            //     blueprintForm: [
            //         // by row
            //         [
            //             {
            //                 label: 'Nama ruangan',
            //                 tag: 'input',
            //                 attributes: {
            //                     type: 'text',
            //                     class: 'form-control',
            //                     id: 'create-nama_ruangan',
            //                     name: 'nama_ruangan',
            //                     placeholder: 'Cth. Ruang rapat 1',
            //                     disabled: false,
            //                     readonly: false,
            //                     autofocus: true
            //                 },
            //                 validation: {
            //                     type: 'serverside', // serverside, clientside
            //                     rules: 'required|max:255|unique:unique:m_ruangan'
            //                 }
            //             },
            //             {
            //                 label: 'Lantai ruangan',
            //                 tag: 'input',
            //                 attributes: {
            //                     type: 'text',
            //                     class: 'form-control',
            //                     id: 'create-lantai_ruangan',
            //                     name: 'lantai_ruangan',
            //                     placeholder: 'Cth. Lt 1',
            //                     disabled: false,
            //                     readonly: false
            //                 },
            //                 validation: {
            //                     type: 'serverside', // serverside, clientside
            //                     rules: 'required'
            //                 }
            //             },
            //             {
            //                 label: 'Kapasitas ruangan',
            //                 tag: 'input',
            //                 attributes: {
            //                     type: 'text',
            //                     class: 'form-control',
            //                     id: 'create-kapasitas',
            //                     name: 'kapasitas',
            //                     placeholder: 'Cth. 50',
            //                     disabled: false,
            //                     readonly: false
            //                 },
            //                 validation: {
            //                     type: 'serverside', // serverside, clientside
            //                     rules: 'required|numeric'
            //                 }
            //             },
            //             {
            //                 label: 'Keterangan',
            //                 tag: 'textarea',
            //                 attributes: {
            //                     class: 'form-control',
            //                     id: 'create-keterangan',
            //                     name: 'keterangan',
            //                     placeholder: 'Keterangan tambahan',
            //                     row: 10,
            //                     column: 20,
            //                     disabled: false,
            //                     readonly: false
            //                 },
            //                 validation: {
            //                     type: 'serverside', // serverside, clientside
            //                     rules: 'nullable'
            //                 }
            //             },
            //             {
            //                 label: 'Foto',
            //                 tag: 'input',
            //                 attributes: {
            //                     type: 'file',
            //                     class: 'form-control',
            //                     id: 'create-foto_ruangan',
            //                     name: 'foto_ruangan'
            //                 },
            //                 validation: {
            //                     type: 'serverside', // serverside, clientside
            //                     rules: 'required|mimes:jpg,jpeg,png|max:2048'
            //                 },
            //                 storePath: '/foto_ruangan' // can null
            //             },
            //             // {
            //             //     label: 'Alamat email',
            //             //     tag: 'input',
            //             //     attributes: {
            //             //         type: 'email',
            //             //         class: 'form-control',
            //             //         id: 'add-email',
            //             //         name: 'email',
            //             //         placeholder: 'Email valid...',
            //             //         disabled: false,
            //             //         readonly: false,
            //             //         autofocus: false
            //             //     }
            //             // },
            //             // {
            //             //     label: 'Password',
            //             //     tag: 'input',
            //             //     attributes: {
            //             //         type: 'password',
            //             //         class: 'form-control',
            //             //         id: 'add-password',
            //             //         name: 'password',
            //             //         placeholder: 'Password...',
            //             //         disabled: false,
            //             //         readonly: true,
            //             //         autofocus: false
            //             //     }
            //             // },
            //             // {
            //             //     label: 'Jenis kelamin',
            //             //     tag: 'select',
            //             //     options: [
            //             //         {
            //             //             label: 'Pilih jenis kelamin',
            //             //             value: '',
            //             //             selected: true,
            //             //             disabled: true
            //             //         },
            //             //         {
            //             //             label: 'Laki-laki',
            //             //             value: 'male',
            //             //         },
            //             //         {
            //             //             label: 'Perempuan',
            //             //             value: 'female'
            //             //         },
            //             //     ],
            //             //     attributes: {
            //             //         class: 'form-select',
            //             //         id: 'add-jenis_kelamin',
            //             //         name: 'jenis_kelamin',
            //             //         disabled: false,
            //             //         readonly: false,
            //             //     }
            //             // },
            //         ]

            //     ]
            // }
        }
        this.handleImportProjectTemplate = this.handleImportProjectTemplate.bind(this)
        this.handleStartCanvas = this.handleStartCanvas.bind(this)
    }

    renderCanvasFromState() {
        if (this.state.projectCanvas['platform'] === undefined) {
            return;
        }

        let blueprints = this.state.projectCanvas.blueprintForm
        let totalRow = blueprints.length

        function generateX(elm) {
            // GENERATE DYNAMIC ATTRIBUTES
            let dynamicAttributes = {}
            for (const key in elm.attributes) {
                if (elm.attributes.hasOwnProperty(key)) {
                    if ((typeof elm.attributes[key]) != "boolean") {
                        dynamicAttributes[key] = elm.attributes[key]
                    } else {
                        if (elm.attributes[key]) {
                            dynamicAttributes[key] = elm.attributes[key]
                        }
                    }
                }
            }
            // GENERATE DYNAMIC ATTRIBUTES

            if (elm.tag == 'select') {
                return <select {...dynamicAttributes}>
                    {elm.options.map(opt => {
                        return <option >{opt.label}</option>
                    })}
                </select>
            }

            if (elm.tag == 'input') {
                return <input {...dynamicAttributes} />
            }

            if (elm.tag == 'textarea') {
                return <textarea {...dynamicAttributes}></textarea>
            }
        }

        return <div className="card">
            <div className="card-header">
                <div className="card-title">Preview Form</div>
            </div>
            <div className="card-body">
                {blueprints.map(blp => {
                    let explodingToColumn = Math.round(12 / totalRow)

                    return <div className="row pseudo-row">
                        <div className="pseudo-row-button" style={{ display: 'none' }}>
                            <button className="btn btn-sm btn-primary">Tambah</button>
                            <button className="btn btn-sm btn-info">Edit</button>
                            <button className="btn btn-sm btn-danger">Hapus</button>
                        </div>

                        <br /><br />
                        {
                            blp.map(elm => {
                                return <div className={`form-group ${blp.length > 1 ? '' : 'pseudo-row'} ${blp.length > 1 ? 'col-md-' + explodingToColumn : ''} mb-3`}>
                                    <label className="mb-1" for={`${elm.attributes.id}`}>{elm.label}</label>
                                    {generateX(elm)}
                                </div>
                            })}

                    </div>
                })}
                {/* <div className="row pseudo-row">
                    <div className="pseudo-row-button" style={{ display: 'none' }}>
                        <button className="btn btn-sm btn-primary">Tambah</button> 
                        <button className="btn btn-sm btn-info">Edit</button>
                         <button className="btn btn-sm btn-danger">Hapus</button>
                    </div> 
                    
                    <br/><br/>
                    {elements.map(elm => {
                        return <div className={ `form-group ${elements.length > 1 ? '' : 'pseudo-row'} ${elements.length > 1 ? 'col-md-' + explodingToColumn : ''} mb-3` }>
                            <label className="mb-1" for={`${elm.attributes.id}`}>{elm.label}</label>
                            {generateX(elm)}
                        </div>
                    })}
                </div> */}
            </div>
            <div className="card-footer">
                <div className="card-title">Preview Tree</div>
                <div>
                    <ul id="myUL">
                        {blueprints.map((blp, index) => {
                            return <li><span class="caret">{`Row ${index + 1}`}</span>
                                <ul class="nested">
                                    {blp.map(elm => {
                                        return <li>{elm.attributes.name}</li>
                                    })}
                                </ul>
                            </li>
                        })}

                    </ul>
                </div>
            </div>
        </div>
    }

    generatePureHtmlFromState() {
        if (this.state.projectCanvas['platform'] === undefined) {
            return;
        }

        let blueprints = this.state.projectCanvas.blueprintForm
        let totalRow = blueprints.length

        function generateX(elm) {
            // GENERATE DYNAMIC ATTRIBUTES
            let dynamicAttributes = {}
            for (const key in elm.attributes) {
                if (elm.attributes.hasOwnProperty(key)) {
                    if ((typeof elm.attributes[key]) != "boolean") {
                        dynamicAttributes[key] = elm.attributes[key]
                    } else {
                        if (elm.attributes[key]) {
                            dynamicAttributes[key] = elm.attributes[key]
                        }
                    }
                }
            }
            // GENERATE DYNAMIC ATTRIBUTES

            if (elm.tag == 'select') {
                return <select {...dynamicAttributes}>
                    {elm.options.map(opt => {
                        return <option >{opt.label}</option>
                    })}
                </select>
            }

            if (elm.tag == 'input') {
                return <input {...dynamicAttributes} />
            }

            if (elm.tag == 'textarea') {
                return <textarea {...dynamicAttributes}></textarea>
            }
        }

        const view = <div className="modal fade" id="create-modal" tabindex="-1" aria-labelledby="create-modal-label" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="create-modal-label">Tambah data</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div className="modal-body">
                        {blueprints.map(blp => {
                            let explodingToColumn = Math.round(12 / totalRow)

                            return <div className="row">{blp.map(elm => {
                                return <div className={`form-group${blp.length > 1 ? ' col-md-' + explodingToColumn + ' ' : ' '}mb-3`}>
                                    <label className="mb-1" for={elm.attributes.id}>{elm.label}</label>
                                    {generateX(elm)}
                                    <div id={`${elm.attributes.id}-msg`}></div>
                                </div>
                            })}</div>
                        })}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" className="btn btn-primary">Tambahkan</button>
                    </div>
                </div>
            </div>
        </div>

        const htmlString = ReactDOMServer.renderToString(view)
        this.setState({ blueprintFormHtmlString: htmlString })
        this.setState((prevState, props) => ({
            results: [...prevState.results, {
                fileName: 'modal.blade.php',
                description: '',
                code: htmlString
            }]
        }))
        this.setState((prevState, props) => ({
            results: [...prevState.results, {
                fileName: 'index.blade.php',
                description: '',
                code: 'index...'
            }]
        }))
    }

    generateLogicFromState() {
        if (this.state.projectCanvas['platform'] === undefined) {
            return;
        }

        function generateValidation(inputs) {
            let finalResult
            let fieldAssignRules = `$validator = Validator::make($request->all(), [`

            inputs.map(input => {
                fieldAssignRules += `\n    '${input.attributes.name}' => '${input.validation.rules}'`
            })

            fieldAssignRules += `\n ]);`

            let returnBackValidationFail = `
            if ($validator->fails()) {
                return response()->json([
                    'status'    => 'error',
                    'message'   => 'Ooopps',
                    'errors'    => $validator->errors()
                ], 422);
                }
            `

            finalResult = fieldAssignRules + returnBackValidationFail

            return finalResult
        }

        function generateCreateData(inputs) {
            let finalResult

            let uploadFile = () => {
                let result

                // inputs.map(input => {
                //     if (input.attributes.type === 'file' && input.storePath !== null) {
                //         result += `$validator['${input.attributes.name}'] = $request->file('${input.attributes.name}')->store('${input.storePath}');`
                //     }
                // })

                return result
            }


            finalResult += `try {
                $validator = $request->all();
                
                ${uploadFile()}
                
                // Inserting data....
                
                // Create logging here....
                
                // Result....

                return response()->json([
                    'status'    => 'success',
                    'message'   => 'Berhasil menambah data',
                    'data'      => null
                ], 201);
                
            } catch (Exception $e) {
                return response()->json([
                    'status'    => 'error',
                    'message'   => 'Gagal menambah data, ' . $e->getMessage(),
                    'data'      => null
                ], 500);
            }
`

            return finalResult
        }

        // FINAL RESULT VARIABLE
        let finalResults = []

        // header class
        let mainLogic =
            `<?php

/*
    This code is generated by crud-generator.beta.dimasnugroho673.github.io
    @https://github.com/dimasnugroho673
    
    This generator using beta version, still check and test your code before paste to production
*/

namespace App\Http\Controllers\Master;

use Exception;
... your model here
use Illuminate\\Http\\Request;
use App\\Http\\Controllers\\Controller;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Facades\\Validator;

// insert your dependency namespace here....

class ${this.state.projectCanvas.titleProject}Controller extends Controller {

    public function index(Request $request) { 
        return 'view ${this.state.projectCanvas.titleProject}';
    }

    public function store(Request $request) {
        ${generateValidation(this.state.projectCanvas.blueprintForm.flat())}   

        ${generateCreateData(this.state.projectCanvas.blueprintForm)}
    }

    public function update(Request $request, $id) {
        // your update code here....
    }

    public function destroy($id) {
        try {
            // delete data here....

            // delete unneccessary file...

            // update log...

            return response()->json([
                'status'    => 'success',
                'message'   => 'Berhasil menghapus data',
                'data'      => null
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'    => 'error',
                'message'   => 'Gagal menghapus data, ' . $e->getMessage(),
                'data'      => null
            ], 500);
        }
    }
}`

        // finalResults.push(mainLogic)
        this.setState((prevState, props) => ({
            results: [...prevState.results, {
                fileName: this.generateFilename(this.state.projectCanvas.platform, 'controller'),
                description: '',
                code: mainLogic
            }]
        }))
        // return <textarea className="form-control" rows={10} cols={30}>{mainLogic}</textarea>
        // finalResults.map(separated => {
        //     return <textarea className="form-control" rows={10} cols={30}>{separated}</textarea>
        // })
    }

    // generateViewFromState() {
    //     return <div>
    //         <div className="mb-3">
    //             <label htmlFor="">modal.blade.php</label>
    //             <textarea className="form-control" rows={10} cols={30}>{this.state.blueprintFormHtmlString}</textarea>
    //         </div>
    //     </div>
    // }

    componentDidMount() {
        // this.renderCanvasFromState()
        // generateCanvas()

        this.setState({ loadingGeneratedResults: this.fragmentMakeMeAwesome() })
    }

    handleImportProjectTemplate(type, e) {
        console.log(e)
    }

    handleStartCanvas(e) {

        this.setState({ isLoadingGeneratedResults: true })

        let sourceTemplate
        if (this.state.projectCanvas.createProjectFrom === 'import_text') {
            this.setState({ loadingGeneratedResults: this.fragmentGeneratingResult('Validating JSON...') })

            setTimeout(() => {
                try {
                    sourceTemplate = document.querySelector('#create-import_text').value

                    sourceTemplate = JSON.parse(sourceTemplate)
                    sourceTemplate['createProjectFrom'] = 'import_text'

                    setTimeout(() => {
                        this.setState({ projectCanvas: sourceTemplate }, () => {
                            this.generatePureHtmlFromState()
                            this.generateLogicFromState()
                        })
                    }, 2000)
                } catch (error) {
                    alert('Validating JSON failed: ' + error.message)
                } finally {
                    document.querySelector('#modal-create-project .btn-close').click()

                    this.setState({ isLoadingGeneratedResults: false })
                    this.setState({ loadingGeneratedResults: this.fragmentMakeMeAwesome() })
                }
            }, 500)

        } else if (this.state.projectCanvas.createProjectFrom === 'import_file') {
            sourceTemplate = document.getElementById("create-import_file").files[0]

            this.setState({ loadingGeneratedResults: this.fragmentGeneratingResult('Validating JSON...') })

            if (sourceTemplate) {
                setTimeout(() => {
                    let reader = new FileReader()

                    reader.readAsText(sourceTemplate, "UTF-8")
                    reader.onload = (e) => {
                        sourceTemplate = JSON.parse(e.target.result)
                        sourceTemplate['createProjectFrom'] = 'import_file'

                        this.setState({ projectCanvas: sourceTemplate }, () => {
                            this.generatePureHtmlFromState()
                            this.generateLogicFromState()
                        })

                        this.setState({ isLoadingGeneratedResults: false })

                        document.querySelector('#modal-create-project .btn-close').click()
                    }
                    reader.onerror = (e) => {
                        console.error('error read file json: ', e.target.result)
                        // document.getElementById("fileContents").innerHTML = "error reading file";
                    }
                }, 2000)
            }
        }
    }

    // final results
    renderFinalResults() {
        return this.state.results.map(piece => {
            return <div className="form-group mb-3">
                <label htmlFor="">{piece.fileName}</label>
                <textarea className="form-control" rows={10} cols={30}>{piece.code}</textarea>
                <button className="btn btn-sm btn-primary mt-2">Download file</button>
            </div>
        })
    }

    // small func
    generateFilename(platform, typePattern) { // typePattern like controlller, view, model, service, etc....
        if (platform === 'php-laravel') {
            if (typePattern === 'controller') {
                return this.state.projectCanvas.titleProject + 'Controller.php'
            }

            if (typePattern === 'view') {

            }
        }

    }

    fragmentMakeMeAwesome() {
        return <div><i class="bi bi-stars me-2"></i> Make me awesome</div>
    }

    fragmentGeneratingResult(text) {
        return <div>{text}</div>
    }

    render() {
        return (
            <div className="page-wrapper">
                <div className="page-header d-print-none">
                    <div className="container-xl">
                        <div className="row g-2 align-items-center">
                            <div className="col">

                                <div className="page-pretitle">
                                    Project
                                </div>
                                <h2 className="page-title">
                                    Canvas
                                </h2>
                            </div>

                            <div className="col-auto ms-auto d-print-none">
                                <div className="btn-list">
                                    <a href="#" className="btn btn-primary d-none d-sm-inline-block" data-bs-toggle="modal"
                                        data-bs-target="#modal-create-project">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                                            viewBox="0 0 24 24" strokeWidth={"2"} stroke="currentColor" fill="none"
                                            strokeLinecap={"round"} strokeLinejoin={"round"}>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M12 5l0 14" />
                                            <path d="M5 12l14 0" />
                                        </svg>
                                        Create project
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">
                        <div className="row row-deck row-cards">
                            <div class="alert alert-warning" role="alert">
                                This project now beta version and only support for CRUD master data.  Consider to use this tools for boosting workflow development, and still recheck manually result generated code.
                            </div>

                            <div id="fragment-preview"></div>



                            {this.state.isLoadingGeneratedResults && <div class="text-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <h5 className="mt-1">Generating code...</h5>
                            </div>
                            }

                            {this.state.projectCanvas['platform'] !== undefined &&
                                <div>
                                    {this.renderCanvasFromState()}

                                    <div className="mt-5"></div>
                                    <br /><br /><br /><br /><br />
                                    <hr />

                                    {/* <h3>Main Logic</h3> */}
                                    {/* {this.generateLogicFromState()} */}

                                    {/* <h3>View</h3> */}
                                    {/* {this.generateViewFromState()} */}
                                    {/* <textarea name="asd" id="asd" className="form-control" value={this.state.blueprintFormHtmlString} rows={10} cols={30}></textarea> */}

                                    <h3>Final result {`(${this.state.results.length} file)`}</h3>

                                    <div class="alert alert-warning" role="alert">
                                        Generated code isn't prettier, please pretty your code manually
                                    </div>

                                    {this.renderFinalResults()}
                                </div>
                            }

                        </div>
                    </div>
                </div>

                {/* <footer className="footer footer-transparent d-print-none">
          <div className="container-xl">
            <div className="row text-center align-items-center flex-row-reverse">
              <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">
                    Copyright &copy; 2023
                    <a href="." className="link-secondary">Tabler</a>.
                    All rights reserved.
                  </li>
                  <li className="list-inline-item">
                    <a href="./changelog.html" className="link-secondary" rel="noopener">
                      v1.0.0-beta19
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer> */}

                <div className="modal modal-blur fade" id="modal-create-project" tabIndex={"-1"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create project</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Start with...</label>
                                <div className="form-selectgroup-boxes row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-selectgroup-item" onClick={(e) => this.setState({ projectCanvas: { ...this.state.projectCanvas, createProjectFrom: 'ui_wizard' } })}>
                                            <input type="radio" name="report-type" value="1" className="form-selectgroup-input" />
                                            <span className="form-selectgroup-label d-flex align-items-center p-3">
                                                <span className="me-3">
                                                    <span className="form-selectgroup-check"></span>
                                                </span>
                                                <span className="form-selectgroup-label-content">
                                                    <span className="form-selectgroup-title strong mb-1">Simple</span>
                                                    <span className="d-block text-muted">Create form and page using UI</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-selectgroup-item" onClick={(e) => this.setState({ projectCanvas: { ...this.state.projectCanvas, createProjectFrom: 'import_file' } })}>
                                            <input type="radio" name="report-type" value="1" className="form-selectgroup-input" />
                                            <span className="form-selectgroup-label d-flex align-items-center p-3">
                                                <span className="me-3">
                                                    <span className="form-selectgroup-check"></span>
                                                </span>
                                                <span className="form-selectgroup-label-content">
                                                    <span className="form-selectgroup-title strong mb-1">Advanced (file)</span>
                                                    <span className="d-block text-muted">Create form and page using JSON File template</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-selectgroup-item" onClick={(e) => this.setState({ projectCanvas: { ...this.state.projectCanvas, createProjectFrom: 'import_text' } })}>
                                            <input type="radio" name="report-type" value="1" className="form-selectgroup-input" />
                                            <span className="form-selectgroup-label d-flex align-items-center p-3">
                                                <span className="me-3">
                                                    <span className="form-selectgroup-check"></span>
                                                </span>
                                                <span className="form-selectgroup-label-content">
                                                    <span className="form-selectgroup-title strong mb-1">Advanced (text)</span>
                                                    <span className="d-block text-muted">Create form and page using JSON text template</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {this.state.projectCanvas.createProjectFrom === 'import_text' && (

                                        <div className="col-lg-12">
                                            <a className="btn btn-outline-info mb-3" href={SampleProjectCanvasTemplateJson} download="sample-project-canvas-template-json.json"><i class="bi bi-filetype-json me-2"></i> Download sample data JSON</a>

                                            <div>
                                                <label className="form-label">Paste your JSON template here</label>
                                                <textarea id="create-import_text" className="form-control" rows="3"></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {this.state.projectCanvas.createProjectFrom === 'import_file' && (
                                        <div className="col-lg-12">
                                            <div>
                                                <label className="form-label">Import your JSON file here</label>
                                                <input type="file" className="form-control" id="create-import_file" accept=".json" />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <div className="modal-footer">
                                <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </a>
                                <a href="#" className="btn btn-primary ms-auto" id="btn-create-fragment" onClick={(e) => this.handleStartCanvas()}>{this.state.loadingGeneratedResults}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// function generateCanvas() {
//     let psudoRow = document.querySelector('.pseudo-row')

//     if (psudoRow != null) {
//         psudoRow.addEventListener('click', function (e) {
//             psudoRow.classList.add('active')
//         })
//     }

//     let previewFragment = document.querySelector('#fragment-preview')
//     let btnCreateFragment = document.querySelector('#btn-create-fragment')

//     let formJSON = {
//         elements: [
//             {
//                 label: 'Nama lengkap',
//                 tag: 'input',
//                 attributes: {
//                     type: 'text',
//                     class: 'form-control',
//                     id: 'add-nama',
//                     name: 'nama',
//                     placeholder: 'Nama lengkap...',
//                     disabled: false,
//                     readonly: false,
//                     autofocus: true
//                 }
//             },
//             {
//                 label: 'Alamat email',
//                 tag: 'input',
//                 attributes: {
//                     type: 'email',
//                     class: 'form-control',
//                     id: 'add-email',
//                     name: 'email',
//                     placeholder: 'Email valid...',
//                     disabled: false,
//                     readonly: false,
//                     autofocus: false
//                 }
//             },
//             {
//                 label: 'Password',
//                 tag: 'input',
//                 attributes: {
//                     type: 'password',
//                     class: 'form-control',
//                     id: 'add-password',
//                     name: 'password',
//                     placeholder: 'Password...',
//                     disabled: true,
//                     readonly: true,
//                     autofocus: false
//                 }
//             },
//             // {
//             //     label: 'Foto',
//             //     tag: 'input',
//             //     attributes: {
//             //         type: 'file',
//             //         class: 'form-control',
//             //         id: 'add-file',
//             //         name: 'file'
//             //     }
//             // },
//             {
//                 label: 'Jenis kelamin',
//                 tag: 'select',
//                 options: [
//                     {
//                         label: 'Pilih jenis kelamin',
//                         value: '',
//                         selected: true,
//                         disabled: true
//                     },
//                     {
//                         label: 'Laki-laki',
//                         value: 'male',
//                     },
//                     {
//                         label: 'Perempuan',
//                         value: 'female'
//                     },
//                 ],
//                 attributes: {
//                     class: 'form-select',
//                     id: 'add-jenis_kelamin',
//                     name: 'jenis_kelamin',
//                     disabled: false,
//                     readonly: false,
//                 }
//             },
//         ]
//     }

//     btnCreateFragment.addEventListener('click', () => {

//         let cardTemplater = function (element) {
//             return `<div className="card">
//                                         <div className="card-body">
//                                             ${element}
//                                         </div>
//                                     </div>`
//         }

//         let piece = ''
//         let explodingToColumn = 12 / formJSON.elements.length

//         if (formJSON.elements.length > 1) {
//             piece += '<div className="row pseudo-row">'
//             piece += '<div className="pseudo-row-button" style="display: none;"><button className="btn btn-sm btn-primary">Tambah</button> <button className="btn btn-sm btn-info">Edit</button> <button className="btn btn-sm btn-danger">Hapus</button></div> <br><br>'
//         }

//         formJSON.elements.forEach(elm => {
//             piece += `<div className="form-group ${formJSON.elements.length > 1 ? '' : 'pseudo-row'} ${formJSON.elements.length > 1 ? 'col-md-' + explodingToColumn : ''} mb-3">`
//             piece += `<label className="mb-1" for="${elm.attributes.id}">${elm.label}</label>`

//             if (elm.tag != 'select') {
//                 piece += `<${elm.tag}`
//                 piece += ` ${elm.attributes.type} `

//                 for (const key in elm.attributes) {
//                     if (elm.attributes.hasOwnProperty(key)) {
//                         if ((typeof elm.attributes[key]) != "boolean") {
//                             piece += ` ${key}="${elm.attributes[key]}"`
//                         } else {
//                             if (elm.attributes[key]) {
//                                 piece += ` ${key}="${elm.attributes[key]}"`
//                             } else {
//                                 piece += ``
//                             }
//                         }
//                     }
//                 }

//                 piece += `>`
//             } else {
//                 piece += `<${elm.tag}`
//                 for (const key in elm.attributes) {
//                     if (elm.attributes.hasOwnProperty(key)) {
//                         if ((typeof elm.attributes[key]) != "boolean") {
//                             piece += ` ${key}="${elm.attributes[key]}"`
//                         } else {
//                             if (elm.attributes[key]) {
//                                 piece += ` ${key}="${elm.attributes[key]}"`
//                             } else {
//                                 piece += ``
//                             }
//                         }
//                     }
//                 }
//                 piece += `>`

//                 // option generate
//                 let options = ''
//                 elm.options.forEach(opt => {
//                     let option = `<option value="${opt.value}" ${opt.hasOwnProperty('selected') ? 'selected' : ''} ${opt.hasOwnProperty('disabled') ? 'disabled' : ''}>${opt.label}</option>`

//                     // for (const key in opt) {
//                     //     if (opt.hasOwnProperty(key)) {
//                     //         option += ` value="${opt.value}"`
//                     //         option += ` ${key}="${opt[key]}"`
//                     //     }
//                     // }

//                     options += option
//                 })

//                 piece += options
//                 piece += `</${elm.tag}>`
//             }

//             piece += '</div>'

//             // piece += `<button className="btn btn-outline-primary">+ Tambah element</button>`
//         })

//         if (formJSON.elements.length > 1) {
//             piece += '</div>'

//             // piece += `<button className="btn btn-outline-primary">+ Tambah element</button>`
//         }
//         previewFragment.innerHTML += cardTemplater(piece)
//         // previewFragment.insertAdjacentHTML('beforeend', `<button className="btn btn-outline-primary">+ Tambah element</button>`)
//         document.querySelector('.card-body').insertAdjacentHTML('afterbegin', `<div className="row p-3"><button className="btn btn-outline-dark">+ Tambah element</button></row>`)
//         document.querySelector('.card-body').insertAdjacentHTML('beforeend', `<div className="row p-3"><button className="btn btn-outline-dark">+ Tambah element</button></row>`)
//         // document.querySelector('.card-body').innerHTML += `<button className="btn btn-sm btn-primary ms-3">+ Tambah element</button>`

//         // previewFragment.innerHTML += cardTemplater(`
//         // <div className="mb-3">
//         //                   <label className="form-label">Text</label>
//         //                   <input type="text" className="form-control" name="example-text-input" placeholder="Input placeholder">
//         //                 </div>
//         // `)

//         // previewFragment.innerHTML += `<h1>${new Date()}</h1>`

//         psudoRow = document.querySelector('.pseudo-row')
//         psudoRow.addEventListener('click', function (e) {
//             psudoRow.classList.add('active')
//         })

//         document.getElementsByClassName('pseudo-row')[0].addEventListener('mouseenter', function () {
//             document.getElementsByClassName('pseudo-row-button')[0].style.display = "block"
//         })

//         document.getElementsByClassName('pseudo-row')[0].addEventListener('mouseleave', function () {
//             document.getElementsByClassName('pseudo-row-button')[0].style.display = "none"
//         })
//     })

//     // btn-add-input

//     // setTimeout(() => {
//     //     [].forEach.call(document.getElementsByClassName('pseudo-row-button'), function (el) {
//     //         el.style.display = 'none';
//     //     });
//     // }, 5000);


// }

export default ProjectCanvas;

