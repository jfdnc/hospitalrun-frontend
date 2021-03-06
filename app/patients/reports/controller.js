import { isArray } from '@ember/array';
import { Promise as EmberPromise, hash } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { computed, get } from '@ember/object';
import { map, alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import moment from 'moment';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import SelectValues from 'hospitalrun/utils/select-values';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractReportController.extend(PatientDiagnosis, PatientVisits, VisitTypes, {
  patientsController: controller('patients'),

  clinicList: map('patientsController.clinicList.value', SelectValues.selectValuesMap),
  diagnosisList: alias('patientsController.diagnosisList'),
  physicianList: map('patientsController.physicianList.value', SelectValues.selectValuesMap),
  locationList: map('patientsController.locationList.value', SelectValues.selectValuesMap),
  statusList: map('patientsController.statusList.value', SelectValues.selectValuesMap),
  visitTypesList: alias('patientsController.visitTypesList'),
  reportType: 'detailedAdmissions',
  patientDetails: {},

  admissionReportColumns: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      sex: {
        label: intl.t('labels.sex'),
        include: true,
        property: 'sex'
      },
      total: {
        label: intl.t('labels.total'),
        include: true,
        property: 'total',
        format: '_numberFormat'
      }
    };
  }),
  admissionDetailReportColumns: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      id: {
        label: intl.t('labels.id'),
        include: true,
        property: 'patientId'
      },
      name: {
        label: intl.t('labels.name'),
        include: true,
        property: 'patientName'
      },
      admissionDate: {
        label: intl.t('patients.labels.admissionDate'),
        include: true,
        property: 'admissionDate',
        format: '_dateTimeFormat'
      },
      dischargeDate: {
        label: intl.t('patients.labels.dischargeDate'),
        include: false,
        property: 'dischargeDate',
        format: '_dateTimeFormat'
      },
      patientDays: {
        label: intl.t('patients.labels.patientDays'),
        include: false,
        property: 'patientDays',
        format: '_numberFormat'
      }
    };
  }),
  diagnosticReportColumns: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      type: {
        label: intl.t('labels.type'),
        include: true,
        property: 'type'
      },
      total: {
        label: intl.t('labels.total'),
        include: true,
        property: 'total',
        format: '_numberFormat'
      }
    };
  }),
  procedureDetailReportColumns: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      id: {
        label: intl.t('labels.id'),
        include: true,
        property: 'patient.displayPatientId'
      },
      name: {
        label: intl.t('labels.name'),
        include: true,
        property: 'patient.displayName'
      },
      procedure: {
        label: intl.t('visits.labels.procedure'),
        include: true,
        property: 'procedure'
      },
      procedureDate: {
        label: intl.t('visits.labels.procedureDate'),
        include: true,
        property: 'procedureDate',
        format: '_dateTimeFormat'
      }
    };
  }),
  reportColumns: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      visitDate: {
        label: intl.t('visits.labels.visitDate'),
        include: true,
        property: 'visitDate'
      },
      visitType: {
        label: intl.t('visits.labels.visitType'),
        include: true,
        property: 'visitType'
      },
      visitLocation: {
        label: intl.t('labels.location'),
        include: false,
        property: 'location'
      },
      examiner: {
        label: intl.t('visits.labels.examiner'),
        include: true,
        property: 'examiner'
      },
      name: {
        label: intl.t('labels.name'),
        include: true,
        property: 'patient.displayName'
      },
      id: {
        label: intl.t('labels.id'),
        include: true,
        property: 'patient.displayPatientId'
      },
      sex: {
        label: intl.t('patients.labels.sex'),
        include: true,
        property: 'patient.sex'
      },
      dateOfBirth: {
        label: intl.t('patients.labels.dateOfBirth'),
        include: true,
        property: 'patient.dateOfBirth',
        format: '_dateFormat'
      },
      age: {
        label: intl.t('labels.age'),
        include: false,
        property: 'patient.age'
      },
      primaryDiagnosis: {
        label: intl.t('patients.labels.primaryDiagnosis'),
        include: false,
        property: 'primaryDiagnosis'
      },
      secondaryDiagnoses: {
        label: intl.t('patients.labels.secondaryDiagnosis'),
        include: false,
        property: 'additionalDiagnoses',
        format: '_diagnosisListToString'
      },
      procedures: {
        label: intl.t('labels.procedures'),
        include: false,
        property: 'resolvedProcedures',
        format: '_procedureListToString'
      },
      contacts: {
        label: intl.t('patients.labels.contacts'),
        include: false,
        property: 'patient',
        format: '_contactListToString'
      },
      referredBy: {
        label: intl.t('patients.labels.referredBy'),
        include: false,
        property: 'patient.referredBy'
      },
      referredDate: {
        label: intl.t('patients.labels.referredDate'),
        include: false,
        property: 'patient.referredDate',
        format: '_dateFormat'
      }
    };
  }),
  statusReportColumns: computed('intl.locale', function() {
    let intl = this.get('intl');
    return {
      id: {
        label: intl.t('labels.id'),
        include: true,
        property: 'patient.displayPatientId'
      },
      name: {
        label: intl.t('labels.name'),
        include: true,
        property: 'patient.displayName'
      },
      status: {
        label: intl.t('labels.status'),
        include: true,
        property: 'patient.status'
      },
      primaryDiagnosis: {
        label: intl.t('patients.labels.primaryDiagnosis'),
        include: true,
        property: 'patient',
        format: '_formatPrimaryDiagnosis'
      },
      secondaryDiagnoses: {
        label: intl.t('patients.labels.secondaryDiagnosis'),
        include: true,
        property: 'patient',
        format: '_formatSecondaryDiagnosis'
      }
    };
  }),
  reportTypes: computed('intl.locale', function() {
    let intl = this.get('intl');
    return [{
      name: intl.t('patients.titles.admissionsDetail'),
      value: 'detailedAdmissions'
    }, {
      name: intl.t('patients.titles.admissionsSummary'),
      value: 'admissions'
    }, {
      name: intl.t('patients.titles.diagnosticTesting'),
      value: 'diagnostic'
    }, {
      name: intl.t('patients.titles.dischargesDetail'),
      value: 'detailedDischarges'
    }, {
      name: intl.t('patients.titles.dischargesSummary'),
      value: 'discharges'
    }, {
      name: intl.t('patients.titles.proceduresDetail'),
      value: 'detailedProcedures'
    }, {
      name: intl.t('patients.titles.proceduresSummary'),
      value: 'procedures'
    }, {
      name: intl.t('patients.titles.patientStatus'),
      value: 'status'
    }, {
      name: intl.t('patients.titles.totalPatientDays'),
      value: 'patientDays'
    }, {
      name: intl.t('patients.titles.totalPatientDaysDetailed'),
      value: 'detailedPatientDays'
    }, {
      name: intl.t('patients.titles.visit'),
      value: 'visit'
    }];
  }),

  isDischargeReport: computed('reportType', function() {
    let reportType = this.get('reportType');
    return (reportType.toLowerCase().indexOf('discharges') > -1);
  }),

  isStatusReport: computed('reportType', function() {
    let reportType = this.get('reportType');
    if (reportType === 'status') {
      this.set('startDate', null);
      this.set('endDate', null);
      return true;
    }

    return false;
  }),

  isVisitReport: computed('reportType', function() {
    let reportType = this.get('reportType');
    return (reportType === 'visit');
  }),

  _addContactToList(phone, email, prefix, contactList) {
    let contactArray = [];
    if (!isEmpty(email) || !isEmpty(phone)) {
      if (!isEmpty(phone)) {
        contactArray.push(phone);
      }
      if (!isEmpty(email)) {
        contactArray.push(email);
      }
      contactList.push(prefix + contactArray.join(', '));
    }
  },

  _addReportRow(row, skipFormatting, reportColumns, rowAction) {
    if (isEmpty(rowAction) && !isEmpty(row.patient)) {
      let patientId = null;
      if (row.get) {
        patientId = row.get('patient.id');
      } else {
        patientId = row.patient.get('id');
      }
      if (!isEmpty(patientId)) {
        rowAction = {
          action: 'viewPatient',
          model: patientId
        };
      }
    }
    this._super(row, skipFormatting, reportColumns, rowAction);
  },

  /**
   * Given a list of records, organize and total by them by type and then add them to the report.
   * @param records {Array} list of records to total.
   * @param typeField {String} the field in the records containing the type.
   * @param totalLabel {String} the label for the grand total.
   * @param reportColumns
   */
  _addRowsByType(records, typeField, totalLabel, reportColumns) {
    let types = this._totalByType(records, typeField, totalLabel);
    types.forEach(function(type) {
      this._addReportRow(type, true, reportColumns);
    }.bind(this));
  },

  _addPatientProcedureRows(procedureTotals, reportColumns) {
    procedureTotals.forEach(function(procedureTotal) {
      if (!isEmpty(procedureTotal.records)) {
        procedureTotal.records.forEach(function(patientProcedure, index) {
          this._addReportRow({
            patient: patientProcedure.get('patient'),
            procedure: patientProcedure.get('description'),
            procedureDate: patientProcedure.get('procedureDate')
          }, false, reportColumns);
          if (index + 1 === procedureTotal.records.length) {
            this._addReportRow({
              procedure: `Total for ${procedureTotal.type}: ${procedureTotal.total}`
            }, true, reportColumns);
          }
        }.bind(this));
      } else {
        this._addReportRow({
          procedure: `Total for ${procedureTotal.type}: ${procedureTotal.total}`
        }, true, reportColumns);
      }
    }.bind(this));
  },

  _contactListToString(patient) {
    let additionalContacts = patient.get('additionalContacts');
    let contactDesc;
    let contactList = [];
    let email = patient.get('email');
    let phone = patient.get('phone');
    this._addContactToList(phone, email, 'Primary: ', contactList);
    if (!isEmpty(additionalContacts)) {
      additionalContacts.forEach(function(contact) {
        contactDesc = '';
        if (!isEmpty(contact.name) && !isEmpty(contact.relationship)) {
          if (!isEmpty(contact.name)) {
            contactDesc += contact.name;
          }
          if (!isEmpty(contact.relationship)) {
            if (!isEmpty(contactDesc)) {
              contactDesc += ' - ';
            }
            contactDesc += contact.relationship;
          }
          contactDesc += ': ';
        }
        this._addContactToList(contact.phone, contact.email, contactDesc, contactList);
      }.bind(this));
    }
    return contactList.join(';\n');
  },

  _dateTimeFormat(value) {
    return this._dateFormat(value, 'l h:mm A');
  },

  _diagnosisListToString(diagnoses) {
    return this._listToString(diagnoses, 'diagnosis', 'date');
  },
  /**
     * Find diagnostics by the specified dates and the record's start and (optional) end dates.
     */
  _findDiagnosticsByDate() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'imaging_by_status'
    };
    let maxValue = this.get('maxValue');
    return new EmberPromise(function(resolve, reject) {
      findParams.options.startkey = ['Completed', null, filterStartDate.getTime(), null];

      if (!isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = ['Completed', maxValue, filterEndDate.getTime(), maxValue];
      }
      this.store.query('imaging', findParams).then(function(imagingRecords) {
        let returnRecords = {
          imaging: imagingRecords
        };
        findParams.mapReduce = 'lab_by_status';
        this.store.query('lab', findParams).then(function(labRecords) {
          returnRecords.labs = labRecords;
          resolve(returnRecords);
        }, reject);
      }.bind(this), reject);

    }.bind(this));
  },

  /**
   * Find procedures by the specified dates and the record's start and (optional) end dates.
   */
  _findPatientsByStatus() {
    let status = this.get('status');
    let findParams = {
      options: {
        key: status
      },
      mapReduce: 'patient_by_status'
    };
    return new EmberPromise(function(resolve, reject) {
      this.store.query('patient', findParams).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Find procedures by the specified dates and the record's start and (optional) end dates.
   */
  _findProceduresByDate() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'procedure_by_date'
    };
    let maxValue = this.get('maxValue');
    return new EmberPromise(function(resolve, reject) {
      findParams.options.startkey = [filterStartDate.getTime(), null];

      if (!isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = [filterEndDate.getTime(), maxValue];
      }
      this.store.query('procedure', findParams).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Find visits by the specified dates and the record's start and (optional) end dates.
   * @param {String} reportType the type of report to find visits for.
   */
  _findVisitsByDate() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'visit_by_date'
    };
    let isDischargeReport = this.get('isDischargeReport');
    let maxValue = this.get('maxValue');
    if (isDischargeReport) {
      findParams.mapReduce = 'visit_by_discharge_date';
    }

    /**
     * Admissions - start date between start and end date
     * Discharge end date between start and end date
     */
    return new EmberPromise(function(resolve, reject) {
      let isDischargeReport = this.get('isDischargeReport');
      findParams.options.startkey = [filterStartDate.getTime(), null];
      if (!isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        if (isDischargeReport) {
          findParams.options.endkey = [filterEndDate.getTime(), maxValue];
        } else {
          findParams.options.endkey = [filterEndDate.getTime(), maxValue, maxValue];
        }
      }
      this.store.query('visit', findParams).then(resolve, reject);

    }.bind(this));
  },

  _filterByLike(records, field, likeCondition) {
    return records.filter(function(record) {
      let fieldValue = record.get('field');
      if (isEmpty(fieldValue)) {
        return false;
      } else {
        if (isArray(fieldValue)) {
          let foundValue = fieldValue.find(function(value) {
            return this._haveLikeValue(value, likeCondition);
          }.bind(this));
          return !isEmpty(foundValue);
        } else {
          return this._haveLikeValue(fieldValue, likeCondition);
        }
      }
    });
  },

  _filterInPatientVisit(visit) {
    let outPatient = visit.get('outPatient');
    let status = visit.get('status');
    return !outPatient && !isEmpty(status);
  },

  _finishVisitReport(visits) {
    let visitTypes = this._totalByType(visits, 'visitType', 'total');
    visitTypes.forEach(function(visitType) {
      if (visitType.type === 'total') {
        this._addReportRow({
          visitDate: `Total visits: ${visitType.total}`
        });
      } else {
        visitType.records.forEach(function(visit) {
          this._addReportRow(visit);
        }.bind(this));
        this._addReportRow({
          visitDate: `Total for ${visitType.type}: ${visitType.total}`
        });
      }
    }.bind(this));
    this._finishReport();
  },
  _formatPrimaryDiagnosis(patient) {
    let primaryDiagnoses = this.getDiagnoses(patient, true, false);
    return this._diagnosisListToString(primaryDiagnoses);
  },

  _formatSecondaryDiagnosis(patient) {
    let secondaryDiagnoses = this.getDiagnoses(patient, true, true);
    return this._diagnosisListToString(secondaryDiagnoses);
  },

  _generateAdmissionOrDischargeReport(visits, reportType) {
    let detailedReport = false;
    let reportColumns;
    let patientBySex = {};
    let sexNotEnteredLabel = this.get('intl').t('patients.labels.sexNotEntered');

    if (reportType.indexOf('detailed') > -1) {
      detailedReport = true;
      reportColumns = this.get('admissionDetailReportColumns');
      reportColumns.patientDays.include = false;
      if (reportType === 'detailedDischarges') {
        reportColumns.dischargeDate.include = true;
      } else {
        reportColumns.dischargeDate.include = false;
      }
    } else {
      reportColumns = this.get('admissionReportColumns');
    }
    visits = visits.filter(this._filterInPatientVisit);
    visits.forEach(function(visit) {
      if (!this.get('isDischargeReport') || !isEmpty(visit.get('endDate'))) {
        let reportRow = {
          patient: visit.get('patient'),
          patientId: visit.get('patient.displayPatientId'),
          patientName: visit.get('patient.displayName'),
          admissionDate: visit.get('startDate'),
          dischargeDate: visit.get('endDate')
        };
        let sex = visit.get('patient.sex');
        if (!sex) {
          sex = sexNotEnteredLabel;
        }
        let sexGrouping = patientBySex[sex];
        if (!sexGrouping) {
          sexGrouping = {
            count: 0,
            rows: []
          };
          patientBySex[sex] = sexGrouping;
        }
        sexGrouping.count++;
        sexGrouping.rows.push(reportRow);
      }
    }.bind(this));
    let sexTotal = 0;
    let addPatientBySexRows = (reportRow) =>  {
      this._addReportRow(reportRow, false, reportColumns);
    };
    for (let sex in patientBySex) {
      if (detailedReport) {
        patientBySex[sex].rows.forEach(addPatientBySexRows);
        this._addReportRow({ patientId: `${sex} Total: ${patientBySex[sex].count}` }, true, reportColumns);
      } else {
        this._addReportRow({ sex, total: patientBySex[sex].count }, true, reportColumns);
      }
      sexTotal += patientBySex[sex].count;
    }
    this._addReportRow({ patientId: `Grand Total: ${sexTotal}` }, true, reportColumns);
    this._finishReport(reportColumns);
  },

  _generateDiagnosticReport() {
    this._findDiagnosticsByDate().then(function(diagnostics) {
      let reportColumns = this.get('diagnosticReportColumns');
      this._addRowsByType(diagnostics.imaging, 'imagingType.name', 'Total for imaging: ', reportColumns);
      this._addRowsByType(diagnostics.labs, 'labType.name', 'Total for labs: ', reportColumns);
      this._finishReport(reportColumns);
    }.bind(this), function(err) {
      this._notifyReportError(`Error in _generateDiagnosticReport: ${err}`);
    }.bind(this));
  },

  _generatePatientDaysReport(visits, reportType) {
    visits = visits.filter(this._filterInPatientVisit);
    let detailed = (reportType.indexOf('detailed') === 0);
    let reportEndDate = this.get('endDate');
    let reportColumns;
    let reportStartDate = moment(this.get('startDate')).startOf('day');
    if (detailed) {
      reportColumns = this.get('admissionDetailReportColumns');
      reportColumns.patientDays.include = true;
      reportColumns.dischargeDate.include = true;
    } else {
      reportColumns = {
        total: {
          label: 'Total',
          include: true,
          property: 'total',
          format: '_numberFormat'
        }
      };
    }
    if (isEmpty(reportEndDate)) {
      reportEndDate = moment().endOf('day');
    } else {
      reportEndDate = moment(reportEndDate).endOf('day');
    }
    let patientDays = visits.reduce(function(previousValue, visit) {
      let calcEndDate = visit.get('endDate');
      let calcStartDate = moment(visit.get('startDate')).startOf('day');
      if (isEmpty(calcEndDate)) {
        calcEndDate = moment().endOf('day');
      } else {
        calcEndDate = moment(calcEndDate).endOf('day');
      }
      if (calcStartDate.isBefore(reportStartDate)) {
        calcStartDate = reportStartDate;
      }
      if (calcEndDate.isAfter(reportEndDate)) {
        calcEndDate = reportEndDate;
      }
      let daysDiff = calcEndDate.diff(calcStartDate, 'days', true);
      if (detailed) {
        this._addReportRow({
          patient: visit.get('patient'),
          patientId: visit.get('patient.displayPatientId'),
          patientName: visit.get('patient.displayName'),
          admissionDate: visit.get('startDate'),
          dischargeDate: visit.get('endDate'),
          patientDays: this._numberFormat(daysDiff, true)
        }, false, reportColumns);
      }
      return previousValue += daysDiff;
    }.bind(this), 0);
    if (detailed) {
      this._addReportRow({ patientDays: `Total: ${this._numberFormat(patientDays, true)}` }, true, reportColumns);

    } else {
      this._addReportRow({ total: this._numberFormat(patientDays, true) }, false, reportColumns);
    }
    this._finishReport(reportColumns);
  },

  _generateProcedureReport(reportType) {
    this._findProceduresByDate().then(function(procedures) {
      let reportColumns;
      procedures = procedures.filter(function(procedure) {
        let visit = procedure.get('visit');
        if (isEmpty(visit) || isEmpty(visit.get('patient.id')) || visit.get('patient.archived') === true) {
          return false;
        } else {
          return true;
        }
      });
      if (reportType.indexOf('detailed') === 0) {
        reportColumns = this.get('procedureDetailReportColumns');
        procedures.forEach(function(procedure) {
          procedure.set('patient', procedure.get('visit.patient'));
        });
        let procedureTotals = this._totalByType(procedures, 'description', 'all procedures');
        this._addPatientProcedureRows(procedureTotals, reportColumns);
        this._finishReport(reportColumns);
      } else {
        reportColumns = this.get('diagnosticReportColumns');
        this._addRowsByType(procedures, 'description', 'Total procedures: ', reportColumns);
        this._finishReport(reportColumns);
      }
    }.bind(this), function(err) {
      this._notifyReportError(`Error in _generateProcedureReport: ${err}`);
    }.bind(this));
  },

  _generateStatusReport() {
    this._findPatientsByStatus().then(function(patients) {
      let reportColumns = this.get('statusReportColumns');
      let sortedPatients = patients.sortBy('lastName', 'firstName');
      this._getPatientVisits(sortedPatients).then(function(resolvedPatients) {
        resolvedPatients.forEach(function(patient) {
          this._addReportRow({ patient }, false, reportColumns);
        }.bind(this));
        this._finishReport(reportColumns);
      }.bind(this)).catch(function(err) {
        this._notifyReportError(`Error in _generateStatusReport: ${err}`);
      }.bind(this));
    }.bind(this)).catch(function(err) {
      this._notifyReportError(`Error in _generateStatusReport: ${err}`);
    }.bind(this));
  },

  _generateVisitReport(visits) {
    let reportColumns = this.get('reportColumns');
    let visitFilters = this.getProperties(
      'examiner', 'visitDate', 'visitType', 'location', 'clinic',
      'primaryDiagnosis', 'secondaryDiagnosis'
    );
    for (let filter in visitFilters) {
      if (!isEmpty(visitFilters[filter])) {
        switch (filter) {
          case 'diagnosis': {
            visits = this._filterByLike(visits, 'diagnosisList', visitFilters[filter]);
            break;
          }
          default: {
            visits = visits.filterBy(filter, visitFilters[filter]);
            break;
          }
        }
      }
    }
    if (reportColumns.procedures.include) {
      let promisesMap = {};
      visits.forEach(function(visit) {
        promisesMap[visit.get('id')] = visit.get('procedures');
      });
      hash(promisesMap).then(function(resolutionHash) {
        visits.forEach(function(visit) {
          visit.set('resolvedProcedures', resolutionHash[visit.get('id')]);
        });
        this._finishVisitReport(visits);
      }.bind(this));
    } else {
      this._finishVisitReport(visits);
    }
  },

  _getPatientVisits(patients) {
    return new EmberPromise(function(resolve, reject) {
      let visitHash = {
      };
      patients.forEach(function(patient) {
        visitHash[patient.get('id')] = this.getPatientVisits(patient);
      }.bind(this));
      hash(visitHash).then(function(resolvedHash) {
        patients.forEach(function(patient) {
          patient.set('visits', resolvedHash[patient.get('id')]);
        });
        resolve(patients);
      }, reject);
    }.bind(this));
  },

  _haveLikeValue(valueToCompare, likeCondition) {
    return (valueToCompare.toLowerCase().indexOf(likeCondition.toLowerCase()) > -1);
  },

  _listToString(items, descField, dateField) {
    let itemList = [];
    if (!isEmpty(items)) {
      itemList = items.map(function(item) {
        return `${get(item, descField)} ( ${this._dateFormat(get(item, dateField))})`;
      }.bind(this));
    }
    return itemList.join(',\n');
  },

  /**
   * Given a list of records, total them by type and also add a grand total.
   * @param records {Array} list of records to total.
   * @param typeField {String} the field in the records containing the type.
   * @param totalLabel {String} the label for the grand total.
   * @param reportColumns
   */
  _totalByType(records, typeField, totalLabel) {
    let total = 0;
    let types = [];
    records.forEach(function(record) {
      let type = record.get(typeField);
      let typeObject;
      if (!isEmpty(type)) {
        typeObject = types.find(function(item) {
          let itemType = item.type;
          return itemType.trim().toLowerCase() === type.toLowerCase();
        });
        if (isEmpty(typeObject)) {
          typeObject = {
            type: type.trim(),
            total: 0,
            records: []
          };
          types.push(typeObject);
        }
        typeObject.total++;
        typeObject.records.push(record);
        total++;
      }
    });
    types = types.sortBy('type');
    types.push({ type: totalLabel, total });
    return types;
  },

  _procedureListToString(procedures) {
    return this._listToString(procedures, 'description', 'procedureDate');
  },

  _validateDates() {
    let reportType = this.get('reportType');
    if (reportType === 'status') {
      return true;
    }

    return this._validateDateInputs();
  },

  actions: {
    generateReport() {
      if (this._validateDates()) {
        let reportRows = this.get('reportRows');
        let reportType = this.get('reportType');
        reportRows.clear();
        this.showProgressModal();
        switch (reportType) {
          case 'diagnostic': {
            this._generateDiagnosticReport();
            break;
          }
          case 'detailedProcedures':
          case 'procedures': {
            this._generateProcedureReport(reportType);
            break;
          }
          case 'admissions':
          case 'discharges':
          case 'detailedAdmissions':
          case 'detailedDischarges':
          case 'detailedPatientDays':
          case 'patientDays':
          case 'visit': {
            this._findVisitsByDate().then(function(visits) {
              switch (reportType) {
                case 'admissions':
                case 'detailedAdmissions':
                case 'detailedDischarges':
                case 'discharges': {
                  this._generateAdmissionOrDischargeReport(visits, reportType);
                  break;
                }
                case 'detailedPatientDays':
                case 'patientDays': {
                  this._generatePatientDaysReport(visits, reportType);
                  break;
                }
                case 'visit': {
                  this._generateVisitReport(visits);
                  break;
                }
              }
            }.bind(this), function(err) {
              this._notifyReportError(`Error in _findVisitsByDate: ${err}`);
            }.bind(this));
            break;
          }
          case 'status': {
            this._generateStatusReport();
            break;
          }
        }
      }
    },
    viewPatient(id) {
      this.store.find('patient', id).then(function(item) {
        item.set('returnTo', 'patients.reports');
        this.transitionToRoute('patients.edit', item);
      }.bind(this));
    }

  }
});
