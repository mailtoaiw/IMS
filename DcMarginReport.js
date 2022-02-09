import React, {Component} from 'react';
import DataGrid, {Pager, Paging, Column, SearchPanel, ColumnFixing, HeaderFilter, Export} from "devextreme-react/data-grid";
import {FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label} from 'reactstrap';
import Collapsible from '../CommonFun/Collapsible';
import LoadingScreen from '../../loader/LoadingScreen';
import Alert from '../CommonFun/alert';
import DevCombo from "../Common/DevExpressCombo";
import {RadioGroup} from 'devextreme-react';
import {get, getHeadersForBlob, post} from '../../util/apiClient';
import axios from "axios";
import * as GlobalVariable from "../../util/global_variables";
import ErrorSpan from "../CommonFun/errorSpan";
import DatePicker from "react-datepicker";
import { CheckBox } from 'devextreme-react';


import ErrorSpan from "../CommonFun/errorSpan";
import DatePicker from "react-datepicker";
import { CheckBox } from 'devextreme-react';

class DcMarginReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoadingScreen: false,
      messageBox: {
        show: false,
        className: "",
        messageDescription: "",
        yesNo: false,
        callbackFn: ''
      },
      ReportType: 'CE',
      ReportTypeList: [
        {
          text: 'Capture Exceptions',
          value: 'CE'
        },
        {
          text: 'Don\'t Capture Exceptions',
          value: 'DCE'
        }
      ],
      FrontEndCB: false,
      BackEndCB: false,
      DateFrom: new Date(new Date().getFullYear(), new Date().getMonth()-1, 26),
      DateTo: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
      SelectedSupplierCodes: [],

      DateFromError: null,
      DateToError: null,
      SupplierError: null,
      CheckboxesError: null,

      supplierKey: 0,

      supplierList: [],
      DataGridDataSource: []
    }
  }

  criteriaChangeHandler(e) {
    this.setState({
      DataGridDataSource: [],
      DateFromError: null,
      DateToError: null,
      SupplierError: null,
      CheckboxesError: null,
      [e.element.id]: e.value
    })
  }

  setStateValues(type, value) {
    debugger;
    this.setState({
      DataGridDataSource: [],
      DateFromError: null,
      DateToError: null,
      SupplierError: null,
      CheckboxesError: null,
      [type]: value
    })
  }

  removeAllValues(type) {
    this.setState({
      DataGridDataSource: [],
      [type]: []
    })
  }

  fetchSupplierList() {
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

  // Validation
  isCriteriaValid() {
    let isValid = true

    if (this.state.DateFrom === '' || this.state.DateFrom === null) {
      isValid = false
      this.setState({DateFromError: 'Date From field is required.'})
    }

    if (this.state.DateTo === '' || this.state.DateTo === null) {
      isValid = false
      this.setState({DateToError: 'Date To field is required.'})
    }

    if (this.state.SelectedSupplierCodes.length === 0) {
      isValid = false
      this.setState({SupplierError: 'Supplier(s) field is required.'})
    }

    if (this.state.FrontEndCB==false && this.state.BackEndCB==false) {
      isValid = false
      this.setState({CheckboxesError: 'Atleast one option need be selected from backend or frontend.'})
    }

    return isValid
  }

  showBtnOnClickHandler() {
    if (this.isCriteriaValid()) {
      this.setState({isLoadingScreen: true})
      debugger;
      const filters = {
        ReportType: this.state.ReportType,
        Frontend: this.state.FrontEndCB,
        Backend: this.state.BackEndCB,
        SupplierCode: this.state.SelectedSupplierCodes,
        DateFrom: this.state.DateFrom,
        DateTo: this.state.DateTo,
      }

      post('/BackendMargin/GetDcMarginDetails', filters)
        .then(resp => {
          if (resp.data.result !== null) {
            this.setState({
              DataGridDataSource: resp.data.result
            })
          } else {
            this.setState({
              messageBox: {
                show: true,
                title: 'Error',
                className: 'danger',
                messageDescription: resp.data['errorList'][0]['statusMessage'],
                callbackFn: () => this.setState({
                  messageBox: {
                    show: false
                  }
                })
              }
            })
          }
        })
        .finally(() => this.setState({isLoadingScreen: false}))
    }
  }

  clearBtnOnClickHandler() {
    this.setState({
      isLoadingScreen: false,
      messageBox: {
        show: false,
        className: "",
        messageDescription: "",
        yesNo: false,
        callbackFn: ''
      },
      ReportType: 'CE',
      ReportTypeList: [
        {
          text: 'Capture Exceptions',
          value: 'CE'
        },
        {
          text: 'Don\'t Capture Exceptions',
          value: 'DCE'
        }
      ],
      FrontEndCB: false,
      BackEndCB: false,
      DateFrom: new Date(new Date().getFullYear(), new Date().getMonth()-1, 26),
      DateTo: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
      SelectedSupplierCodes: [],

      DateFromError: null,
      DateToError: null,
      SupplierError: null,
      CheckboxesError: null,

      supplierKey: 0,

      supplierList: [],
      DataGridDataSource: []
    })
    this.fetchSupplierList();
  }

  componentDidMount() {
    this.fetchSupplierList()
  }

  onRowPrepared(e) {
    if (e.rowType === 'data' && e.data['hasTimeDiff']) {
      e.rowElement.className += " row-has_time_diff"
    }
  }

  SetStateValuesDcmarginSupplier(type, value, description) {
    debugger;
    if (value !== undefined) {
      this.setState({SupplierError: ''})
      if (!isNaN(value[0])) {
          this.state.SelectedSupplierCodes = value;
      }
    }
  }

  render() {
    return (
      <Row>
        <Col md="12" sm="12" xs="12">
          <Row>
            <Card style={{width: '100%'}}>
              <CardHeader>
                <i className="fa fa-cube"/> Criteria
                <Collapsible id="refund-report-criteria"/>
              </CardHeader>
              <CardBody id="refund-report-criteria">
                <FormGroup row>
                  <Col md="12" sm="12" xs="12">
                    <Row className="dx-field">
                      <Col className="dx-field-value">
                        <RadioGroup
                          id="ReportType"
                          width="100%"
                          items={this.state.ReportTypeList}
                          defaultValue={this.state.ReportType}
                          layout="horizontal"
                          displayExpr="text"
                          valueExpr="value"
                          onValueChanged={this.criteriaChangeHandler.bind(this)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="12" sm="12" xs="12">
                    <Row className="dx-field">
                      <Col className="dx-field-value">
                        <CheckBox
                            style={{"float": "left", "margin-right": "2%"}}
                            name='frondEndCB'
                            value={this.state.FrontEndCB}
                            checked={this.state.FrontEndCB}
                            onValueChanged={(e) => {
                                this.setState({
                                    FrontEndCB: e.value,
                                    CheckboxesError: null
                                });
                            }}
                            text="Frontend"
                        />
                        <CheckBox
                            style={{"float": "left"}}
                            name='backEndCB'
                            value={this.state.BackEndCB}
                            checked={this.state.BackEndCB}
                            onValueChanged={(e) => {
                                this.setState({
                                    BackEndCB: e.value,
                                    CheckboxesError: null
                                });
                            }}
                            text="Backend"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                          <ErrorSpan IsVisible={this.state.CheckboxesError} ErrorName={this.state.CheckboxesError}/>
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>

                <FormGroup row className="ml-1 mt-3">
                  <Col md="12" sm="12" xs="12">
                    <Row>
                      <Col className="dx-field">
                        <label className="dx-field-label" style={{fontSize: '12px'}}>Date From</label>
                        <div className="dx-field-value">
                          <DatePicker
                            id="DateFrom"
                            className="form-control"
                            selected={this.state.DateFrom}
                            onChange={v => this.setState({
                              DataGridDataSource: [],
                              DateFromError: null,
                              DateFrom: v
                            })}/>

                          <ErrorSpan IsVisible={this.state.DateFromError} ErrorName={this.state.DateFromError}/>
                        </div>
                      </Col>

                      <Col className="dx-field">
                        <label className="dx-field-label" style={{fontSize: '12px'}}>Date To</label>
                        <div className="dx-field-value">
                          <DatePicker
                            id="DateTo"
                            className="form-control"
                            selected={this.state.DateTo}
                            onChange={v => this.setState({
                              DataGridDataSource: [],
                              DateToError: null,
                              DateTo: v
                            })}/>

                          <ErrorSpan IsVisible={this.state.DateToError} ErrorName={this.state.DateToError}/>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6" sm="none" xs="none" className="dx-field">
                        <label className="dx-field-label" style={{fontSize: '12px'}}>
                          Supplier(s)
                        </label>
                        <div className="dx-field-value">
                          <DevCombo
                            key={this.state.supplierKey}
                            SetStateValues={this.SetStateValuesDcmarginSupplier.bind(this)}
                            Values={this.state.SelectedSupplierCodes}
                            DataSource={this.state.supplierList.map((item) => {
                                return { Value: item.supplierCode, Display: item.supplierCode + '    |    ' + item.supplierDescription }
                            })}
                            Type="SelectedSupplierCodes"
                            IsMultiple={true}
                            Title="DC Supplier(s)"
                            RemoveAllValues={this.removeAllValues.bind(this)}
                          />

                          <ErrorSpan IsVisible={this.state.SupplierError} ErrorName={this.state.SupplierError}/>
                        </div>
                      </Col>

                      <Col md="2" sm="none" xs="none"/>

                      <Col>
                        <Button
                          block
                          className="btn-search"
                          onClick={this.showBtnOnClickHandler.bind(this)}>
                          <i className="fa fa-search mr-2"/>
                          Show
                        </Button>
                      </Col>

                      <Col>
                        <Button
                          block
                          className="btn-clear-alt"
                          onClick={this.clearBtnOnClickHandler.bind(this)}>
                          <i className="fa fa-clear mr-2"/>
                          Clear
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Row>

          <Row>
            <Card style={{width: '100%'}}>
              <CardHeader>
                <i className="fa fa-bar-chart"/> Report
                <Collapsible id="refund-report-table"/>
              </CardHeader>
              <CardBody id="refund-report-table">
                <Row>
                  <Col md="12" xs="12">
                    <DataGrid
                      id="gridOrderManagement"
                      showBorders
                      showRowLines
                      showColumnLines
                      columnAutoWidth
                      hoverStateEnabled
                      allowColumnResizing
                      repaintChangesOnly
                      dataSource={this.state.DataGridDataSource}
                      onRowPrepared={this.onRowPrepared}>
                      <Paging defaultPageSize={10}/>
                      <HeaderFilter visible/>
                      <SearchPanel placeholder="Search..." visible/>
                      <ColumnFixing enabled/>
                      <Pager
                        visible
                        showInfo
                        showNavigationButtons
                        showPageSizeSelector
                        allowedPageSizes="auto"/>
                      <Export enabled={true} fileName={'DC Margin Report'} />
                      <Column dataField="supplierCode" caption="Vendor Code" defaultVisible={true}/>

                      {/* Item Refund Details Columns */}
                      <Column dataField="vendorName" caption="Vendor Name"/>
                      <Column dataField="totalGrnValue" caption="Total GRN value"/>
                      <Column dataField="totalSales" caption="Total Sales"/>
                      <Column dataField="agreedDcMargin" caption="Agreed DC Margin"/>
                      <Column dataField="frontOrBack" caption="Front / Back"/>
                      <Column dataField="acquiredDcMarginValue" caption="Acquired DC Margin Value"/>
                      <Column dataField="exceptionRemarks" caption="Exception Remarks"/>
                      <Column dataField="addedDateDcMargin" caption="Added Date For DC Margin"/>
                      <Column dataField="dcMarginChnagedDate" caption="DC Margin Changed Date"/>
                    </DataGrid>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Row>
        </Col>

        <Alert messageObj={this.state.messageBox}/>
        <LoadingScreen isVisible={this.state.isLoadingScreen}/>
      </Row>
    );
  }
}

export default DcMarginReport;
