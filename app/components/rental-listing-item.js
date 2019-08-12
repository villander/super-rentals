import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    toggleImageSize() {
      this.toggleProperty('isWide');
    }
  }
});
