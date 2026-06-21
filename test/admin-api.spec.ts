import {expect} from 'chai';
import * as http from 'http';

const BASE_URL = process.env['TEST_BASE_URL'] || 'http://localhost:3000';

function request(
  method: string,
  path: string,
  body?: any,
): Promise<{status: number; body: any}> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options: http.RequestOptions = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {'Content-Type': 'application/json'},
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed: any;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({status: res.statusCode!, body: parsed});
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('Admin API - Region', () => {
  describe('POST /admin/region', () => {
    it('should create a new region', async () => {
      const res = await request('POST', '/admin/region', {name: 'TestRegion'});
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'TestRegion');
      expect(res.body).to.have.property('createdAt');
    });

    it('should return an error when creating a region with a duplicate name', async () => {
      await request('POST', '/admin/region', {name: 'DuplicateRegion'});
      const res = await request('POST', '/admin/region', {name: 'DuplicateRegion'});
      expect(res.status).to.be.gte(400);
    });

    it('should return an error when name is missing', async () => {
      const res = await request('POST', '/admin/region', {});
      expect(res.status).to.be.gte(400);
    });
  });

  describe('GET /admin/region', () => {
    it('should list all regions', async () => {
      const res = await request('GET', '/admin/region');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.gte(1);
    });
  });

  describe('GET /admin/region/by-name/:name', () => {
    it('should return a region by name', async () => {
      const res = await request('GET', '/admin/region/by-name/EU');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'EU');
    });

    it('should return 404 for a non-existent region', async () => {
      const res = await request('GET', '/admin/region/by-name/NonExistent');
      expect(res.status).to.equal(404);
    });
  });
});

describe('Admin API - Weight Class', () => {
  describe('POST /admin/weightclass', () => {
    it('should create a new weight class that extends the range', async () => {
      const res = await request('POST', '/admin/weightclass', {
        name: 'SuperHuge',
        lower: 1000,
        upper: 5000,
        price: 5000,
        upperInclusive: true,
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'SuperHuge');
      expect(res.body).to.have.property('lower', 1000);
      expect(res.body).to.have.property('upper', 5000);
      expect(res.body).to.have.property('price', 5000);
    });

    it('should reject a weight class with overlapping ranges', async () => {
      const res = await request('POST', '/admin/weightclass', {
        name: 'OverlapClass',
        lower: 5,
        upper: 15,
        price: 200,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a weight class that creates a gap in the range', async () => {
      const res = await request('POST', '/admin/weightclass', {
        name: 'GapClass',
        lower: 6000,
        upper: 7000,
        price: 10000,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a weight class with a duplicate name', async () => {
      const res = await request('POST', '/admin/weightclass', {
        name: 'Small',
        lower: 0,
        upper: 10,
        price: 100,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a weight class where lower >= upper', async () => {
      const res = await request('POST', '/admin/weightclass', {
        name: 'InvalidRange',
        lower: 100,
        upper: 50,
        price: 100,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should return an error when required fields are missing', async () => {
      const res = await request('POST', '/admin/weightclass', {name: 'Incomplete'});
      expect(res.status).to.be.gte(400);
    });
  });

  describe('GET /admin/weightclass', () => {
    it('should list all weight classes', async () => {
      const res = await request('GET', '/admin/weightclass');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.gte(4);
    });
  });

  describe('GET /admin/weightclass/by-name/:name', () => {
    it('should return a weight class by name', async () => {
      const res = await request('GET', '/admin/weightclass/by-name/Small');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Small');
      expect(res.body).to.have.property('price');
      expect(res.body).to.have.property('lower');
      expect(res.body).to.have.property('upper');
    });

    it('should return 404 for a non-existent weight class', async () => {
      const res = await request('GET', '/admin/weightclass/by-name/NonExistent');
      expect(res.status).to.equal(404);
    });
  });
});

describe('Admin API - Region Pricing', () => {
  describe('POST /admin/region-pricing', () => {
    it('should create a new region pricing entry', async () => {
      const regionName = 'PricingTestRegion_' + Date.now();
      await request('POST', '/admin/region', {name: regionName});

      const res = await request('POST', '/admin/region-pricing', {
        fromRegion: 'EU',
        toRegion: regionName,
        priceMultiplier: 3.0,
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('fromRegion', 'EU');
      expect(res.body).to.have.property('toRegion', regionName);
      expect(res.body).to.have.property('priceMultiplier', 3.0);
    });

    it('should reject a duplicate from/to region combination', async () => {
      const res = await request('POST', '/admin/region-pricing', {
        fromRegion: 'EU',
        toRegion: 'EU',
        priceMultiplier: 2.0,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a negative price multiplier', async () => {
      const regionName = 'NegPricingRegion_' + Date.now();
      await request('POST', '/admin/region', {name: regionName});

      const res = await request('POST', '/admin/region-pricing', {
        fromRegion: regionName,
        toRegion: 'EU',
        priceMultiplier: -1.5,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a zero price multiplier', async () => {
      const regionName = 'ZeroPricingRegion_' + Date.now();
      await request('POST', '/admin/region', {name: regionName});

      const res = await request('POST', '/admin/region-pricing', {
        fromRegion: regionName,
        toRegion: 'EU',
        priceMultiplier: 0,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject when fromRegion does not exist', async () => {
      const res = await request('POST', '/admin/region-pricing', {
        fromRegion: 'NonExistentRegion',
        toRegion: 'EU',
        priceMultiplier: 1.5,
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject when toRegion does not exist', async () => {
      const res = await request('POST', '/admin/region-pricing', {
        fromRegion: 'EU',
        toRegion: 'NonExistentRegion',
        priceMultiplier: 1.5,
      });
      expect(res.status).to.be.gte(400);
    });
  });

  describe('GET /admin/region-pricing', () => {
    it('should list all region pricing entries', async () => {
      const res = await request('GET', '/admin/region-pricing');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.gte(1);
    });
  });

  describe('GET /admin/region-pricing/:id', () => {
    it('should return a region pricing entry by id', async () => {
      const listRes = await request('GET', '/admin/region-pricing');
      const firstEntry = listRes.body[0];

      const res = await request('GET', `/admin/region-pricing/${firstEntry.id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', firstEntry.id);
      expect(res.body).to.have.property('fromRegion');
      expect(res.body).to.have.property('toRegion');
      expect(res.body).to.have.property('priceMultiplier');
    });

    it('should return 404 for a non-existent id', async () => {
      const res = await request(
        'GET',
        '/admin/region-pricing/f150d712-2053-4341-a2fb-8cb374069653',
      );
      expect(res.status).to.equal(404);
    });
  });

  describe('GET /admin/region-pricing/from/:region', () => {
    it('should return all region pricing entries for a given from region', async () => {
      const res = await request('GET', '/admin/region-pricing/from/EU');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((entry: any) => {
        expect(entry).to.have.property('fromRegion', 'EU');
      });
    });

    it('should return empty array for a region with no from pricing', async () => {
      const regionName = 'EmptyFromRegion_' + Date.now();
      await request('POST', '/admin/region', {name: regionName});

      const res = await request('GET', `/admin/region-pricing/from/${regionName}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(0);
    });
  });

  describe('GET /admin/region-pricing/to/:region', () => {
    it('should return all region pricing entries for a given to region', async () => {
      const res = await request('GET', '/admin/region-pricing/to/EU');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((entry: any) => {
        expect(entry).to.have.property('toRegion', 'EU');
      });
    });
  });
});

describe('Admin API - Country', () => {
  describe('POST /admin/country', () => {
    it('should create a new country', async () => {
      const regionName = 'CountryTestRegion_' + Date.now();
      await request('POST', '/admin/region', {name: regionName});

      const res = await request('POST', '/admin/country', {
        isoCode: 'ZZ',
        region: regionName,
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('isoCode', 'ZZ');
      expect(res.body).to.have.property('region', regionName);
    });

    it('should reject a country with a duplicate isoCode', async () => {
      const res = await request('POST', '/admin/country', {
        isoCode: 'US',
        region: 'Rest of World',
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a country with a non-existent region', async () => {
      const res = await request('POST', '/admin/country', {
        isoCode: 'YY',
        region: 'NonExistentRegion',
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a country when isoCode is missing', async () => {
      const res = await request('POST', '/admin/country', {
        region: 'EU',
      });
      expect(res.status).to.be.gte(400);
    });

    it('should reject a country when region is missing', async () => {
      const res = await request('POST', '/admin/country', {
        isoCode: 'XX',
      });
      expect(res.status).to.be.gte(400);
    });
  });

  describe('GET /admin/country', () => {
    it('should list countries with pagination', async () => {
      const res = await request('GET', '/admin/country?limit=10&offset=0');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('meta');
      expect(res.body).to.have.property('items');
      expect(res.body.meta).to.have.property('total');
      expect(res.body.meta).to.have.property('limit', 10);
      expect(res.body.meta).to.have.property('offset', 0);
      expect(res.body.items).to.be.an('array');
      expect(res.body.items.length).to.be.lte(10);
    });

    it('should return second page with offset', async () => {
      const page1 = await request('GET', '/admin/country?limit=5&offset=0');
      const page2 = await request('GET', '/admin/country?limit=5&offset=5');
      expect(page1.status).to.equal(200);
      expect(page2.status).to.equal(200);
      expect(page1.body.items).to.not.deep.equal(page2.body.items);
    });

    it('should have consistent total across pages', async () => {
      const page1 = await request('GET', '/admin/country?limit=5&offset=0');
      const page2 = await request('GET', '/admin/country?limit=5&offset=5');
      expect(page1.body.meta.total).to.equal(page2.body.meta.total);
    });
  });

  describe('GET /admin/country/by-iso/:isoCode', () => {
    it('should return a country by isoCode', async () => {
      const res = await request('GET', '/admin/country/by-iso-code/SE');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('isoCode', 'SE');
      expect(res.body).to.have.property('region');
    });

    it('should return 404 for a non-existent isoCode', async () => {
      const res = await request('GET', '/admin/country/by-iso/QQ');
      expect(res.status).to.equal(404);
    });
  });

  describe('GET /admin/country/by-region/:region', () => {
    it('should return all countries for a given region', async () => {
      const res = await request('GET', '/admin/country/by-region/EU');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.gte(1);
      res.body.forEach((country: any) => {
        expect(country).to.have.property('region', 'EU');
      });
    });

    it('should return empty array for a region with no countries', async () => {
      const regionName = 'EmptyCountryRegion_' + Date.now();
      await request('POST', '/admin/region', {name: regionName});

      const res = await request('GET', `/admin/country/by-region/${regionName}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(0);
    });
  });
});

describe('Admin API - No Update or Delete', () => {
  it('should not support PUT on /admin/region', async () => {
    const res = await request('PUT', '/admin/region', {name: 'EU'});
    expect(res.status).to.equal(404);
  });

  it('should not support DELETE on /admin/region/EU', async () => {
    const res = await request('DELETE', '/admin/region/EU');
    expect(res.status).to.equal(404);
  });

  it('should not support PUT on /admin/weightclass', async () => {
    const res = await request('PUT', '/admin/weightclass', {
      name: 'Small',
      lower: 0,
      upper: 10,
      price: 200,
    });
    expect(res.status).to.equal(404);
  });

  it('should not support DELETE on /admin/weightclass/Small', async () => {
    const res = await request('DELETE', '/admin/weightclass/Small');
    expect(res.status).to.equal(404);
  });
});

describe('Admin API - Weight Class Range Integrity', () => {
  it('should not allow a new weight class whose lower bound falls inside an existing range', async () => {
    const res = await request('POST', '/admin/weightclass', {
      name: 'PartialOverlap',
      lower: 20,
      upper: 30,
      price: 400,
    });
    expect(res.status).to.be.gte(400);
  });

  it('should allow a weight class that perfectly extends from the upper end', async () => {
    const listRes = await request('GET', '/admin/weightclass');
    const classes = listRes.body.sort((a: any, b: any) => a.upper - b.upper);
    const largest = classes[classes.length - 1];

    const res = await request('POST', '/admin/weightclass', {
      name: 'ExtendedMax_' + Date.now(),
      lower: largest.upper,
      upper: largest.upper + 1000,
      price: 10000,
      upperInclusive: true,
    });
    expect(res.status).to.equal(200);
  });
});
