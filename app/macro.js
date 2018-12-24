import { computed, writable } from 'ember-macro-helpers';
import { translationMacro } from 'ember-intl';

export const t = function() {
  return computed('intl.locale', () => {
    return writable(translationMacro(...arguments));
  });
};
