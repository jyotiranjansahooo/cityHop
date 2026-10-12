import type { Request, Response } from "express";

import Area from "../models/Area.js";
import City from "../models/City.js";
import logger from "../utils/logger.js";
import { Types } from "mongoose";

export const createArea = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, city, description, latitude, longitude } = req.body;

    if (typeof name !== "string" || typeof city !== "string") {
      res.status(400).json({
        success: false,
        message: "Area name and city ID are required",
      });
      return;
    }

    const normalizedName = name.trim();

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      res.status(400).json({
        success: false,
        message: "Area name must contain 2 to 100 characters",
      });
      return;
    }

    if (!Types.ObjectId.isValid(city)) {
      res.status(400).json({
        success: false,
        message: "Invalid city ID",
      });
      return;
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length > 500)
    ) {
      res.status(400).json({
        success: false,
        message: "Description must be a string of at most 500 characters",
      });
      return;
    }

    const parseCoordinate = (
      value: unknown,
      minimum: number,
      maximum: number,
    ): number | undefined | null => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }

      if (typeof value !== "number" && typeof value !== "string") {
        return null;
      }

      if (typeof value === "string" && value.trim() === "") {
        return null;
      }

      const parsed = Number(value);

      if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) {
        return null;
      }

      return parsed;
    };

    const parsedLatitude = parseCoordinate(latitude, -90, 90);
    const parsedLongitude = parseCoordinate(longitude, -180, 180);

    if (parsedLatitude === null || parsedLongitude === null) {
      res.status(400).json({
        success: false,
        message: "Latitude or longitude is invalid",
      });
      return;
    }

    const cityId = new Types.ObjectId(city);

    const cityExists = await City.findOne({
      _id: cityId,
      isActive: true,
    }).select("_id");

    if (!cityExists) {
      res.status(404).json({
        success: false,
        message: "City not found or inactive",
      });
      return;
    }

    const area = await Area.create({
      name: normalizedName,
      city: cityId,
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : undefined,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    });

    res.status(201).json({
      success: true,
      message: "Area created successfully",
      area,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "Area already exists in this city",
      });
      return;
    }

    logger.error(
      {
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : error,
      },
      "Failed to create area",
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAreasByCity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cityId = req.params.cityId;

    if (typeof cityId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid city ID",
      });
      return;
    }

    if (!Types.ObjectId.isValid(cityId)) {
      res.status(400).json({
        success: false,
        message: "Invalid city ID",
      });
      return;
    }

    const areas = await Area.find({
      city: new Types.ObjectId(cityId),
      isActive: true,
    }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: areas.length,
      areas,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get areas");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
