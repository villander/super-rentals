import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Promise, resolve, reject } from 'rsvp';
import { task, timeout } from 'ember-concurrency';
import { defineProperty } from '@ember/object';

module('Integration | Component | await', function(hooks) {
  setupRenderingTest(hooks);

  test('it shows block content when promise argument is empty', async function(assert) {
    assert.expect(1);

    await render(hbs`
      <Await>
        Block Content
      </Await>
    `);

    assert.dom().hasText('Block Content');
  });

  module('non-promise', function() {
    test('it shows loading state when isLoaded is false', async function(assert) {
      assert.expect(1);

      this.set('promise', 'non-promise');

      await render(hbs`
        <Await @promise={{this.promise}} @isLoaded={{false}} />
      `);

      assert.dom('[data-test-loading-state]').exists();
    });

    test('it returns value as param', async function(assert) {
      assert.expect(1);

      this.set('promise', 'John Doe');

      await render(hbs`
        <Await @promise={{this.promise}} as |content|>
          {{content}}
        </Await>
      `);

      assert.dom().hasText('John Doe');
    });

    test('it shows empty state when no value and emptyState is true', async function(assert) {
      assert.expect(1);

      this.set('emptyState', true);

      await render(hbs`
        <Await @promise={{this.promise}} @emptyState={{this.emptyState}} />
      `);

      assert.dom('[data-test-empty-state]').exists();
    });

    test('it yields to inverse empty state when no value and emptyState is true', async function(assert) {
      assert.expect(2);

      this.set('emptyState', true);

      await render(hbs`
        {{#component "await" promise=this.promise emptyState=this.emptyState}}
          Content
        {{else}}
          No content
        {{/component}}
      `);

      assert.dom().doesNotIncludeText('Content');
      assert.dom().hasText('No content');
    });
  });

  module('promise', function() {
    test('it shows loading state', async function(assert) {
      assert.expect(1);

      this.set('promise', new Promise(() => {}));

      await render(hbs`
        <Await @promise={{this.promise}} />
      `);

      assert.dom('[data-test-loading-state]').exists();
    });

    test('it shows loading state when isLoaded is false', async function(assert) {
      assert.expect(1);

      this.set('promise', resolve());

      await render(hbs`
        <Await @promise={{this.promise}} @isLoaded={{false}} />
      `);

      assert.dom('[data-test-loading-state]').exists();
    });

    test('it shows error state', async function(assert) {
      assert.expect(1);

      this.set('promise', reject());

      await render(hbs`
        <Await @promise={{this.promise}} />
      `);

      assert.dom('[data-test-error-state]').exists();
    });

    test('it returns value as param', async function(assert) {
      assert.expect(1);

      this.set('promise', resolve('John Doe'));

      await render(hbs`
        <Await @promise={{this.promise}} as |content|>
          {{content}}
        </Await>
      `);

      assert.dom().hasText('John Doe');
    });

    test('it shows empty state when no value and emptyState is true', async function(assert) {
      assert.expect(1);

      this.set('promise', resolve());
      this.set('emptyState', true);

      await render(hbs`
        <Await @promise={{this.promise}} @emptyState={{this.emptyState}} />
      `);

      assert.dom('[data-test-empty-state]').exists();
    });

    test('it yields to inverse empty state when no value and emptyState is true', async function(assert) {
      assert.expect(2);

      this.set('promise', resolve());
      this.set('emptyState', true);

      await render(hbs`
        {{#component "await" promise=this.promise emptyState=this.emptyState}}
          Content
        {{else}}
          No content
        {{/component}}
      `);

      assert.dom().doesNotIncludeText('Content');
      assert.dom().hasText('No content');
    });
  });

  module('task', function() {
    test('it shows loading state', async function(assert) {
      assert.expect(1);

      defineProperty(this, 'task', task(function *() {
        return yield new Promise(() => {});
      }).restartable());

      this.set('promise', this.task.perform());

      await render(hbs`
        <Await @promise={{this.promise}} />
      `);

      assert.dom('[data-test-loading-state]').exists();
    });

    test('it shows loading state when isLoaded is false', async function(assert) {
      assert.expect(1);

      defineProperty(this, 'task', task(function *() {
        return yield resolve();
      }).restartable());

      this.set('promise', this.task.perform());

      await render(hbs`
        <Await @promise={{this.promise}} @isLoaded={{false}} />
      `);

      assert.dom('[data-test-loading-state]').exists();
    });

    test('it shows error state', async function(assert) {
      assert.expect(1);

      defineProperty(this, 'task', task(function *() {
        return yield reject();
      }).restartable());

      this.set('promise', this.task.perform());

      await render(hbs`
        <Await @promise={{this.promise}} />
      `);

      assert.dom('[data-test-error-state]').exists();
    });

    test('it returns value as param', async function(assert) {
      assert.expect(1);

      defineProperty(this, 'task', task(function *() {
        return yield resolve('John Doe');
      }).restartable());

      this.set('promise', this.task.perform());

      await render(hbs`
        <Await @promise={{this.promise}} as |content|>
          {{content}}
        </Await>
      `);

      assert.dom().hasText('John Doe');
    });

    test('it shows block content when task is cancelled', async function(assert) {
      assert.expect(2);

      defineProperty(this, 'task', task(function *() {
        yield timeout(1000);

        return yield resolve('John Doe');
      }).restartable());

      await render(hbs`
        <Await @promise={{this.promise}} as |content|>
          {{content}}
          My content
        </Await>
      `);

      this.set('promise', this.task.perform());
      await this.promise.cancel();

      assert.dom().hasText('My content');
      assert.dom().doesNotIncludeText('John Doe');
    });

    test('it shows empty state when no value and emptyState is true', async function(assert) {
      assert.expect(1);

      defineProperty(this, 'task', task(function *() {
        return yield resolve();
      }).restartable());

      this.set('promise', this.task.perform());
      this.set('emptyState', true);

      await render(hbs`
        <Await @promise={{this.promise}} @emptyState={{this.emptyState}} />
      `);

      assert.dom('[data-test-empty-state]').exists();
    });

    test('it yields to inverse empty state when no value and emptyState is true', async function(assert) {
      assert.expect(2);

      defineProperty(this, 'task', task(function *() {
        return yield resolve();
      }).restartable());

      this.set('promise', this.task.perform());
      this.set('emptyState', true);

      await render(hbs`
        {{#component "await" promise=this.promise emptyState=this.emptyState}}
          Content
        {{else}}
          No content
        {{/component}}
      `);

      assert.dom().doesNotIncludeText('Content');
      assert.dom().hasText('No content');
    });
  });
});