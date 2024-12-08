import express from "express";
import axios from "axios";
import Pricings from "../Models/Schemas/pricings.js";

const router = express.Router();

router.get("/extras/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const extras = await Pricings.find({ type: "extra" });
    const extrasData = extras.map(({ id, type, title, price, featureKey }) => ({ id, type, title, price, featureKey }));

    const packageResponse = await axios.get(`http://localhost:3000/api/packages/${slug}`);
    const packageData = packageResponse.data;

    const filteredExtras = extrasData.filter(
      (extra) =>
        !extra.featureKey ||
        !packageData.features.some((feature) => feature.name === extra.featureKey)
    );

    res.json(filteredExtras);
  } catch (error) {
    console.error("Error fetching extras:", error);
    res.status(500).json({ message: "Error fetching extras" });
  }
});

export default router;
