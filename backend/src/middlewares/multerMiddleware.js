import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// File filter function to accept only jpeg, png, and csv files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "text/csv"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and CSV files are allowed"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
});

export { upload };
