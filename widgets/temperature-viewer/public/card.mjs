'use strict';
import { getTemperatureColor } from './colors.mjs';

const { createElement } = React;
const html = htm.bind(createElement);

export function Card({ children, value }) {
  const valToShow = getFormatedTemperature(value);

  return html`
    <div class="temperature-card">
      <p>
        ${children}<br />
        <span
          class="temperature-card__number"
          style=${{ color: getTemperatureColor(value ?? 0) }}
        >
          ${valToShow ? `${valToShow}°` : '-'}
        </span>
      </p>
    </div>
  `;
}

export function SmallCard({ children, value }) {
  const valToShow = getFormatedTemperature(value);

  return html`
    <div class="temperature-small-card homey-border-bottom">
      ${children}
      <span style=${{ color: getTemperatureColor(value ?? 0) }}>
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
