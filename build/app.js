"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import node modules
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 3000);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../static")));
// multer configs
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/tiff") {
            cb(null, true);
        }
        else {
            cb(null, false);
            const err = new Error("Only .png, .jpg, .jpeg and .tiff format allowed!");
            err.name = "ExtensionError";
            return cb(err);
        }
    },
});
// Routes
app.get("/", (req, res) => {
    res.render("index", {});
});
app.post("/upload", upload.single("image"), (req, res) => {
    const file = req.body.file;
    // do something
    res.render("result", {});
});
app.listen(port, () => {
    console.log(`SleepyHead server running at port ${port}`);
});
