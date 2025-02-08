const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static("uploads"));
router.post("/", upload.single("profilePicture"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }
    return res.status(201).json({ message: "Arquivo enviado com sucesso.", imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;