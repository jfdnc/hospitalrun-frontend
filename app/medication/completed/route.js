import { computed } from '@ember/object';
import { t } from 'hospitalrun/macro';
import MedicationIndexRoute from 'hospitalrun/medication/index/route';

export default MedicationIndexRoute.extend({
  modelName: 'medication',
  pageTitle: t('medication.titles.completedMedication'),
  searchStatus: 'Fulfilled'
});
