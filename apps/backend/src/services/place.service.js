import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

class PlaceService {
  static async createPlace(payload) {
    const { name, location } = payload;
    const existing = await prisma.place.findFirst({
      where: {
        name,
        location,
      },
    });

    if (existing) {
      throw ApiError.conflict("Place already exists");
    }

    return await prisma.place.create({
      data: payload,
    });
  }

  static async getAllPlaces() {
    return await prisma.place.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPlaceById(id) {
    const place = await prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      throw ApiError.notFound("Place not found");
    }

    return place;
  }

  static async updatePlace(id, payload) {
    const existing = await prisma.place.findUnique({
      where: { id },
    });

    if (!existing) {
      throw ApiError.notFound("Place not found");
    }

    const isSame =
      (payload.name ?? existing.name) === existing.name &&
      (payload.location ?? existing.location) === existing.location &&
      (payload.latitude ?? existing.latitude) === existing.latitude &&
      (payload.longitude ?? existing.longitude) === existing.longitude &&
      (payload.shortDescription ?? existing.shortDescription) ===
        existing.shortDescription &&
      (payload.description ?? existing.description) === existing.description;

    if (isSame) {
      throw ApiError.badRequest("Already updated");
    }

    if (payload.name || payload.location) {
      const duplicate = await prisma.place.findFirst({
        where: {
          name: payload.name ?? existing.name,
          location: payload.location ?? existing.location,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw ApiError.conflict("Place already exists");
      }
    }

    return await prisma.place.update({
      where: { id },
      data: payload,
    });
  }

  static async deletePlace(id) {
    const existing = await prisma.place.findUnique({
      where: { id },
    });

    if (!existing) {
      throw ApiError.notFound("Place not found");
    }

    await prisma.place.delete({
      where: { id },
    });

    return true;
  }
}

export default PlaceService;
