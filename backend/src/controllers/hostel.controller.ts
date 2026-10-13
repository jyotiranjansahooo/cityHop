import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Readable } from "node:stream";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import User from "../models/User.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import Hostel, { type HostelType } from "../models/Hostel.js";
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
  description?: unknown;
};

type HostelFilters = {
  isActive: boolean;
  city?: Types.ObjectId;
  area?: Types.ObjectId;
  type?: HostelType;
  monthlyRent?: {
    $gte?: number;
    $lte?: number;
  };
  $or?: Array<Record<string, RegExp>>;
};

const hostelTypes: readonly HostelType[] = ["boys", "girls", "co-living"];

const isValidHostelType = (value: string): value is HostelType =>
  hostelTypes.includes(value as HostelType);

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && Types.ObjectId.isValid(value);

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const uploadImageToCloudinary = (
  file: Express.Multer.File,
): Promise<UploadedImage> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
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

    const readable = new Readable();
    readable.push(file.buffer);
    readable.push(null);
    readable.pipe(stream);
  });

const getAuthenticatedUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }

  return User.findById(userId).select("_id role isActive");
};

const canManageHostel = (
  hostelOwnerId: Types.ObjectId,
  userId: string,
  role: string,
): boolean => role === "admin" || hostelOwnerId.toString() === userId;

const removeCloudinaryImages = async (
  images: UploadedImage[],
): Promise<void> => {
  await Promise.allSettled(
    images.map((image) => cloudinary.uploader.destroy(image.publicId)),
  );
};

/**
 * POST /api/hostels
 * Create a hostel listing.
 */
export const createHostel = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  let uploadedImages: UploadedImage[] = [];

  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await getAuthenticatedUser(req.user.id);

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive or unavailable",
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

    if (name.trim().length < 3 || address.trim().length < 5) {
      res.status(400).json({
        success: false,
        message: "Enter a valid hostel name and address",
      });
      return;
    }

    if (!isObjectId(city) || !isObjectId(area)) {
      res.status(400).json({
        success: false,
        message: "Invalid city or area ID",
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
    const rentNumber = Number(monthlyRent);

    if (
      !Number.isFinite(latitudeNumber) ||
      latitudeNumber < -90 ||
      latitudeNumber > 90 ||
      !Number.isFinite(longitudeNumber) ||
      longitudeNumber < -180 ||
      longitudeNumber > 180
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
      return;
    }

    if (!Number.isFinite(rentNumber) || rentNumber <= 0) {
      res.status(400).json({
        success: false,
        message: "Monthly rent must be greater than 0",
      });
      return;
    }

    const cityId = new Types.ObjectId(city);
    const areaId = new Types.ObjectId(area);

    const [cityExists, areaExists] = await Promise.all([
      City.findOne({ _id: cityId, isActive: true }),
      Area.findOne({
        _id: areaId,
        city: cityId,
        isActive: true,
      }),
    ]);

    if (!cityExists) {
      res.status(404).json({
        success: false,
        message: "City not found or inactive",
      });
      return;
    }

    if (!areaExists) {
      res.status(400).json({
        success: false,
        message: "Area does not belong to the selected city",
      });
      return;
    }

    let depositNumber: number | undefined;

    if (
      securityDeposit !== undefined &&
      securityDeposit !== null &&
      securityDeposit !== ""
    ) {
      depositNumber = Number(securityDeposit);

      if (!Number.isFinite(depositNumber) || depositNumber < 0) {
        res.status(400).json({
          success: false,
          message: "Invalid security deposit",
        });
        return;
      }
    }

    if (
      amenities !== undefined &&
      (!Array.isArray(amenities) ||
        !amenities.every(
          (item: unknown) => typeof item === "string" && item.trim().length > 0,
        ))
    ) {
      res.status(400).json({
        success: false,
        message: "Amenities must be an array of non-empty strings",
      });
      return;
    }

    if (description !== undefined && typeof description !== "string") {
      res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
      return;
    }

    /*
     * Images are uploaded through POST /:id/images.
     * Do not accept arbitrary Cloudinary public IDs from the client.
     */
    const hostel = await Hostel.create({
      name: name.trim(),
      owner: user._id,
      city: cityId,
      area: areaId,
      type,
      address: address.trim(),
      latitude: latitudeNumber,
      longitude: longitudeNumber,
      monthlyRent: rentNumber,
      ...(depositNumber !== undefined
        ? { securityDeposit: depositNumber }
        : {}),
      amenities: Array.isArray(amenities)
        ? amenities.map((item: string) => item.trim())
        : [],
      images: [],
      ...(typeof description === "string" && description.trim().length > 0
        ? { description: description.trim() }
        : {}),
    });

    logger.info(
      { hostelId: hostel._id.toString(), userId: req.user.id },
      "Hostel created successfully",
    );

    res.status(201).json({
      success: true,
      message: "Hostel created successfully",
      hostel,
    });
  } catch (error: unknown) {
    if (uploadedImages.length > 0) {
      await removeCloudinaryImages(uploadedImages);
    }

    logger.error(
      {
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : error,
      },
      "Failed to create hostel",
    );

    res.status(500).json({
      success: false,
      message: "Failed to create hostel",
    });
  }
};

/**
 * GET /api/hostels
 * Public listing with filters and pagination.
 */
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

    const filters: HostelFilters = { isActive: true };

    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(
        escapeRegex(search.trim().slice(0, 100)),
        "i",
      );

      filters.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
      ];
    }

    if (city !== undefined) {
      if (!isObjectId(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      filters.city = new Types.ObjectId(city);
    }

    if (area !== undefined) {
      if (!isObjectId(area)) {
        res.status(400).json({
          success: false,
          message: "Invalid area ID",
        });
        return;
      }

      filters.area = new Types.ObjectId(area);
    }

    if (type !== undefined) {
      if (typeof type !== "string" || !isValidHostelType(type)) {
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

    if (minRent !== undefined) {
      minimumRent = Number(minRent);

      if (
        typeof minRent !== "string" ||
        minRent.trim() === "" ||
        !Number.isFinite(minimumRent) ||
        minimumRent < 0
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid minimum rent",
        });
        return;
      }
    }

    if (maxRent !== undefined) {
      maximumRent = Number(maxRent);

      if (
        typeof maxRent !== "string" ||
        maxRent.trim() === "" ||
        !Number.isFinite(maximumRent) ||
        maximumRent < 0
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid maximum rent",
        });
        return;
      }
    }

    if (
      minimumRent !== undefined &&
      maximumRent !== undefined &&
      maximumRent < minimumRent
    ) {
      res.status(400).json({
        success: false,
        message: "Maximum rent cannot be less than minimum rent",
      });
      return;
    }

    if (minimumRent !== undefined || maximumRent !== undefined) {
      filters.monthlyRent = {
        ...(minimumRent !== undefined ? { $gte: minimumRent } : {}),
        ...(maximumRent !== undefined ? { $lte: maximumRent } : {}),
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
        .populate("owner", "name")
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
  } catch (error: unknown) {
    logger.error({ error }, "Failed to fetch hostels");

    res.status(500).json({
      success: false,
      message: "Failed to fetch hostels",
    });
  }
};

/**
 * GET /api/hostels/:id
 * Public hostel details.
 */
export const getHostelById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isObjectId(id)) {
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
      .populate("owner", "name")
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
  } catch (error: unknown) {
    logger.error({ error }, "Failed to fetch hostel details");

    res.status(500).json({
      success: false,
      message: "Failed to fetch hostel details",
    });
  }
};

/**
 * PATCH /api/hostels/:id
 * The hostel owner or an admin may update a listing.
 */
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

    if (!isObjectId(id)) {
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

    if (!canManageHostel(hostel.owner, req.user.id, req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to modify this hostel",
      });
      return;
    }

    const user = await getAuthenticatedUser(req.user.id);

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive or unavailable",
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
      description,
    } = body;

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

    let selectedCityId = hostel.city;

    if (city !== undefined) {
      if (!isObjectId(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      const cityExists = await City.findOne({
        _id: city,
        isActive: true,
      });

      if (!cityExists) {
        res.status(400).json({
          success: false,
          message: "City is not available",
        });
        return;
      }

      selectedCityId = new Types.ObjectId(city);
      hostel.city = selectedCityId;
    }

    if (area !== undefined) {
      if (!isObjectId(area)) {
        res.status(400).json({
          success: false,
          message: "Invalid area ID",
        });
        return;
      }

      const areaExists = await Area.findOne({
        _id: area,
        city: selectedCityId,
        isActive: true,
      });

      if (!areaExists) {
        res.status(400).json({
          success: false,
          message: "Area does not belong to the selected city",
        });
        return;
      }

      hostel.area = new Types.ObjectId(area);
    } else if (city !== undefined) {
      const currentArea = await Area.findOne({
        _id: hostel.area,
        city: selectedCityId,
        isActive: true,
      });

      if (!currentArea) {
        res.status(400).json({
          success: false,
          message: "Select an area belonging to the new city",
        });
        return;
      }
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
      if (
        typeof latitude !== "number" ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
      ) {
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
        !Number.isFinite(longitude) ||
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
      if (
        typeof monthlyRent !== "number" ||
        !Number.isFinite(monthlyRent) ||
        monthlyRent <= 0
      ) {
        res.status(400).json({
          success: false,
          message: "Monthly rent must be greater than 0",
        });
        return;
      }

      hostel.monthlyRent = monthlyRent;
    }

    if (securityDeposit !== undefined) {
      if (
        typeof securityDeposit !== "number" ||
        !Number.isFinite(securityDeposit) ||
        securityDeposit < 0
      ) {
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
        !amenities.every(
          (item: unknown) => typeof item === "string" && item.trim().length > 0,
        )
      ) {
        res.status(400).json({
          success: false,
          message: "Amenities must be an array of non-empty strings",
        });
        return;
      }

      hostel.amenities = amenities.map((item: string) => item.trim());
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
      .populate("owner", "name");

    res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error: unknown) {
    logger.error({ error }, "Failed to update hostel");

    res.status(500).json({
      success: false,
      message: "Failed to update hostel",
    });
  }
};

/**
 * POST /api/hostels/:id/images
 * Upload and persist images for a hostel.
 */
export const uploadHostelImages = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  let uploadedImages: UploadedImage[] = [];

  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;

    if (!isObjectId(id)) {
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

    if (!canManageHostel(hostel.owner, req.user.id, req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to upload images to this hostel",
      });
      return;
    }

    const user = await getAuthenticatedUser(req.user.id);

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive or unavailable",
      });
      return;
    }

    const files = req.files;

    if (!files || !Array.isArray(files) || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please select at least one image",
      });
      return;
    }

    if (files.length > 10) {
      res.status(400).json({
        success: false,
        message: "You can upload a maximum of 10 images per request",
      });
      return;
    }

    const existingPublicIds = new Set(
      hostel.images.map((image) => image.publicId),
    );

    uploadedImages = await Promise.all(files.map(uploadImageToCloudinary));

    const newImages = uploadedImages.filter(
      (image) => !existingPublicIds.has(image.publicId),
    );

    hostel.images.push(...newImages);
    await hostel.save();

    logger.info(
      {
        hostelId: hostel._id.toString(),
        imageCount: newImages.length,
      },
      "Hostel images uploaded successfully",
    );

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      count: newImages.length,
      images: hostel.images,
    });
  } catch (error: unknown) {
    await removeCloudinaryImages(uploadedImages);

    logger.error({ error }, "Failed to upload hostel images");

    res.status(500).json({
      success: false,
      message: "Failed to upload images",
    });
  }
};

/**
 * DELETE /api/hostels/:id/images
 * JSON body: { "publicId": "cityhop/hostels/..." }
 */
export const deleteHostelImage = async (
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
    const { publicId } = req.body as { publicId?: unknown };

    if (!isObjectId(id)) {
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

    if (!canManageHostel(hostel.owner, req.user.id, req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to delete images from this hostel",
      });
      return;
    }

    const user = await getAuthenticatedUser(req.user.id);

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive or unavailable",
      });
      return;
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

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      res.status(502).json({
        success: false,
        message: "Cloudinary could not delete the image",
      });
      return;
    }

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
  } catch (error: unknown) {
    logger.error({ error }, "Failed to delete hostel image");

    res.status(500).json({
      success: false,
      message: "Failed to delete hostel image",
    });
  }
};

/**
 * DELETE /api/hostels/:id
 * Soft-delete a hostel listing.
 */
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

    if (!isObjectId(id)) {
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

    if (!canManageHostel(hostel.owner, req.user.id, req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to deactivate this hostel",
      });
      return;
    }

    const user = await getAuthenticatedUser(req.user.id);

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive or unavailable",
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

    logger.info(
      { hostelId: hostel._id.toString(), userId: req.user.id },
      "Hostel deactivated successfully",
    );

    res.status(200).json({
      success: true,
      message: "Hostel deactivated successfully",
    });
  } catch (error: unknown) {
    logger.error({ error }, "Failed to deactivate hostel");

    res.status(500).json({
      success: false,
      message: "Failed to deactivate hostel",
    });
  }
};
