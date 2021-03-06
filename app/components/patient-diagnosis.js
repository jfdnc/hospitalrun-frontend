import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import UserSession from 'hospitalrun/mixins/user-session';

const DIAGNOSIS_KEYS = [
  'diagnosisContainer',
  'hideInActiveDiagnoses',
  'diagnosisContainer.diagnoses.@each.active',
  'diagnosisContainer.diagnoses.@each.secondaryDiagnosis'
];

export default Component.extend(PatientDiagnosis, UserSession, {
  intl: service(),
  allowAddDiagnosis: false,
  diagnosisContainer: null,
  diagnosisProperty: null,
  diagnosisList: null,
  editDiagnosisAction: 'editDiagnosis',
  hideInActiveDiagnoses: true,
  showAddDiagnosisAction: 'showAddDiagnosis',

  canAddDiagnosis: computed('allowAddDiagnosis', {
    get() {
      let allowAddDiagnosis = get(this, 'allowAddDiagnosis');
      return allowAddDiagnosis && this.currentUserCan('add_diagnosis');
    }
  }),

  havePrimaryDiagnoses: computed('primaryDiagnoses.length', {
    get() {
      let primaryDiagnosesLength = this.get('primaryDiagnoses.length');
      return (primaryDiagnosesLength > 0);
    }
  }),

  haveSecondaryDiagnoses: computed('secondaryDiagnoses.length', {
    get() {
      let secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
      return (secondaryDiagnosesLength > 0);
    }
  }),

  primaryDiagnoses: computed(...DIAGNOSIS_KEYS, {
    get() {
      let diagnosisContainer = this.get('diagnosisContainer');
      let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
      return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, false);
    }
  }),

  secondaryDiagnoses: computed(...DIAGNOSIS_KEYS,  {
    get() {
      let diagnosisContainer = this.get('diagnosisContainer');
      let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
      return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, true);
    }
  }),

  showPrimaryDiagnoses: computed('canAddDiagnosis', 'havePrimaryDiagnoses', {
    get() {
      return this.get('canAddDiagnosis') || this.get('havePrimaryDiagnoses');
    }
  }),

  actions: {
    editDiagnosis(diagnosis) {
      this.sendAction('editDiagnosisAction', diagnosis);
    },

    showAddDiagnosis() {
      this.sendAction('showAddDiagnosisAction');
    }
  }
});
