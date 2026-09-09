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

    if (!name || !city) {
      res.status(400).json({
        success: false,
        message: "Area name and city are required",
      });
      return;
    }

    if (typeof name !== "string") {
      res.status(400).json({
        success: false,
        message: "Area name must be a string",
      });
      return;
    }

    const normalizedName = name.trim();

    if (normalizedName.length < 2) {
      res.status(400).json({
        success: false,
        message: "Area name must contain at least 2 characters",
      });
      return;
    }

    const cityExists = await City.findOne({
      _id: city,
      isActive: true,
    });

    if (!cityExists) {
      res.status(404).json({
        success: false,
        message: "City not found or inactive",
      });
      return;
    }

    const existingArea = await Area.findOne({
      name: normalizedName,
      city,
    });

    if (existingArea) {
      res.status(409).json({
        success: false,
        message: "Area already exists in this city",
      });
      return;
    }

    const area = await Area.create({
      name: normalizedName,
      city,
      description:
        typeof description === "string" ? description.trim() : undefined,
      latitude: latitude !== undefined ? Number(latitude) : undefined,
      longitude: longitude !== undefined ? Number(longitude) : undefined,
    });

    logger.info(
      {
        areaId: area._id.toString(),
        cityId: city,
        areaName: area.name,
      },
      "Area created",
    );

    res.status(201).json({
      success: true,
      message: "Area created successfully",
      area,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create area");

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