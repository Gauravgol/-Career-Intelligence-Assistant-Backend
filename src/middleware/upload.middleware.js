import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const isValidExtension = /\.(pdf|txt|doc|docx)$/i.test(file.originalname);

        if (allowedMimeTypes.has(file.mimetype) || isValidExtension) {
            return cb(null, true);
        }

        return cb(
            new Error("Only PDF, DOC, DOCX and TXT files are allowed.")
        );
    }
});

export default upload;