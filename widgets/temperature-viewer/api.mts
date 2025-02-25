import type Homey from 'homey/lib/Homey.d.ts';

export default {
  async temperature({ homey }: { homey: Homey }) {
    try {
      //@ts-expect-error getTemperatures is defined in app.mts
      const temperatures = await homey.app.getTemperatures();

      if (!temperatures) {
        return null;
      }

      return temperatures;
    } catch (error) {
      homey.error('Failed to fetch temperatures:', error);
      return {
        error: 'Failed to fetch temperatures',
      };
    }
  },
};
