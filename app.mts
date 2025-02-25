import Homey from 'homey';
import { HomeyAPI } from 'homey-api';

export default class MyApp extends Homey.App {
  homeyApi: HomeyAPI | null = null;

  /**
   * onInit is called when the app is initialized.
   */
  override async onInit() {
    this.log('MyApp has been initialized');

    this.homeyApi = await HomeyAPI.createAppAPI({
      homey: this.homey,
    });
  }

  async getTemperatures() {
    if (!this.homeyApi) {
      return null;
    }

    //@ts-expect-error devices is defined in homey-api
    const devices = await this.homeyApi.devices.getDevices();
    if (!devices) {
      return null;
    }

    const temperatures: Record<string, number | null> = {
      outdoor: null,
      livingroom: null,
      laundry: null,
      wardrobe: null,
      livingroomFloor: null,
      bathroomSmall: null,
      bathroomLarge: null,
      hallway: null,
      garage: null,
    };

    Object.values(devices).forEach((device: any) => {
      switch (device.uri) {
        // Varmepumpe
        case 'homey:device:2488ce5f-ab5c-4d88-868d-878bf610c2cc':
          temperatures.outdoor =
            device.capabilitiesObj?.['measure_temperature.outdoorTemperature']
              ?.value ?? null;
          temperatures.livingroom =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Air sensor landry room
        case 'homey:device:e8f15345-0afe-438e-92ca-197b74e6dac1':
          temperatures.laundry =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Floor temperature wardrobe
        case 'homey:device:00b7cde0-e7a6-4c28-8224-bd34729c2ee0':
          temperatures.wardrobe = temperatures.wardrobe =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Floor temperature livingroom
        case 'homey:device:a47f60fd-f521-4e2d-8ef2-4ad5742dae68':
          temperatures.livingroomFloor =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Small bathroom floor
        case 'homey:device:f9418744-b444-44f8-804d-3bc62ed13b3a':
          temperatures.bathroomSmall =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Large bathroom floor
        case 'homey:device:06ba486a-26ed-4d8e-99a0-1ce719b09caf':
          temperatures.bathroomLarge =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Hallway floor
        case 'homey:device:65faf79c-6837-450d-9199-bb9bd83b6e0d':
          temperatures.hallway =
            device.capabilitiesObj?.measure_temperature?.value ?? null;
          break;

        // Garage implant
        case 'homey:device:4645e908-da2d-4e75-a716-a999fa993104':
          temperatures.garage =
            device.capabilitiesObj?.['measure_temperature.external1']?.value ??
            null;
          break;
      }
    });

    return temperatures;
  }
}
