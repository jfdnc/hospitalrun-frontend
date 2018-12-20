import { computed, writable } from 'ember-macro-helpers';
import { translationMacro } from 'ember-intl';

export function t() {

  return computed('intl.locale', () => {
    return writable(translationMacro(...arguments));
  });
};
