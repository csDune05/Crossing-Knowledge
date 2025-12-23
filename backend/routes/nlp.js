import express from "express";

const router = express.Router();

router.get("/accented", async (req, res) => {
  try {
    const text = String(req.query.text || "");
    const baseUrl = process.env.VN_ACCENT_SERVICE_URL || "http://localhost:5000";
    const url = `${baseUrl}/accented?text=${encodeURIComponent(text)}`;

    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ with_accent: "" });
  }
});

export default router;
