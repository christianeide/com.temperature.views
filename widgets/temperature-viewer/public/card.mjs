'use strict';

const { createElement } = React;
const html = htm.bind(createElement);

function getTemperatureColor(value, min, max) {
  if (value === null || value === undefined)
    return { color: 'var(--homey-text-color-light)' };

  if (value < min) return { color: 'var(--homey-color-blue-500)' };
  if (max && value > max) return { color: 'var(--homey-color-red-500)' };

  return { color: 'var(--homey-text-color)' };
}

export function Card({ children, value, min, max, customColorScale }) {
  const valToShow = getFormatedTemperature(value);

  const { color, light } = customColorScale
    ? customColorScale(value)
    : getTemperatureColor(value, min, max);

  return html`
    <div class="temperature-card">
      <p>
        ${children}<br />
        <span
          class="temperature-card__number ${light
            ? 'temperature-card__number--light'
            : ''} "
          style=${{
            color,
          }}
        >
          ${valToShow ? `${valToShow}°` : '-'}
        </span>
      </p>
    </div>
  `;
}

export function SmallCard({ children, value, min, max }) {
  const valToShow = getFormatedTemperature(value);
  const { color } = getTemperatureColor(value, min, max);

  return html`
    <div class="temperature-small-card">
      ${children}
      <span class="homey-text-bold" style=${{ color }}>
        ${valToShow ? `${valToShow}°` : '-'}
      </span>
    </div>
  `;
}

function getFormatedTemperature(value) {
  return value?.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
