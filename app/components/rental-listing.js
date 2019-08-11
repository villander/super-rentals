import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  value: '',

  isWide: false,

  rentals: computed('value', function () {
    if (this.value !== '') {
      return this.store.query('rental', { city: this.value })
        .then((results) => {
          return { query: this.value, results: results };
        });
    } else {
      return this.store.findAll('rental')
        .then((results) => {
          return { query: this.value, results: results };
        });
    }
  }),

  actions: {
    toggleImageSize() {
      this.toggleProperty('isWide');
    }
  },
});
