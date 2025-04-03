const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.post("/upload", upload.single("video"), (req, res) => {
    res.json({ success: true, filename: req.file.filename });
});

app.get("/videos", (req, res) => {
    fs.readdir("./uploads/", (err, files) => {
        if (err) return res.status(500).json({ error: "Failed to read files" });
        res.json({ videos: files });
    });
});

app.get("/stream/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    res.sendFile(filePath);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
