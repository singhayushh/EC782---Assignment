// import node modules
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

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
    }
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
    res.render("index", {  });
});

app.post("/upload", upload.single("image"), (req: express.Request, res: express.Response) => {
    const file = req.body.file;
    // do something
    res.render("result", {  });
});

app.listen(port, () => {
    console.log(`Web server running at port ${port}`);
});