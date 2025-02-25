'use strict';
const { createElement, useState, useEffect } = React;
import { Card, SmallCard } from './card.mjs';

const { render } = ReactDOM;
const html = htm.bind(createElement);

function WidgetApp() {
  const [Homey, setHomey] = useState(null);
  const [temperature, setTemperature] = useState(null);

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

  // Effect for getting temperatures
  useEffect(() => {
    const fetchData = () => {
      if (Homey) {
        Homey.api('GET', `/temperature`, {})
          .then((data) => {
            if (!data) {
              return;
            }
            setTemperature(data);
          })
          .catch(console.error);
      }
    };

    fetchData(); // Call immediately

    // Set up interval
    const interval = setInterval(fetchData, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [Homey]);

  return html`
    <div class="homey-text-small">
      <div class="temperature-viewer-grid">
        <${Card} value=${temperature?.outdoor} min=${0} max=${0.1}>Ute</${Card}>
        <${Card} value=${
    temperature?.livingroom
  } min=${21} max=${23.5}>Stue/kjøkken</${Card}>
      </div>

      <div class="temperature-viewer-grid temperature-viewer-grid--small">
        <${SmallCard} value=${
    temperature?.garage
  } min=${0} max=${20}>Garasje</${SmallCard}>
        <${SmallCard} value=${
    temperature?.hallway
  } min=${14} max=${18}>Gang</${SmallCard}>
        <${SmallCard} value=${
    temperature?.livingroomFloor
  } min=${19} max=${23}>Gulv stue</${SmallCard}>
        <${SmallCard} value=${
    temperature?.wardrobe
  } min=${19} max=${24}>Garderobe</${SmallCard}>
        <${SmallCard} value=${
    temperature?.bathroomSmall
  } min=${22} max=${26}>Bad nede</${SmallCard}>
        <${SmallCard} value=${
    temperature?.bathroomLarge
  } min=${28} max=${34}>Bad oppe</${SmallCard}>
        <${SmallCard} value=${
    temperature?.laundry
  } min=${18} max=${24}>Vaskerom</${SmallCard}>
      </div>
    </div>
  `;
}

render(html`<${WidgetApp} />`, document.getElementById('app'));
