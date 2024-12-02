import express from "express";
const router = express.Router();
import Package from "../Models/Schemas/packages.js";

router.get("/packages", async (req, res) => {
  try{
    const allPackages = await Package.find();
    res.json(allPackages);
  } catch (err) {
    res.status(500).json({ definition: "Packages fetching error", message: err });
  }
})

router.get("/packages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const foundPackage =  await Package.findOne({ slug: slug });
    res.json(foundPackage);
  } catch (err) {
    res.status(500).json({ definition: "Package fetching error", message: err });
  }
});

export default router;
