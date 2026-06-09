import { z } from "zod";

class PlaceValidation {
  static get create() {
    return z.object({
      name: z.string().min(2, "Name required"),
      location: z.string().min(2, "Location required"),
      shortDescription: z.string().min(150).optional(),
      description: z.string().min(250).optional(),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    });
  }

  static get update() {
    return z.object({
      name: z.string().min(2).optional(),
      location: z.string().min(2, "Location required").optional(),
      shortDescription: z.string().min(150).optional(),
      description: z.string().min(250).optional(),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
    });
  }
}

export default PlaceValidation;
