'use strict';
const { createElement, useState, useEffect } = React;
import { Card, SmallCard } from './card.mjs';

const { render } = ReactDOM;
const html = htm.bind(createElement);

function WidgetApp() {
  const [Homey, setHomey] = useState(null);

  useEffect(() => {
    window.onHomeyReady = (homeyInstance) => {
      setHomey(homeyInstance);
      homeyInstance.ready();
    };

    // Cleanup
    return () => {
      window.onHomeyReady = undefined;
    };
  }, []);

  return html`
    <div class="homey-text-small">
      <div class="temperature-viewer-grid">
        <${Card} value=${-4}>Ute</${Card}>
        <${Card} value=${0.1}>Stue/kjøkken</${Card}>
      </div>

      <div class="temperature-viewer-grid-small">
        <${SmallCard} value=${3.4}>Garasje</${SmallCard}>
        <${SmallCard} value=${3.4}>Garasje</${SmallCard}>
        <${SmallCard} value=${3.4}>Garasje</${SmallCard}>
        <${SmallCard} value=${3.4}>Garasje</${SmallCard}>
      </div>
    </div>
  `;
}

render(html`<${WidgetApp} />`, document.getElementById('app'));
