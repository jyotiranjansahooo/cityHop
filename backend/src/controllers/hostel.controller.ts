import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Readable } from "stream";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

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

    if (!Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
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
      city,
      area,
      type,
      minRent,
      maxRent,
      page = "1",
      limit = "10",
    } = req.query;

    const filter: HostelFilter = {
      isActive: true,
    };

    if (typeof city === "string") {
      if (!Types.ObjectId.isValid(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      filter.city = new Types.ObjectId(city);
    }

    if (typeof area === "string") {
      if (!Types.ObjectId.isValid(area)) {
        res.status(400).json({
          success: false,
          message: "Invalid area ID",
        });
        return;
      }

      filter.area = new Types.ObjectId(area);
    }

    if (typeof type === "string") {
      if (!isValidHostelType(type)) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel type",
        });
        return;
      }

      filter.type = type;
    }

    const rentFilter: {
      $gte?: number;
      $lte?: number;
    } = {};

    if (typeof minRent === "string") {
      const minRentNumber = Number(minRent);

      if (!Number.isFinite(minRentNumber) || minRentNumber < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid minimum rent",
        });
        return;
      }

      rentFilter.$gte = minRentNumber;
    }

    if (typeof maxRent === "string") {
      const maxRentNumber = Number(maxRent);

      if (!Number.isFinite(maxRentNumber) || maxRentNumber < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid maximum rent",
        });
        return;
      }

      rentFilter.$lte = maxRentNumber;
    }

    if (
      rentFilter.$gte !== undefined &&
      rentFilter.$lte !== undefined &&
      rentFilter.$gte > rentFilter.$lte
    ) {
      res.status(400).json({
        success: false,
        message: "Minimum rent cannot be greater than maximum rent",
      });
      return;
    }

    if (rentFilter.$gte !== undefined || rentFilter.$lte !== undefined) {
      filter.monthlyRent = rentFilter;
    }

    const pageNumber = typeof page === "string" ? Number(page) : 1;

    const limitNumber = typeof limit === "string" ? Number(limit) : 10;

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
      return;
    }

    if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 50) {
      res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50",
      });
      return;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [hostels, total] = await Promise.all([
      Hostel.find(filter)
        .populate("city", "name state")
        .populate("area", "name")
        .populate("owner", "name email")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Hostel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },

      count: hostels.length,
      hostels,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get hostels");

    res.status(500).json({
      success: false,
      message: "Internal server error",
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
      _id: new Types.ObjectId(id),
      isActive: true,
    })
      .populate("city", "name state country")
      .populate("area", "name description latitude longitude")
      .populate("owner", "name email");

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get hostel details");

    res.status(500).json({
      success: false,
      message: "Internal server error",
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
        message: "Unauthorized",
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

    const isOwner = hostel.owner.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to update this hostel",
      });
      return;
    }

    const body = req.body as HostelBody;

    const {
      name,
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

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel name",
        });
        return;
      }

      hostel.name = name.trim();
    }

    if (type !== undefined) {
      if (typeof type !== "string" || !isValidHostelType(type)) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel type",
        });
        return;
      }

      hostel.type = type;
    }

    if (address !== undefined) {
      if (typeof address !== "string" || address.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel address",
        });
        return;
      }

      hostel.address = address.trim();
    }

    if (latitude !== undefined) {
      const latitudeNumber = Number(latitude);

      if (!Number.isFinite(latitudeNumber)) {
        res.status(400).json({
          success: false,
          message: "Invalid latitude",
        });
        return;
      }

      hostel.latitude = latitudeNumber;
    }

    if (longitude !== undefined) {
      const longitudeNumber = Number(longitude);

      if (!Number.isFinite(longitudeNumber)) {
        res.status(400).json({
          success: false,
          message: "Invalid longitude",
        });
        return;
      }

      hostel.longitude = longitudeNumber;
    }

    if (monthlyRent !== undefined) {
      const rentNumber = Number(monthlyRent);

      if (!Number.isFinite(rentNumber) || rentNumber < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid monthly rent",
        });
        return;
      }

      hostel.monthlyRent = rentNumber;
    }

    if (securityDeposit !== undefined) {
      const depositNumber = Number(securityDeposit);

      if (!Number.isFinite(depositNumber) || depositNumber < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid security deposit",
        });
        return;
      }

      hostel.securityDeposit = depositNumber;
    }

    if (amenities !== undefined) {
      if (!Array.isArray(amenities)) {
        res.status(400).json({
          success: false,
          message: "Amenities must be an array",
        });
        return;
      }

      const validAmenities = amenities.filter(
        (amenity): amenity is string => typeof amenity === "string",
      );

      if (validAmenities.length !== amenities.length) {
        res.status(400).json({
          success: false,
          message: "All amenities must be strings",
        });
        return;
      }

      hostel.amenities = validAmenities;
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        res.status(400).json({
          success: false,
          message: "Images must be an array",
        });
        return;
      }

      const validImages = images.filter(isUploadedImage);

      if (validImages.length !== images.length) {
        res.status(400).json({
          success: false,
          message: "Invalid image data",
        });
        return;
      }

      hostel.images = validImages;
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

    logger.info(
      {
        hostelId: hostel._id.toString(),
        updatedBy: req.user.id,
      },
      "Hostel updated successfully",
    );

    res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel,
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

    const { hostelId, imageId } = req.params;

    if (
      typeof hostelId !== "string" ||
      typeof imageId !== "string" ||
      !Types.ObjectId.isValid(hostelId) ||
      !Types.ObjectId.isValid(imageId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID or image ID",
      });
      return;
    }

    const hostel = await Hostel.findById(hostelId);

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

    const image = hostel.images.find(
      (item) => item._id !== undefined && item._id.toString() === imageId,
    );

    if (!image) {
      res.status(404).json({
        success: false,
        message: "Image not found",
      });
      return;
    }

    await cloudinary.uploader.destroy(image.publicId);

    hostel.images = hostel.images.filter(
      (item) => item._id === undefined || item._id.toString() !== imageId,
    );

    await hostel.save();

    logger.info(
      {
        hostelId: hostel._id.toString(),
        imageId,
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
        message: "Unauthorized",
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

    const isOwner = hostel.owner.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to delete this hostel",
      });
      return;
    }

    hostel.isActive = false;

    await hostel.save();

    logger.info(
      {
        hostelId: hostel._id.toString(),
        deletedBy: req.user.id,
      },
      "Hostel deactivated",
    );

    res.status(200).json({
      success: true,
      message: "Hostel deleted successfully",
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete hostel");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
