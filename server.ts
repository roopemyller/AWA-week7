import router from "./src/index"
import express, {Express} from "express"
import morgan from "morgan"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001

app.use(express.json())

app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

app.use(express.static(path.join(__dirname, "../public")))

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self'");
    next();
})

app.use("/", router)

app.listen(port, () => {
    console.log("Server running")
})