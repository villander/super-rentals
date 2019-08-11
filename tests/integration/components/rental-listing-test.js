import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled, fillIn, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | rental-listing', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('should display rental details', async function (assert) {
    await render(hbs`<RentalListing/>`);
    assert.equal(this.element.querySelector('.listing h3').textContent.trim(), 'Grand Old Mansion', 'Title: Grand Old Mansion');
    assert.equal(this.element.querySelector('.listing .owner').textContent.trim(), 'Owner: Veruca Salt', 'Owner: Veruca Salt');

  });

  test('should toggle wide class on click', async function (assert) {
    await render(hbs`<RentalListing/>`);
    assert.notOk(this.element.querySelector('.image.wide'), 'initially rendered small');
    await click('.image');
    assert.ok(this.element.querySelector('.image.wide'), 'rendered wide after click');
    await click('.image');
    assert.notOk(this.element.querySelector('.image.wide'), 'rendered small after second click');

  });

  test('should initially load all listings', async function (assert) {
    // with an integration test, you can set up and use your component in the
    // same way your application will use it.
    await render(hbs`<RentalListing/>`);
    await settled();

    assert.equal(this.element.querySelectorAll('.rental').length, 3);
  });

  test('should update with matching listings', async function (assert) {
  
    await render(hbs`<RentalListing/>`);
  
    // fill in the input field with 's'
    await fillIn(this.element.querySelector('.list-filter input'),'sa');
    // keyup event to invoke an action that will cause the list to be filtered
    await triggerKeyEvent(this.element.querySelector('.list-filter input'), "keyup", 83);
    await settled();
  
    assert.equal(this.element.querySelectorAll('.detail.location').length, 1, 'One result returned');
    assert.dom(this.element.querySelector('.detail.location')).hasText('Location: San Francisco');
  });

});
