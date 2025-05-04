import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import * as dotenv from 'dotenv';
const envPath = process.cwd() + '/.env.' + process.env.NODE_ENV;
dotenv.config({ path: envPath });

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  let createdInvoiceId: string;

  it('/POST /invoices', async () => {
    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send({
        customer: 'e2e-test',
        amount: 250,
        reference: `INV-${new Date().getTime()}`, // for unique reference
        date: new Date().toISOString(),
        items: [{ sku: `INV-${new Date().getTime()}`, qt: 3 }], // for unique sku
      })
      .expect(201);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.customer).toBe('e2e-test');
    createdInvoiceId = response.body.data._id;
  });

  it('/GET /invoices/:id', async () => {
    const response = await request(app.getHttpServer()).get(`/invoices/${createdInvoiceId}`).expect(200);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.customer).toBe('e2e-test');
  });

  it('/GET /invoices', async () => {
    const response = await request(app.getHttpServer()).get('/invoices').expect(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
