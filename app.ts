// import node modules
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { spawn } from "child_process";

dotenv.config();

const app: express.Application = express();
const port: Number = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../static")));

// multer configs
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            String(Date.now()) + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/tiff"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error(
                "Only .png, .jpg, .jpeg and .tiff format allowed!"
            );
            err.name = "ExtensionError";
            return cb(err);
        }
    },
});

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
    res.render("index", {});
});

app.post("/upload", upload.single("image"), async (req: express.Request, res: express.Response) => {
    try {
        const file = req.file;
        if (!file) return res.redirect("/")
        // do something
        const pythonProcess = spawn("python", ["./script.py", String(file.path)]);
        pythonProcess.stdout.on("data", (data) => {
            res.render("result", { data });
        });
    } catch (error: any) {
        return res.redirect("/")
    }
});

app.listen(port, () => {
    console.log(`Web server running at port ${port}`);
});