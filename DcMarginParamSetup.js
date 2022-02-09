import React, { Component } from 'react';
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label, Input, InputGroupAddon, InputGroup } from 'reactstrap';
import { get, post } from '../../util/apiClient';
import ErrorSpan from "../CommonFun/errorSpan";
import LoadingScreen from '../../loader/LoadingScreen';
import Alert from '../CommonFun/alert';
import { CheckBox } from 'devextreme-react';
import DevCombo from "../Common/DevExpressCombo";
import { deburr } from 'lodash';
import { tsMethodSignature } from '@babel/types';

import { tsMethodSignature } from '@babel/types';
import { tsMethodSignature } from '@babel/types';
import { tsMethodSignature } from '@babel/types';


export default class DcMarginParamSetup extends Component {

    state = {
        supplierKey: 0,
        supplierList: [],
        SelectedSupplierCode: '',
        supplierError: false,
        actionList: ['Frontend', 'Backend'],
        selectedAction: '',
        actionError: false,
        actionErrorF: false,
        actionErrorSup: false,
        actionErrorName: "",
        actionErrorNameF: "",
        actionErrorNameSup: "",
        FrontEndCB: false,
        BackEndCB: false,
        FrontEndValue: '',
        BackendValue: '',
        messageBox: {
            show: false,
            messageDescription: "",
            className: "",
            yesNo: false,
            callbackFn: ""
        }
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        debugger;
        this.GetDcMarginSuppliers();
    }

    GetDcMarginSuppliers() {
        this.setState({ isLoadScreen: true })
        get("/BackendMargin/GetDcMarginSuppliers").then(response => {
            debugger;
            if(response.data.result !== null) {
                this.setState({
                    supplierList: response.data.result,
                    supplierKey: this.state.supplierKey + 1,
                    isLoadScreen: false,
                });
            } else {
                this.setState({
                    isLoadScreen: false,
                    messageBox: {
                        show: true,
                        title: "Error",
                        className: "error",
                        messageDescription: 'DCW1 Supplier initial data loading fail',
                        callbackFn: this.handleMsgCallback
                    }
                })
            }
        });
    }

    handleMsgCallback = dataVal => {
        this.setState({
            messageBox: {
                show: false,
                messageDescription: "",
                className: "",
                yesNo: false,
                callbackFn: "",
            },
        })
    };

    handleNew() {
        this.ClearData();
    }

    handleSaveData() {
        this.SaveData();
    }

    ClearData() {
        this.setState({
            supplierKey: 0,
            supplierList: [],
            SelectedSupplierCode: '',
            supplierError: false,
            selectedAction: '',
            actionError: false,
            actionErrorF: false,
            actionErrorSup: false,
            actionErrorName: "",
            actionErrorNameF: "",
            actionErrorNameSup: "",
            FrontEndCB: false,
            BackEndCB: false,
            FrontEndValue: '',
            BackendValue: '',
            messageBox: {
                show: false,
                messageDescription: "",
                className: "",
                yesNo: false,
                callbackFn: ""
            }
        })
        this.GetDcMarginSuppliers();
    }

    SaveData() {
        this.setState({ isLoadScreen: true })
        if(this.ValidateFieldData()){
            debugger;
            let formData = { 
                SupplierCode: this.state.SelectedSupplierCode,
                IsFrontEnd: this.state.FrontEndCB,
                IsBackend: this.state.BackEndCB,
                FrontendValue: this.state.FrontEndCB == false ? 0 : this.state.FrontEndValue,
                BackendValue: this.state.BackEndCB == false ? 0 : this.state.BackendValue
            }

            post('/BackendMargin/SaveDcMargin', formData).then(response => {
                debugger;
                if (response.data.errorList[0]["errorType"] == 4) {
                    this.ClearData();
                    this.setState({
                        isLoadScreen: false,
                        messageBox: {
                            show: true,
                            title: "Success",
                            className: "success",
                            messageDescription: 'Data saved successfully.',
                            callbackFn: this.handleMsgCallback
                        }
                    })
                }
                else { 
                    this.ClearData();
                    this.setState({
                        isLoadScreen: false,
                        messageBox: {
                            show: true,
                            title: "Error",
                            className: "error",
                            messageDescription: 'Error saving data.',
                            callbackFn: this.handleMsgCallback
                        }
                    })
                }
            })
        }else{
            this.setState({ isLoadScreen: false })
        }
    }

    ValidateFieldData() {
        const re = /^[1-9]\d*(\.\d+)?$/;
        let isValidate = true;
        if(this.state.SelectedSupplierCode != "" && this.state.SelectedSupplierCode != undefined) {
            if(this.state.FrontEndCB == true || this.state.BackEndCB == true){
                if(this.state.FrontEndCB == true){
                    if(this.state.FrontEndValue == "" || this.state.FrontEndValue == undefined || this.state.FrontEndValue == 0){
                        isValidate = false;
                        this.setState({ actionError: true });
                        this.setState({ actionErrorName: "Please add frontend value or uncheck frontend tickbox" });
                        
                    }else{
                        if(!re.test(this.state.FrontEndValue)) {
                            isValidate = false;
                            this.setState({ actionError: true });
                            this.setState({ actionErrorName: "Please enter numeric value for frontend" });
                        }

                    }
                }
                if(this.state.BackEndCB == true){
                    if(this.state.BackendValue == "" || this.state.BackendValue == undefined || this.state.BackendValue == 0) {
                        isValidate = false;
                        this.setState({ actionError: true });
                        this.setState({ actionErrorName: "Please add backend value or uncheck backend tickbox" });
                    }else{
                        if(!re.test(this.state.BackendValue)) {
                            isValidate = false;
                            this.setState({ actionError: true });
                            this.setState({ actionErrorName: "Please enter numeric value for backend" });
                        }
                    }
                }
            }else{
                isValidate = false;
                this.setState({ actionErrorF: true });
                this.setState({ actionErrorNameF: "Please select at least one option from frontend or backend" });
            }
        }else{
            isValidate = false;   
            this.setState({ actionErrorSup: true });
            this.setState({ actionErrorNameSup: "Please select a supplier from the dropdown" }); 
        }

        return isValidate;
    }

    handleInputChange(field, e) {
        this.setState({ actionError: false });
        this.setState({ actionErrorName: "" });
        this.setState({
            [field]: e.target.value
        })
    };

    SetStateValuesDcmarginSupplier(type, value, description) {
        debugger;
        if (value !== undefined) {
            this.setState( { isLoadScreen: true } )
            get("/BackendMargin/GetDcMarginConf?SupplierCode=" + value).then(response => {
                if(response.data.result != null) {
                    debugger;
                    console.log(response.data.result);
                    this.setState({ 
                        FrontEndCB: response.data.result.isFrontEnd, 
                        BackEndCB: response.data.result.isBackend, 
                        FrontEndValue: response.data.result.frontendValue, 
                        BackendValue: response.data.result.backendValue, 
                    });
                }
            });

            this.setState({ actionErrorSup: false });
            this.setState({ actionErrorNameSup: "" }); 

            if (!isNaN(value[0]) && value[0] !== undefined && value.length > 0) {
                let formData = [];
                this.state.SelectedSupplierCode = value[0];
            }
            else {
                this.state.SelectedSupplierCode = '';
            }
        }
        else { this.state.SelectedSupplierCode = ''; }
    }
 
    render() {
        const hiddenFront = this.state.FrontEndCB ? "" : "hidden";
        const hiddenBack = this.state.BackEndCB ? "" : "hidden";

        return (
            <Row>
                <Alert messageObj={this.state.messageBox} />
                <LoadingScreen IsVisible={this.state.isLoadScreen} />

                <Col md="12" sm="12" xs="12">
                    <Card>
                        <CardHeader>
        
                        </CardHeader>
                        <CardBody id="DcMargin-ParameterSetup">
                            <FormGroup row>
                                <Col md="1" sm="12" xs="12">
                                    <Label size="sm">Supplier Code</Label>
                                </Col>
                                <Col md="3" sm="12" xs="12">
                                    <DevCombo
                                        key={this.state.supplierKey}
                                        SetStateValues={this.SetStateValuesDcmarginSupplier.bind(this)}
                                        Values={this.state.SelectedSupplierCode}
                                        DataSource={this.state.supplierList.map((item) => {
                                            return { Value: item.supplierCode, Display: item.supplierCode + '    |    ' + item.supplierDescription }
                                        })}
                                        Title={"Supplier or Suppliers"}
                                        onClosed={this.onClosed}
                                        RemoveAllValues={() => { this.setState({ SelectedSupplierCode: ''}) }}
                                    />
                                    <Row>
                                        <Col md="12" sm="12" xs="12">
                                            <ErrorSpan IsVisible={this.state.actionErrorSup} ErrorName={this.state.actionErrorNameSup} />
                                        </Col>
                                    </Row>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="1" sm="12" xs="12">
                                    <Label size="sm">Frontend</Label>
                                </Col>
                                <CheckBox
                                    name='frondEndCB'
                                    value={this.state.FrontEndCB}
                                    checked={this.state.FrontEndCB}
                                    onValueChanged={(e) => {
                                        this.setState({ actionErrorF: false });
                                        this.setState({ actionErrorNameF: "" });
                                        this.setState({
                                            FrontEndCB: e.value
                                        });
                                    }}
                                />
                                <Col md="4" sm="4" xs="10">
                                    <InputGroup>
                                        <Input type="text" name="frontEndValue" id="frontEndValue" autoComplete="off" 
                                        onChange={this.handleInputChange.bind(this, 'FrontEndValue')}
                                        value={this.state.FrontEndValue} hidden={ hiddenFront } maxLength="10"/>
                                    </InputGroup>
                                </Col>
                                <Col md="1" sm="12" xs="12">
                                    <Label size="sm">Backend</Label>
                                </Col>
                                <CheckBox
                                    name='backEndCB'
                                    value={this.state.BackEndCB}
                                    checked={this.state.BackEndCB}
                                    onValueChanged={(e) => {
                                        this.setState({ actionErrorF: false });
                                        this.setState({ actionErrorNameF: "" });
                                        this.setState({
                                            BackEndCB: e.value
                                        });
                                    }}
                                />
                                <Col md="4" sm="4" xs="10">
                                    <InputGroup>
                                        <Input type="text" name="backendValue" id="backendValue" autoComplete="off"
                                        onChange={this.handleInputChange.bind(this, 'BackendValue')}
                                        value={this.state.BackendValue} hidden={ hiddenBack } maxLength="10" />
                                    </InputGroup>
                                </Col>
                                <Row>
                                    <Col md="12" sm="12" xs="12">
                                    <ErrorSpan IsVisible={this.state.actionError} ErrorName={this.state.actionErrorName} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" sm="12" xs="12">
                                    <ErrorSpan IsVisible={this.state.actionErrorF} ErrorName={this.state.actionErrorNameF} />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col md={9}>
                                        &nbsp;
                                    </Col>
                                    <Col md={3}>
                                        <Button color="danger" type='button' style={{ "width" : "48%" , "marginRight" : "2%"}} onClick={this.handleNew.bind(this)}>Clear</Button>
                                        <Button color="success" type='button' style={{ "width" : "48%"}} onClick={this.handleSaveData.bind(this)}>Save</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            
        )
    }
}

