import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Readable } from "stream";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import User from "../models/User.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import Hostel, { type IHostel, type HostelType } from "../models/Hostel.js";
import City from "../models/City.js";
import Area from "../models/Area.js";
import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";

type UploadedImage = {
  url: string;
  publicId: string;
};

type HostelBody = {
  name?: unknown;
  city?: unknown;
  area?: unknown;
  type?: unknown;
  address?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  monthlyRent?: unknown;
  securityDeposit?: unknown;
  amenities?: unknown;
  images?: unknown;
  description?: unknown;
};

type HostelCreateData = {
  name: string;
  owner: Types.ObjectId;
  city: Types.ObjectId;
  area: Types.ObjectId;
  type: HostelType;
  address: string;
  latitude: number;
  longitude: number;
  monthlyRent: number;
  securityDeposit?: number;
  amenities: string[];
  images: UploadedImage[];
  description?: string;
};

type HostelFilter = {
  isActive?: boolean;
  city?: Types.ObjectId;
  area?: Types.ObjectId;
  type?: HostelType;
  owner?: Types.ObjectId;
  monthlyRent?: {
    $gte?: number;
    $lte?: number;
  };
};

const hostelTypes: readonly HostelType[] = ["boys", "girls", "co-living"];

const isValidHostelType = (value: string): value is HostelType => {
  return hostelTypes.includes(value as HostelType);
};

const isUploadedImage = (value: unknown): value is UploadedImage => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const image = value as {
    url?: unknown;
    publicId?: unknown;
  };

  return typeof image.url === "string" && typeof image.publicId === "string";
};

const uploadImageToCloudinary = (
  file: Express.Multer.File,
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cityhop/hostels",
        resource_type: "image",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined,
      ) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary did not return an upload result"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    const readableStream = new Readable();

    readableStream.push(file.buffer);
    readableStream.push(null);

    readableStream.pipe(uploadStream);
  });
};

export const uploadHostelImages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
      return;
    }

    if (req.files.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please select at least one image",
      });
      return;
    }

    const images = await Promise.all(req.files.map(uploadImageToCloudinary));

    logger.info(
      {
        imageCount: images.length,
      },
      "Hostel images uploaded successfully",
    );

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      count: images.length,
      images,
    });
  } catch (error) {
    logger.error({ error }, "Failed to upload hostel images");

    res.status(500).json({
      success: false,
      message: "Failed to upload images",
    });
  }
};

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

    if (!Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const owner = await User.findById(req.user.id).select("_id role isActive");

    if (!owner || owner.role !== "owner") {
      res.status(403).json({
        success: false,
        message: "Only owners can create hostels",
      });
      return;
    }

    if (!owner.isActive) {
      res.status(403).json({
        success: false,
        message: "Your owner account is inactive",
      });
      return;
    }

    const body = req.body as HostelBody;

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
    } = body;

    if (
      typeof name !== "string" ||
      typeof city !== "string" ||
      typeof area !== "string" ||
      typeof type !== "string" ||
      typeof address !== "string" ||
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

    if (name.trim().length === 0 || address.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Hostel name and address are required",
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

    if (!Types.ObjectId.isValid(area)) {
      res.status(400).json({
        success: false,
        message: "Invalid area ID",
      });
      return;
    }

    if (!isValidHostelType(type)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel type",
      });
      return;
    }

    const latitudeNumber = Number(latitude);
    const longitudeNumber = Number(longitude);
    const monthlyRentNumber = Number(monthlyRent);

    if (!Number.isFinite(latitudeNumber) || !Number.isFinite(longitudeNumber)) {
      res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
      return;
    }

    if (!Number.isFinite(monthlyRentNumber) || monthlyRentNumber < 0) {
      res.status(400).json({
        success: false,
        message: "Monthly rent must be a valid positive number",
      });
      return;
    }

    const cityId = new Types.ObjectId(city);
    const areaId = new Types.ObjectId(area);
    const ownerId = new Types.ObjectId(req.user.id);

    const cityExists = await City.findById(cityId);

    if (!cityExists || !cityExists.isActive) {
      res.status(404).json({
        success: false,
        message: "City not found or inactive",
      });
      return;
    }

    const areaExists = await Area.findOne({
      _id: areaId,
      city: cityId,
      isActive: true,
    });

    if (!areaExists) {
      res.status(400).json({
        success: false,
        message: "Area does not belong to the selected city",
      });
      return;
    }

    const hostelImages: UploadedImage[] = Array.isArray(images)
      ? images.filter(isUploadedImage)
      : [];

    const hostelAmenities: string[] = Array.isArray(amenities)
      ? amenities.filter(
          (amenity): amenity is string => typeof amenity === "string",
        )
      : [];

    const hostelData: HostelCreateData = {
      name: name.trim(),
      owner: ownerId,
      city: cityId,
      area: areaId,
      type,
      address: address.trim(),
      latitude: latitudeNumber,
      longitude: longitudeNumber,
      monthlyRent: monthlyRentNumber,
      amenities: hostelAmenities,
      images: hostelImages,
    };

    if (
      securityDeposit !== undefined &&
      securityDeposit !== null &&
      securityDeposit !== ""
    ) {
      const depositNumber = Number(securityDeposit);

      if (!Number.isFinite(depositNumber) || depositNumber < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid security deposit",
        });
        return;
      }

      hostelData.securityDeposit = depositNumber;
    }

    if (typeof description === "string" && description.trim().length > 0) {
      hostelData.description = description.trim();
    }

    const hostel = await Hostel.create(hostelData);

    logger.info(
      {
        hostelId: hostel._id.toString(),
        ownerId: req.user.id,
      },
      "Hostel created successfully",
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

export const getHostels = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      search,
      city,
      area,
      type,
      minRent,
      maxRent,
      page = "1",
      limit = "10",
    } = req.query;

    const filters: Record<string, unknown> = {
      isActive: true,
    };

    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filters.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
      ];
    }

    if (typeof city === "string" && city.trim()) {
      if (!Types.ObjectId.isValid(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      filters.city = city;
    }

    if (typeof area === "string" && area.trim()) {
      if (!Types.ObjectId.isValid(area)) {
        res.status(400).json({
          success: false,
          message: "Invalid area ID",
        });
        return;
      }

      filters.area = area;
    }

    if (typeof type === "string" && type.trim()) {
      const validTypes: HostelType[] = ["boys", "girls", "co-living"];

      if (!validTypes.includes(type as HostelType)) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel type",
        });
        return;
      }

      filters.type = type;
    }

    let minimumRent: number | undefined;
    let maximumRent: number | undefined;

    if (typeof minRent === "string" && minRent.trim()) {
      minimumRent = Number(minRent);

      if (!Number.isFinite(minimumRent) || minimumRent < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid minimum rent",
        });
        return;
      }

      filters.monthlyRent = {
        $gte: minimumRent,
      };
    }

    if (typeof maxRent === "string" && maxRent.trim()) {
      maximumRent = Number(maxRent);

      if (!Number.isFinite(maximumRent) || maximumRent < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid maximum rent",
        });
        return;
      }

      if (minimumRent !== undefined && maximumRent < minimumRent) {
        res.status(400).json({
          success: false,
          message: "Maximum rent cannot be less than minimum rent",
        });
        return;
      }

      filters.monthlyRent = {
        ...(typeof filters.monthlyRent === "object" &&
        filters.monthlyRent !== null
          ? filters.monthlyRent
          : {}),
        $lte: maximumRent,
      };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
      return;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [hostels, total] = await Promise.all([
      Hostel.find(filters)
        .populate("city", "name state")
        .populate("area", "name")
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Hostel.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      data: hostels,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch hostels");

    res.status(500).json({
      success: false,
      message: "Failed to fetch hostels",
    });
  }
};

export const getHostelById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    const hostel = await Hostel.findOne({
      _id: id,
      isActive: true,
    })
      .populate("city", "name state country")
      .populate("area", "name description latitude longitude")
      .populate("owner", "name email")
      .lean();

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: hostel,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch hostel details");

    res.status(500).json({
      success: false,
      message: "Failed to fetch hostel details",
    });
  }
};

export const updateHostel = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    if (hostel.owner.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to modify this hostel",
      });
      return;
    }

    const owner = await User.findById(req.user.id).select("_id role isActive");

    if (!owner || owner.role !== "owner") {
      res.status(403).json({
        success: false,
        message: "Only owners can modify hostels",
      });
      return;
    }

    if (!owner.isActive) {
      res.status(403).json({
        success: false,
        message: "Your owner account is inactive",
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
      description,
    } = req.body as {
      name?: unknown;
      city?: unknown;
      area?: unknown;
      type?: unknown;
      address?: unknown;
      latitude?: unknown;
      longitude?: unknown;
      monthlyRent?: unknown;
      securityDeposit?: unknown;
      amenities?: unknown;
      description?: unknown;
    };

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 3) {
        res.status(400).json({
          success: false,
          message: "Hostel name must contain at least 3 characters",
        });
        return;
      }

      hostel.name = name.trim();
    }

    if (city !== undefined) {
      if (typeof city !== "string" || !Types.ObjectId.isValid(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      const cityExists = await City.findById(city);

      if (!cityExists || !cityExists.isActive) {
        res.status(400).json({
          success: false,
          message: "City is not available",
        });
        return;
      }

      hostel.city = new Types.ObjectId(city);
    }

    if (area !== undefined) {
      if (typeof area !== "string" || !Types.ObjectId.isValid(area)) {
        res.status(400).json({
          success: false,
          message: "Invalid area ID",
        });
        return;
      }

      const areaExists = await Area.findById(area);

      if (!areaExists || !areaExists.isActive) {
        res.status(400).json({
          success: false,
          message: "Area is not available",
        });
        return;
      }

      const selectedCity =
        city !== undefined ? new Types.ObjectId(city) : hostel.city;

      if (areaExists.city.toString() !== selectedCity.toString()) {
        res.status(400).json({
          success: false,
          message: "Area does not belong to the selected city",
        });
        return;
      }

      hostel.area = new Types.ObjectId(area);
    }

    if (type !== undefined) {
      if (type !== "boys" && type !== "girls" && type !== "co-living") {
        res.status(400).json({
          success: false,
          message: "Invalid hostel type",
        });
        return;
      }

      hostel.type = type;
    }

    if (address !== undefined) {
      if (typeof address !== "string" || address.trim().length < 5) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel address",
        });
        return;
      }

      hostel.address = address.trim();
    }

    if (latitude !== undefined) {
      if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
        res.status(400).json({
          success: false,
          message: "Invalid latitude",
        });
        return;
      }

      hostel.latitude = latitude;
    }

    if (longitude !== undefined) {
      if (
        typeof longitude !== "number" ||
        longitude < -180 ||
        longitude > 180
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid longitude",
        });
        return;
      }

      hostel.longitude = longitude;
    }

    if (monthlyRent !== undefined) {
      if (typeof monthlyRent !== "number" || monthlyRent <= 0) {
        res.status(400).json({
          success: false,
          message: "Monthly rent must be greater than 0",
        });
        return;
      }

      hostel.monthlyRent = monthlyRent;
    }

    if (securityDeposit !== undefined) {
      if (typeof securityDeposit !== "number" || securityDeposit < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid security deposit",
        });
        return;
      }

      hostel.securityDeposit = securityDeposit;
    }

    if (amenities !== undefined) {
      if (
        !Array.isArray(amenities) ||
        !amenities.every((item): item is string => typeof item === "string")
      ) {
        res.status(400).json({
          success: false,
          message: "Amenities must be an array of strings",
        });
        return;
      }

      hostel.amenities = amenities;
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        res.status(400).json({
          success: false,
          message: "Description must be a string",
        });
        return;
      }

      hostel.description = description.trim();
    }

    await hostel.save();

    const updatedHostel = await Hostel.findById(hostel._id)
      .populate("city", "name state country")
      .populate("area", "name description latitude longitude")
      .populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    logger.error({ error }, "Failed to update hostel");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteHostelImage = async (
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

    const { id } = req.params;
    const { publicId } = req.body as { publicId?: unknown };

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    if (typeof publicId !== "string" || publicId.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Image public ID is required",
      });
      return;
    }

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    const isOwner = hostel.owner.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to modify this hostel",
      });
      return;
    }

    if (isOwner) {
      const owner = await User.findById(req.user.id).select(
        "_id role isActive",
      );

      if (!owner || owner.role !== "owner") {
        res.status(403).json({
          success: false,
          message: "Only owners can modify hostel images",
        });
        return;
      }

      if (!owner.isActive) {
        res.status(403).json({
          success: false,
          message: "Your owner account is inactive",
        });
        return;
      }
    }

    const imageExists = hostel.images.some(
      (image) => image.publicId === publicId,
    );

    if (!imageExists) {
      res.status(404).json({
        success: false,
        message: "Image not found",
      });
      return;
    }

    await cloudinary.uploader.destroy(publicId);

    hostel.images = hostel.images.filter(
      (image) => image.publicId !== publicId,
    );

    await hostel.save();

    logger.info(
      {
        hostelId: hostel._id.toString(),
        publicId,
        userId: req.user.id,
      },
      "Hostel image deleted",
    );

    res.status(200).json({
      success: true,
      message: "Hostel image deleted successfully",
      images: hostel.images,
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete hostel image");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteHostel = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    if (hostel.owner.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to modify this hostel",
      });
      return;
    }

    const owner = await User.findById(req.user.id).select("_id role isActive");

    if (!owner || owner.role !== "owner") {
      res.status(403).json({
        success: false,
        message: "Only owners can deactivate hostels",
      });
      return;
    }

    if (!owner.isActive) {
      res.status(403).json({
        success: false,
        message: "Your owner account is inactive",
      });
      return;
    }

    if (!hostel.isActive) {
      res.status(400).json({
        success: false,
        message: "Hostel is already inactive",
      });
      return;
    }

    hostel.isActive = false;

    await hostel.save();

    res.status(200).json({
      success: true,
      message: "Hostel deactivated successfully",
    });
  } catch (error) {
    logger.error({ error }, "Failed to deactivate hostel");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
