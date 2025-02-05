import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { ComboBoxLight, type ComboBoxLightElement } from '../src/ComboBoxLight.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('ComboBoxLight', () => {
  const overlayTag = 'vaadin-combo-box-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<ComboBoxLightElement>(overlayTag, (ref) => ref.close());

  afterEach(cleanup);
  afterEach(catcher);

  it('should render correctly', (done) => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];
    const { container } = render(
      <ComboBoxLight<Item>
        ref={ref}
        items={items}
        opened
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemChanged={(event) => {
          expect(event.detail.value?.value).to.equal('bar');
          expect(event.detail.value?.index).to.equal(1);
          done();
        }}
      />,
    );

    const comboBox = container.querySelector('vaadin-combo-box-light');
    expect(comboBox).to.exist;

    const comboBoxOverlay = document.body.querySelector(overlayTag);
    expect(comboBoxOverlay).to.exist;

    const bar = comboBoxOverlay!.querySelector('vaadin-combo-box-item:nth-child(2)');
    expect(bar).to.exist;
    expect(bar).to.have.text('bar');

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));
  });
});
