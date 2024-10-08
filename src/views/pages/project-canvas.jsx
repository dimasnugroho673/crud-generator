import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import SampleProjectCanvasTemplateJson from '../../sample-project-canvas.json';
import { collection, addDoc, updateDoc, getDocs, getFirestore, query, where, db, doc, documentId } from "firebase/firestore";
import firebaseConf from '../../utils/firebase-config';
import * as bootstrap from '../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PanelLayout from "../layouts/panel/layout";
import Constant from "../../utils/constant.js";

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
            blueprintFormHtmlString: "",
            histories: {
                isLoading: true,
                data: []
            }
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

        if (this.state.projectCanvas.crudType === 'api') {
            return;
        }

        let blueprints = this.state.projectCanvas.blueprintForm
        let inputs = blueprints.flat()
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

        const generateModal = (type) => {
            let headerTitle = type == 'create' ? 'Tambah' : 'Ubah'
            let footerTitle = type == 'create' ? 'Tambahkan' : 'Ubah'
            let buttonStyle = type == 'create' ? 'btn btn-primary' : 'btn btn-warning'

            return <div className="modal fade" id={`modal-${type}`} tabindex="-1" aria-labelledby={`${type}-modal-label`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form id={`form-${type}`}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id={`${type}-modal-label`}>{headerTitle} data</h1>
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
                                <button type="submit" className={buttonStyle}>{footerTitle}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        }

        const generateIndexPage = () => {
            let finalResult = ''

            const generateTable = () => {

                let generateColumn = () => {
                    let result = ''
                    inputs.map(input => {
                        let orderable = ''
                        if (input.attributes.type === 'number' || input.attributes.type === 'date') {
                            orderable = 'data-orderable="true"'
                        } else {
                            orderable = ''
                        }
                        result += `<th ${orderable}>{{ __('${input.attributes.name}') }}</th>`
                    })

                    return result
                }

                return `
                    <div class="table-responsive">
                        <table id="table" class="table table-striped">
                            <thead>
                                <tr>
                                    <th width="10%">{{ __('No') }}</th>
                                    ${generateColumn()}
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                `
            }

            finalResult = generateTable()

            return finalResult
        }

        const generateScript = () => {
            let finalResult = ''

            finalResult = `<script>
                let formMode = 'create'
            `

            const datatable = () => {
                let finalResult = ''

                let generateColumn = () => {
                    let result = ''
                    inputs.map(input => {
                        result += `{
                                data: '${input.attributes.name}',
                                name: '${input.attributes.name}'
                            },`
                    })

                    return result
                }

                finalResult = `
                    let table = $('#table').DataTable({
                        processing: true,
                        serverSide: true,
                        responsive: true,
                        ajax: "{{ url()->current() }}",
                        lengthMenu: [10, 25, 50],
                        columns: [{
                                data: 'DT_RowIndex',
                                name: 'DT_RowIndex'
                            },
                            ${generateColumn()}
                            {
                                data: 'actions',
                                name: 'actions',
                                orderable: false,
                                searchable: false
                            },
                        ]
                    })
                `

                return finalResult
            }

            const updateData = () => {
                return `
                    $('#table tbody').on('click', '.btn-update', function() {
                        let id = $(this).data('id')
                        let detail = $(this).data('detail')

                        formMode = 'update'

                        for (const key in detail) {
                            if (detail.hasOwnProperty(key)) {
                                $(\`#update-\${key}\`).val(detail[key])
                            }
                        }
                        $(\`#modal-\${formMode}\`).modal('show')
                    })
                `
            }

            const createData = () => {
                return `
                    $('#form-create').submit(function(e) {
                        e.preventDefault()

                        let formData = new FormData(this)
                        formData.append('_method', 'post')
                        formData.append('_token', getCsrfToken())

                        callApi(formData)
                    })
                `
            }

            const deleteData = () => {
                return `
                    $('#form-update').submit(function(e) {
                        e.preventDefault()

                        // fill id here...
                        let id = $('#update-...').val()

                        let formData = new FormData(this)
                        formData.append('_method', 'put')
                        formData.append('_token', getCsrfToken())

                        callApi(formData, \`{{ url()->current() }}/\${id}\`)
                    })

                    $('#table tbody').on('click', '.btn-delete', function() {
                        let id = $(this).data('id')

                        showSwalConfirm(\`Hapus\`, 'Hapus data?', 'warning', function(result) {
                            if (result) {
                                let formData = new FormData()
                                formData.append('_method', 'delete')
                                formData.append('_token', getCsrfToken())

                                callApi(formData, "{{ url()->current() }}" + "/" + id)
                            }
                        })
                    })
                `
            }

            const callApi = () => {
                return `
                    function callApi(formData, url = null) {
                        $.ajax({
                            url: url == null ? "{{ url()->current() }}" : url,
                            method: "POST",
                            data: formData,
                            dataType: "JSON",
                            cache: false,
                            contentType: false,
                            processData: false,
                            beforeSend: function() {
                                clearValidationMessage(formMode, 'msg')
                            },
                            success: function(response) {
                                $(\`#form-\${formMode}\`).trigger('reset')
                                $(\`#modal-\${formMode}\`).modal('hide')
                                formMode = 'create'
                                showSwal(response.message, response.status)
                                table.ajax.reload()
                            },
                            error: function(response) {
                                if (response.status == 422) {
                                    let error = response.responseJSON.errors
                                    clearValidationMessage(formMode, 'msg')
                                    validationMessageRender(error, formMode, 'msg')
                                    return
                                }

                                showSwal(response.responseJSON.message, response.responseJSON.status)
                            }
                        })
                    }
                `
            }

            finalResult += datatable() + updateData() + deleteData() + callApi()

            finalResult += `</script>`

            return finalResult
        }

        let modalHtmlString = ReactDOMServer.renderToString(generateModal('create'))
        modalHtmlString += ReactDOMServer.renderToString(generateModal('update'))
        this.setState({ blueprintFormHtmlString: modalHtmlString })
        this.setState((prevState, props) => ({
            results: [...prevState.results, {
                fileName: 'modal.blade.php',
                description: '',
                code: modalHtmlString,
                language: 'html'
            }]
        }))

        let indexHtmlString = generateIndexPage() + generateScript()
        this.setState((prevState, props) => ({
            results: [...prevState.results, {
                fileName: 'index.blade.php',
                description: '',
                code: indexHtmlString,
                language: 'html'
            }]
        }))
    }

    generateLogicFromState() {
        if (this.state.projectCanvas['platform'] === undefined) {
            return;
        }

        function generateDatatables(inputs) {
            let finalResult

            finalResult = `
            // Get data here
            $data = YourModel::all();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('actions', function ($row) {
                    $btn = '';

                    $btn .= '<a href="javascript:void(0)" class="btn btn-outline-warning btn-sm btn-update me-1" data-detail="' . htmlspecialchars($row) . '"  data-id=' . $row->id . '><i class="bi bi-pencil-square"></i> Edit</a>';

                    $btn .= '<a href="javascript:void(0)" class="btn btn-outline-danger btn-sm btn-delete" data-id=' . $row->id . '><i class="bi bi-trash-fill"></i> Delete</a>';

                    return $btn;
                })
                ->rawColumns(['actions'])
                ->make(true);
            `

            return finalResult
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

        const generateIndex = () => {
            let finalResult = ``

            if (this.state.projectCanvas.crudType === 'api') {
                finalResult += `
                return return response()->json([
                    'status'    => 'success',
                    'message'   => 'Berhasil menampilkan data',
                    'data'      => YourModel::paginate(10)
                ], 200);
                `
            } else if (this.state.projectCanvas.crudType === 'modal') {
                finalResult += `
                if ($request->ajax()) {
                    ${generateDatatables(this.state.projectCanvas.blueprintForm.flat())}
                }

                $data['title'] = $this->title;
                $data['subtitle'] = $this->subtitle;

                return view('admin.master.${this.state.projectCanvas.titleProject.toLowerCase()}.index', $data);
                `
            }

            return finalResult
        }

        function generateCreateData(inputs) {
            let finalResult = ``

            let uploadFile = (inputs) => {
                let result = ``

                inputs.map(input => {
                    if (input.attributes.type === 'file' && input.storePath !== null) {
                        result += `\n $validator['${input.attributes.name}'] = $request->file('${input.attributes.name}')->store('${input.storePath}');`
                    }
                })

                return result
            }


            finalResult += `try {
                $validator = $request->all();
                
                ${uploadFile(inputs)}
                
                // Inserting data....
                YourModel::create($validator);
                
                // Create logging here....
                Helper::insertLog("Menambahkan data $this->title");

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

        function hasFile(inputs) {
            let hasFileExist = false

            inputs.map(input => {
                if (input.attributes.type === 'file' && input.storePath !== null) {
                    hasFileExist = true
                }
            })

            return hasFileExist
        }

        function generateUpdateData(inputs) {
            let finalResult = ``

            let uploadFile = (inputs) => {
                let result = ``

                inputs.map(input => {
                    if (input.attributes.type === 'file' && input.storePath !== null) {
                        result += `\n $validator['${input.attributes.name}'] = $request->file('${input.attributes.name}')->store('${input.storePath}');`
                    }
                })

                return result
            }

            let deleteFile = (inputs) => {
                let result = ``

                inputs.map(input => {
                    if (input.attributes.type === 'file' && input.storePath !== null) {
                        result += `Storage::delete($old_data->${input.attributes.name});`
                    }
                })

                return result
            }

            finalResult += `try {
                $validator = $request->all();

                // getting old data
                $old_data = YourModel::find($id);

                // update data here....
                YourModel::find($id)->update($validator);

                // update file...
                ${uploadFile(inputs)}

                // delete old file
                ${deleteFile(inputs)}

                // update log...
                Helper::insertLog("Mengubah data $this->title");

                return response()->json([
                    'status'    => 'success',
                    'message'   => 'Berhasil mengubah data',
                    'data'      => null
                ], 200);
            } catch (Exception $e) {
                return response()->json([
                    'status'    => 'error',
                    'message'   => 'Gagal mengubah data, ' . $e->getMessage(),
                    'data'      => null
                ], 500);
            }`

            return finalResult
        }

        // header class
        let mainLogic =
            `<?php

        /*
            This code is generated by crud-generator.beta.dimasnugroho673.github.io
            @https://github.com/dimasnugroho673
            
            This generator using beta version, still check and test your code before paste to production
        */

        namespace App\\Http\\Controllers\\Master;

        use Exception;
        use App\\Helpers\\Helper;
        use Illuminate\\Http\\Request;
        use App\\Http\\Controllers\\Controller;
        ${hasFile(this.state.projectCanvas.blueprintForm.flat()) ? 'use Illuminate\\Support\\Facades\\Storage;' : ''}
        use Yajra\\DataTables\\DataTables;
        use Illuminate\\Support\\Facades\\Validator;
        use App\\Models\\YourModel;

        // insert your dependency namespace here....

        class ${this.state.projectCanvas.titleProject}Controller extends Controller {

            private $title = "${this.state.projectCanvas.titleProject}";
            private $subtitle = "Master ${this.state.projectCanvas.titleProject}";

            public function index(Request $request) { 
               ${generateIndex()}
            }

            public function store(Request $request) {
                ${generateValidation(this.state.projectCanvas.blueprintForm.flat())}   

                ${generateCreateData(this.state.projectCanvas.blueprintForm.flat())}
            }

            public function update(Request $request, $id) {
                ${generateValidation(this.state.projectCanvas.blueprintForm.flat())}

                ${generateUpdateData(this.state.projectCanvas.blueprintForm.flat())}
            }

            public function destroy($id) {
                try {
                    // getting old data
                    $old_data = YourModel::find($id);

                    // delete data here....
                    YourModel::destroy($id);

                    // delete unneccessary file...
                    // Storage::delete(path....);

                    // update log...
                    Helper::insertLog("Menghapus data $this->title");

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
                code: mainLogic,
                language: 'php'
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
        this.fetchHistory()
    }

    handleImportProjectTemplate(type, e) {
        console.log(e)
    }

    async fetchHistory() {
        const database = getFirestore(firebaseConf)
        return await getDocs(query(collection(database, "histories"), where("userId", "==", JSON.parse(localStorage.getItem('credentials')).userId)))
            .then((snapshot) => {
                let snapshotHistories = []
                snapshot.docs.map(data => {
                    snapshotHistories.push(data.data())
                })

                let newHistories = {
                    isLoading: false,
                    data: snapshotHistories
                }

                console.log(newHistories)

                this.setState({ histories: newHistories })
            })
    }

    async sendDatAnalytic() {
        try {
            const database = getFirestore(firebaseConf)
            const addHistory = await addDoc(collection(database, "histories"), {
                templateVersion: this.state.projectCanvas.templateVersion,
                titleProject: this.state.projectCanvas.titleProject,
                platform: this.state.projectCanvas.platform,
                crudType: this.state.projectCanvas.crudType,
                createProjectFrom: this.state.projectCanvas.createProjectFrom,
                payload: JSON.stringify(this.state.projectCanvas),
                userId: JSON.parse(localStorage.getItem('credentials')).userId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            // console.log("Document written with ID: ", addHistory.id)

            await getDocs(query(collection(database, "histories_per_platform"), where(documentId(), "==", this.state.projectCanvas.platform)))
                .then((snapshot) => {
                    if (snapshot.docs.length >= 1) {
                        let data = snapshot.docs[0].data()
                        data.historiesDocId.push(addHistory.id)

                        updateDoc(doc(database, "histories_per_platform", this.state.projectCanvas.platform), {
                            count: data.count + 1,
                            historiesDocId: data.historiesDocId
                        })
                    }
                })

            // const addHistoryPerPlatform = await updateDoc(doc(database, "histories_per_platform", this.state.projectCanvas.platform), { 
            //     count: Subject 
            // })

            // const addHistoryPerPlatform = await addDoc(collection(database, "histories_per_platform"), {
            //     templateVersion: this.state.projectCanvas.templateVersion,
            //     titleProject: this.state.projectCanvas.titleProject,
            //     platform: this.state.projectCanvas.platform,
            //     crudType: this.state.projectCanvas.crudType,
            //     createProjectFrom: this.state.projectCanvas.createProjectFrom,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // })
            // console.log("Document written with ID: ", addHistoryPerPlatform.id)


        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    handleStartCanvas(isPreview, sourcePreview) {
        if (isPreview) {
            try {
                let sourceTemplate = JSON.parse(sourcePreview)

                this.setState({ projectCanvas: sourceTemplate }, () => {
                    this.generatePureHtmlFromState()
                    this.generateLogicFromState()
                })
            } catch (error) {
                alert('Validating JSON failed: ' + error.message)
            }
        } else {
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
                                this.sendDatAnalytic()
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
                                this.sendDatAnalytic()
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


    }

    handleEndCanvas() {
        const confirmEnd = window.confirm('Are you sure to delete this canvas?')

        if (confirmEnd) {
            this.resetCanvas()
            this.fetchHistory()
            alert('Canvas has been deleted!')
        }

        return
    }

    resetCanvas() {
        this.setState({
            errorMessage: null,
            isLoadingGeneratedResults: false,
            loadingGeneratedResults: this.fragmentMakeMeAwesome(),
            results: [],
            projectCanvas: {
                createProjectFrom: null
            },
            blueprintFormHtmlString: ""
        })

        document.getElementById('form-create_project').reset()
    }

    // copy button
    copyCode = (code) => {
        const copy = () => {
            const textField = document.createElement('textarea');
            textField.innerText = code;
            document.body.appendChild(textField);
            textField.select();
            document.execCommand('copy');
            textField.remove();

            // Alert the copied text
            alert("Success copy code");
        }

        return <div>
            <button className="btn btn-sm btn-primary px-2 py-1" onClick={e => copy()}><i class="bi bi-copy me-1"></i> Copy</button>
        </div>
    }

    // final results
    renderFinalResults() {
        return this.state.results.map(piece => {
            return <div className="form-group mb-3">
                <label htmlFor="">{piece.fileName}</label>
                <SyntaxHighlighter language={piece.language} style={solarizedlight} showLineNumbers>
                    {piece.code}
                </SyntaxHighlighter>
                {this.copyCode(piece.code)}
            </div>
            // return <div className="form-group mb-3">
            //     <label htmlFor="">{piece.fileName}</label>
            //     <textarea className="form-control" rows={10} cols={30}>{piece.code}</textarea>
            //     <button className="btn btn-sm btn-primary mt-2">Download file</button>
            // </div>
        })
    }

    // small func
    generateFilename(platform, typePattern) { // typePattern like controlller, view, model, service, etc....
        if (platform === 'php-laravel8_9') {
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

    renderHistoriesRow() {

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
                                        Project
                                    </div>
                                    <h2 className="page-title">
                                        Canvas
                                    </h2>
                                </div>

                                <div className="col-auto ms-auto d-print-none">
                                    <div className="btn-list">
                                        <a href="#" className={`btn btn-primary d-none d-sm-inline-block ${this.state.results.length >= 1 ? 'disabled' : ''}`} data-bs-toggle="modal"
                                            data-bs-target="#modal-create-project">
                                            {this.state.results.length >= 1 ? 'End canvas to create new project' : <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                                                    viewBox="0 0 24 24" strokeWidth={"2"} stroke="currentColor" fill="none"
                                                    strokeLinecap={"round"} strokeLinejoin={"round"}>
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M12 5l0 14" />
                                                    <path d="M5 12l14 0" />
                                                </svg> Create project
                                            </>
                                            }
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

                                {this.state.histories.data.length == 0 ? (
                                    <div className="text-center" style={{ marginTop: "100px" }}>
                                        <svg className="mb-3" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="200px" height="200px" viewBox="0 0 647.63626 632.17383" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2" /><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56" /><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill={Constant.accentColor} /><circle cx="190.15351" cy="24.95465" r={20} fill={Constant.accentColor} /><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" /><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6" /><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56" /><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill={Constant.accentColor} /><circle cx="433.63626" cy="105.17383" r={20} fill={Constant.accentColor} /><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff" /></svg>
                                        <h4 className="text-muted">Not found history</h4>
                                    </div>
                                ) : null}



                                {this.state.results.length == 0 && this.state.histories.data.length >= 1 ? (
                                    <div>
                                        <table class="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Title project</th>
                                                    <th scope="col">Template version</th>
                                                    <th scope="col">Platform</th>
                                                    <th scope="col">Crud type</th>
                                                    <th scope="col">Created at</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.histories.data.map((data, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">{index + 1}</td>
                                                        <td>{data.titleProject}</td>
                                                        <td>{data.templateVersion}</td>
                                                        <td>{data.platform}</td>
                                                        <td>{data.crudType}</td>
                                                        <td>{data.createdAt.seconds}</td>
                                                        <td><button className="btn btn-dark" onClick={e => this.handleStartCanvas(true, data.payload)}>Preview</button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : ''}

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
                                            Generated code isn't pretty, please prettier your code manually
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
                                <form id="form-create_project">
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
                                        <a href="#" className="btn btn-primary ms-auto" id="btn-create-fragment" onClick={e => this.handleStartCanvas()}>{this.state.loadingGeneratedResults}</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.results.length >= 1 ? (<div class="position-relative">
                    <div class="position-absolute bottom-0 end-0 me-4 mb-4">
                        <button className="btn btn-lg btn-secondary rounded-pill" onClick={e => this.handleEndCanvas()}><i class="bi bi-x-lg me-2"></i> End this session</button>
                    </div>
                </div>) : null}


            </PanelLayout>
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

