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
        <${Card} value=${
    temperature?.outdoor
  } customColorScale=${customColorScale}>Ute</${Card}>
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

function customColorScale(value) {
  // Add light background to colors that needs it
  // Colors from Met Office https://www.metoffice.gov.uk/blog/2023/no-need-to-see-red-over-met-office-colour-scale
  const temperatureColorScale = [
    { temperature: 50, color: '#100002', light: true },
    { temperature: 45, color: '#1f0007', light: true },
    { temperature: 40, color: '#3a000e', light: true },
    { temperature: 35, color: '#70001c', light: true },
    { temperature: 30, color: '#c30031' },
    { temperature: 27, color: '#e13d32' },
    { temperature: 24, color: '#f67639' },
    { temperature: 22, color: '#fc9f46' },
    { temperature: 20, color: '#ffb34c' },
    { temperature: 18, color: '#ffc261' },
    { temperature: 16, color: '#ffc96c' },
    { temperature: 14, color: '#ffd881' },
    { temperature: 12, color: '#ffe796' },
    { temperature: 10, color: '#ffeea1' },
    { temperature: 8, color: '#e3ecab' },
    { temperature: 6, color: '#cfebb2' },
    { temperature: 4, color: '#b6e3b7' },
    { temperature: 2, color: '#91d5ba' },
    { temperature: 0, color: '#7fcebc' },
    { temperature: -2, color: '#60c3c1' },
    { temperature: -4, color: '#38aec4' },
    { temperature: -6, color: '#1d92c1' },
    { temperature: -8, color: '#3075ac' },
    { temperature: -10, color: '#435897' },
    { temperature: -15, color: '#082376', light: true },
    { temperature: -20, color: '#02154f', light: true },
    { temperature: -30, color: '#020f39', light: true },
    { temperature: -40, color: '#01081e', light: true },
  ];

  // Find the closest temperature in the scale
  for (let i = 0; i < temperatureColorScale.length; i++) {
    if (value >= temperatureColorScale[i].temperature) {
      return {
        color: temperatureColorScale[i].color,
        light: temperatureColorScale[i].light,
      };
    }
  }

  // If colder than the coldest in our scale, return the coldest color
  return {
    color: temperatureColorScale[temperatureColorScale.length - 1].color,
    light: temperatureColorScale[temperatureColorScale.length - 1].light,
  };
}

render(html`<${WidgetApp} />`, document.getElementById('app'));
