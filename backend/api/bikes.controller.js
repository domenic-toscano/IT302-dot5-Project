// Domenic Toscano
// 10/5/25
// IT302-451
// Project Phase 2
// dot5@njit.edu

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

  async apiGetBikeById(req, res) {
    try {
      const bikeId = req.params.id;
      console.log('Looking for bike with ID:', bikeId);
      
      const bike = await BikesDAO.getBikeById(bikeId);
      
      if (!bike) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      res.json(bike);
    } catch (err) {
      console.error('Error getting bike by ID:', err);
      res.status(500).json({ error: err.message });
    }
  },
};
