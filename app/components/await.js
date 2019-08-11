import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  isLoaded: true,
  emptyState: false,

  content: readOnly('resolve.last.value'),
  error: readOnly('resolve.last.error'),

  isError: readOnly('resolve.last.isError'),

  isRunning: computed('isLoaded', 'resolve.isRunning', function() {
    return this.resolve.isRunning || !this.isLoaded;
  }).readOnly(),

  promise: computed({
    set(key, value) {
      this.resolve.perform(value);

      return value;
    }
  }),

  resolve: task(function *(promise) {
    return yield promise;
  }).restartable()
});
