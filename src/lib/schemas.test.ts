import { describe, it, expect } from 'vitest';
import { BusSchema, StudentSchema } from './schemas/index';

describe('Zod Schemas', () => {
  it('validates a correct Bus document', () => {
    const validBus = {
      busId: 'BUS001',
      registrationNumber: 'AP12AB1234',
      capacity: 50,
      status: 'active',
      currentDriverId: 'DRV001',
      currentRouteId: 'RT001',
    };
    expect(() => BusSchema.parse(validBus)).not.toThrow();
  });

  it('rejects invalid capacity', () => {
    const invalidBus = {
      busId: 'BUS001',
      registrationNumber: 'AP12AB1234',
      capacity: -5,
      status: 'active',
      currentDriverId: null,
      currentRouteId: null,
    };
    expect(() => BusSchema.parse(invalidBus)).toThrow();
  });

  it('validates a correct Student document', () => {
    const validStudent = {
      uid: 'STU001',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      createdAt: 1234567890,
      assignedBusId: 'BUS001',
    };
    expect(() => StudentSchema.parse(validStudent)).not.toThrow();
  });
});
