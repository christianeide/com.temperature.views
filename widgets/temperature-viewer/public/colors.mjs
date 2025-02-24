'use strict';

export function getTemperatureColor(value) {
  if (value < 0) {
    return 'var(--homey-color-red-500)';
  }

  return 'var(--homey-color-blue-500)';
}
