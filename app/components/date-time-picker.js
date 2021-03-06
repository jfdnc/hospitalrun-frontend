import { once } from '@ember/runloop';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import moment from 'moment';

export default Component.extend({
  intl: service(),
  dateTimePickerDate: null,
  datePickerClass: '',
  endDate: alias('model.endDate'),
  endHour: null,
  endMinute: null,
  label: '',
  startDate: alias('model.startDate'),
  startHour: null,
  startMinute: null,

  didReceiveAttrs() {
    let endDate = moment(this.get('endDate'));
    let startDate = moment(this.get('startDate'));
    if (isEmpty(endDate)) {
      endDate = startDate;
    }
    this.set('endHour', endDate.hour());
    this.set('endMinute', endDate.minute());
    this.set('startHour', startDate.hour());
    this.set('startMinute', startDate.minute());
    this.set('dateTimePickerDate', startDate.toDate());
    this._updateDates();
  },

  hourList: computed('intl.locale', function() {
    let hour;
    let hourList = [];
    let intl = this.get('intl');
    for (hour = 0; hour < 24; hour++) {
      let hourText;
      let hourProp = {
        hour: (hour % 12) // Show hour in 12 hour am/pm format
      };
      if (hour === 0) {
        hourText = intl.t('components.dateTimePicker.midnight');
      } else if (hour === 12) {
        hourText = intl.t('components.dateTimePicker.noon');
      } else if (hour < 12) {
        hourText = intl.t('components.dateTimePicker.amHour', hourProp);
      } else {
        hourText = intl.t('components.dateTimePicker.pmHour', hourProp);
      }
      hourList.push({
        name: hourText,
        value: hour
      });
    }
    return hourList;
  }),

  isAllDay: computed('model.allDay', function() {
    let allDay = this.get('model.allDay');
    if (allDay) {
      this.set('startHour', 0);
      this.set('startMinute', 0);
      this.set('endHour', 23);
      this.set('endMinute', 59);
      this._updateDates();
    }
    return allDay;
  }),

  minuteList: computed(function() {
    let minute;
    let minuteList = [];
    for (minute = 0; minute < 60; minute++) {
      minuteList.push({
        name: String(`00${minute}`).slice(-2),
        value: minute
      });
    }
    return minuteList;
  }),

  actions: {
    dateChanged(/* newDate */) {
      this._updateDates();
    },

    endHourChanged(endHour) {
      this.set('endHour', endHour);
      this._updateDates();
    },

    endMinuteChanged(endMinute) {
      this.set('endMinute', endMinute);
      this._updateDates();
    },

    startHourChanged(startHour) {
      this.set('startHour', startHour);
      this._updateDates();
    },

    startMinuteChanged(startMinute) {
      this.set('startMinute', startMinute);
      this._updateDates();
    }
  },

  endTimeHasError: computed('model.isValid', function() {
    let endDateError = this.get('model.errors.endDate');
    return (endDateError.length > 0);
  }),

  _updateDates() {
    once(this, () =>{
      let datePrefixes = ['start', 'end'];
      datePrefixes.forEach((datePrefix) => {
        let dateProperty = `${datePrefix}Date`;
        let dateToChange = this.get(dateProperty);
        let dateSelected = this.get('dateTimePickerDate');
        let hour = this.get(`${datePrefix}Hour`);
        let minute = this.get(`${datePrefix}Minute`);
        if (!isEmpty(dateSelected)) {
          dateToChange = moment(dateSelected);
          dateToChange.hour(hour);
          dateToChange.minute(minute);
          this.set(dateProperty, dateToChange.toDate());
        }
      });
      let model = this.get('model');
      model.validate().catch(function() {});
    });
  }
});
