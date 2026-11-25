import { z } from 'zod';

// Base User Document
const BaseUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.number(),
});

// Student Schema (Collection: students)
export const StudentSchema = BaseUserSchema.extend({
  role: z.literal('student'),
  rollNo: z.string().optional(),
  assignedBusId: z.string().optional(),
});
export type StudentDocument = z.infer<typeof StudentSchema>;

// Driver Schema (Collection: drivers)
export const DriverSchema = BaseUserSchema.extend({
  role: z.literal('driver'),
  currentBusId: z.string().nullable().optional(),
  licenseNumber: z.string().optional(),
});
export type DriverDocument = z.infer<typeof DriverSchema>;

// Admin Schema (Collection: admins)
export const AdminSchema = BaseUserSchema.extend({
  role: z.literal('admin'),
});
export type AdminDocument = z.infer<typeof AdminSchema>;

// Bus Schema (Collection: buses)
export const BusSchema = z.object({
  busId: z.string(),
  registrationNumber: z.string(),
  capacity: z.number().int().positive(),
  status: z.enum(['active', 'maintenance', 'inactive']),
  currentDriverId: z.string().nullable().optional(),
  currentRouteId: z.string().nullable().optional(),
});
export type BusDocument = z.infer<typeof BusSchema>;

// Stop Schema (Collection: routes -> stops subcollection or root collection)
// Assuming stops are a root collection that routes reference, or just embedded in route for now?
// The spec says "routes" and "stops" are distinct collections.
export const StopSchema = z.object({
  stopId: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export type StopDocument = z.infer<typeof StopSchema>;

// Route Schema (Collection: routes)
export const RouteSchema = z.object({
  routeId: z.string(),
  name: z.string(),
  busId: z.string().nullable().optional(),
  origin: z.string(),
  destination: z.string(),
  stops: z.array(z.string()), // Array of Stop IDs
});
export type RouteDocument = z.infer<typeof RouteSchema>;

// Settings Schema (Collection: settings)
export const SettingsSchema = z.object({
  maintenanceMode: z.boolean().default(false),
  academicYear: z.string().optional(),
});
export type SettingsDocument = z.infer<typeof SettingsSchema>;

// RTDB Live Location Schema (Path: live/{busId})
export const LiveLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  speed: z.number().nullable().optional(),
  heading: z.number().nullable().optional(),
  accuracy: z.number().nullable().optional(),
  updatedAt: z.number(),
  active: z.boolean(),
  driverId: z.string().optional(),
});
export type LiveLocation = z.infer<typeof LiveLocationSchema>;

export type UserRole = 'student' | 'driver' | 'admin';
export type AnyUserDocument = StudentDocument | DriverDocument | AdminDocument;
