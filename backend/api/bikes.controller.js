const BikesDAO = require("../dao/bikesDAO");

module.exports = {
  async apiGetBikes(req, res) {
    try {
      const itemsPerPage = Math.max(parseInt(req.query.itemsPerPage) || 20, 1);
      const pageNumber = Math.max(parseInt(req.query.pageNumber) || 0, 0);

      const filters = {};
      if (req.query.name) filters.name = req.query.name;
      if (req.query.city) filters.city = req.query.city;
      if (req.query.country) filters.country = req.query.country;

      const { bikesList, total } = await BikesDAO.getBikes({
        filters,
        page: pageNumber,
        itemsPerPage,
      });

      res.json({
        bikes: bikesList,
        totalResults: total,
        pageNumber,
        itemsPerPage,
        filters,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
