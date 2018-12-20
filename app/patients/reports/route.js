import { resolve } from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { t } from 'hospitalrun/macro';

export default AbstractIndexRoute.extend({
  pageTitle: t('patients.titles.patientReport'),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
