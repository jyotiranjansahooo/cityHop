import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import Hostel from "../models/Hostel.js";
import City from "../models/City.js";
import Area from "../models/Area.js";
import logger from "../utils/logger.js";

export const createHostel = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const {
      name,
      city,
      area,
      type,
      address,
      latitude,
      longitude,
      monthlyRent,
      securityDeposit,
      amenities,
      images,
      description,
    } = req.body;

    if (
      !name ||
      !city ||
      !area ||
      !type ||
      !address ||
      latitude === undefined ||
      longitude === undefined ||
      monthlyRent === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Required hostel information is missing",
      });
      return;
    }

    const cityExists = await City.findById(city);

    if (!cityExists || !cityExists.isActive) {
      res.status(404).json({
        success: false,
        message: "City not found or inactive",
      });
      return;
    }

    const areaExists = await Area.findOne({
      _id: area,
      city,
      isActive: true,
    });

    if (!areaExists) {
      res.status(400).json({
        success: false,
        message: "Area does not belong to the selected city",
      });
      return;
    }

    const hostelData: {
      name: string;
      owner: string;
      city: typeof city;
      area: typeof area;
      type: typeof type;
      address: string;
      latitude: number;
      longitude: number;
      monthlyRent: number;
      securityDeposit?: number;
      amenities: string[];
      images: string[];
      description?: string;
    } = {
      name: name.trim(),
      owner: req.user.id,
      city,
      area,
      type,
      address: address.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      monthlyRent: Number(monthlyRent),
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
    };

    if (securityDeposit !== undefined) {
      hostelData.securityDeposit = Number(securityDeposit);
    }

    if (typeof description === "string") {
      hostelData.description = description.trim();
    }

    const hostel = await Hostel.create(hostelData);

    logger.info(
      {
        hostelId: hostel._id.toString(),
        ownerId: req.user.id,
      },
      "Hostel created",
    );

    res.status(201).json({
      success: true,
      message: "Hostel created successfully",
      hostel,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create hostel");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
