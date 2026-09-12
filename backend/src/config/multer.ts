import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(
__dirname,
"../../uploads/hostels",
);

if (!fs.existsSync(uploadDirectory)) {
fs.mkdirSync(uploadDirectory, {
recursive: true,
});
}

const storage = multer.diskStorage({
destination: (
_req,
_file,
cb,
) => {
cb(null, uploadDirectory);
},

filename: (
_req,
file,
cb,
) => {
const extension = path.extname(
file.originalname,
);


const fileName = `${randomUUID()}${extension}`;

cb(null, fileName);


},
});

const fileFilter: multer.Options["fileFilter"] = (
_req,
file,
cb,
) => {
const allowedMimeTypes = [
"image/jpeg",
"image/jpg",
"image/png",
"image/webp",
];

if (
allowedMimeTypes.includes(file.mimetype)
) {
cb(null, true);
} else {
cb(
new Error(
"Only JPEG, PNG and WebP images are allowed",
),
);
}
};

const upload = multer({
storage,

limits: {
fileSize: 5 * 1024 * 1024,
},

fileFilter,
});

export default upload;
