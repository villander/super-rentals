import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | rental-listing-item', function(hooks) {
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
});
