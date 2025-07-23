const swagger = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = 'swagger.json';
const endpointsFiles = ['./app.js']; 


const doc = {
  info: {
    title: 'Suppliers and Contracts API',
    description: 'A REST API for managing suppliers and their contracts, built with Node.js, Express, and MongoDB.',
    version: '1.0.0',
  },
  host: 'cse341-project2-jpoj.onrender.com',
    schemes: ['https'],
  tags: [
    {
      name: 'Suppliers',
      description: 'Operations related to suppliers',
    },
    {
      name: 'Contracts',
      description: 'Operations related to contracts',
    },
    {
      name: 'Home Page',
      description: 'Basic route for the API',
    },
  ],
  components: {
    schemas: {
      Supplier: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'The auto-generated ID' },
          name: { type: 'string', example: 'Global Logistics Inc.' },
          contactPerson: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'info@globallogistics.com' },
          phone: { type: 'string', example: '1-800-SUPPLIER' },
          address: { type: 'string', example: '123 Main St, Supply City' },
        },
        required: ['name'],
      },
      Contract: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'The auto-generated ID' },
          contractNumber: { type: 'number', example: 1001 },
          supplier: { type: 'string', description: 'ID of the associated supplier', example: '60c72b2f9b1e8e0015b6d5f0' },
          object: { type: 'string', example: 'Annual IT Support Agreement' },
          startDate: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00Z' },
          endDate: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59Z' },
          value: { type: 'number', format: 'float', example: 15000.00 },
          status: { type: 'string', enum: ['active', 'inactive', 'pending', 'expired'], example: 'active' },
        },
        required: ['contractNumber', 'supplier', 'object', 'startDate', 'endDate', 'value'],
      },
    },
    responses: {
      NotFound: {
        description: 'The specified resource was not found.',
        content: {
          'application/json': {
            schema: { type: 'object', properties: { message: { type: 'string', example: 'Resource not found' } } }
          }
        }
      },
      BadRequest: {
        description: 'Invalid input or missing required fields.',
        content: {
          'application/json': {
            schema: { type: 'object', properties: { message: { type: 'string', example: 'Missing required fields or invalid data.' } } }
          }
        }
      },
      InternalServerError: {
        description: 'Server error.',
        content: {
          'application/json': {
            schema: { type: 'object', properties: { message: { type: 'string', example: 'Internal server error.' } } }
          }
        }
      }
    }
  }
};

swagger(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});