
import express from "express";
import routes from "./routes";
import ErrorHandler from "./utils/ErrorHandler";
import cors from "cors";
// TODO error middleware

const app = express();

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)}ms`
    );
  });

  next();
});

app.use(cors({
  origin: [
    'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173', 'http://192.168.0.101:4173', 'http://192.168.0.39:5173',
    'https://velair-front.onrender.com'
  ],
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routes);
app.use(ErrorHandler);



export default app;
