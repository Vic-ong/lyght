const dayjs = require('@/services/dayjs');
const Cache = require('@/models/Cache');
const { fetchCurrentWeather } = require('@/services/weather');
const Response = require('./Response');

class Weather {
  constructor(ctx) {
    this.reqBody = ctx.req.body;
  }

  async getCurrentWeather() {
    const { city, lang = 'en-US' } = this.reqBody;
    const cacheKey = `weather-current-${city.replace(/ /g, '').toLowerCase()}`;

    const cacheDoc = await Cache.getData(cacheKey);
    if (cacheDoc.exists) {
      const cacheData = cacheDoc.data();
      const ttl = new Date(cacheData.ttl.seconds * 1000);
      if (new Date() < ttl) {
        return Response.success(cacheData.data);
      }
    }

    const res = await fetchCurrentWeather({ city, lang });

    await Cache.createData({
      id: cacheKey,
      data: res.data[0],
      ttl: new Date(dayjs().add(4, 'hour')),
    });

    return Response.success(res.data[0]);
  }
}

module.exports = Weather;
