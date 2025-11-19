import express from "express";
import cotizacionRoutes from "./routes/cotizacion.routes.js";

const app = express();
app.use(express.json());

app.use("/api/quotations", cotizacionRoutes);

export default app;


