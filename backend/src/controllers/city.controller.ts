import type { Request, Response } from "express";

import City from "../models/City.js";
import logger from "../utils/logger.js";
import { Types } from "mongoose";

export const createCity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({
        success: false,
        message: "City name is required",
      });
      return;
    }

    const normalizedName = name.trim();

    if (normalizedName.length < 2) {
      res.status(400).json({
        success: false,
        message: "City name must contain at least 2 characters",
      });
      return;
    }

    const existingCity = await City.findOne({
      name: normalizedName,
    });

    if (existingCity) {
      res.status(409).json({
        success: false,
        message: "City already exists",
      });
      return;
    }

    const city = await City.create({
      name: normalizedName,
    });

    logger.info(
      {
        cityId: city._id.toString(),
        cityName: city.name,
      },
      "City created",
    );

    res.status(201).json({
      success: true,
      message: "City created successfully",
      city,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create city");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCities = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cities = await City.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get cities");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCityById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid city ID",
      });
      return;
    }

    const city = await City.findOne({
      _id: new Types.ObjectId(id),
      isActive: true,
    });

    if (!city) {
      res.status(404).json({
        success: false,
        message: "City not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get city details");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
