import AppointmenCalendarRoute from 'hospitalrun/appointments/calendar/route';
import { t } from 'hospitalrun/macro';

export default AppointmenCalendarRoute.extend({
  editReturn: 'appointments.theater',
  newButtonText: t('appointments.buttons.scheduleSurgery'),
  pageTitle: t('appointments.titles.theaterSchedule'),

  _modelQueryParams(params) {
    let queryParams = this._super(params);
    queryParams.mapReduce = 'surgical_appointments_by_date';
    return queryParams;
  },

  actions: {
    newItem() {
      this.transitionTo('appointments.edit', 'newsurgery');
    }
  }
});
