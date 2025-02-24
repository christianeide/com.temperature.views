import type Homey from 'homey/lib/Homey.d.ts';

export default {
  async getSomething({ homey, query }: { homey: Homey; query: any }) {
    // you can access query parameters like "/?foo=bar" through `query.foo`

    // you can access the App instance through homey.app
    // const result = await homey.app.getSomething();
    // return result;

    // perform other logic like mapping result data

    return 'Hello from App';
  },
};
