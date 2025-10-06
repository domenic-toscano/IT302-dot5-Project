// Domenic Toscano
// 10/5/25
// IT302-451
// Project Phase 2
// dot5@njit.edu

let bikes; 

module.exports = class BikesDAO {
  static async injectDB(conn, dbName = "it302", collectionName = "CitiBikes_dot5") {
    if (bikes) return; 
    try {
      bikes = conn.db(dbName).collection(collectionName);
    } catch (e) {
      console.error(`Unable to establish collection handles in BikesDAO: ${e}`);
      throw e;
    }
  }

  /**
   * Retrieves bikes with optional filters + pagination
   * @param {Object} params
   * @param {Object} params.filters - { name, city, country }
   * @param {number} params.page - zero-based page number
   * @param {number} params.itemsPerPage - page size
   */
  static async getBikes({ filters = {}, page = 0, itemsPerPage = 20 } = {}) {
    const query = {};

    if (filters.name) {
      query.name = { $regex: `^${escapeRegex(filters.name)}$`, $options: "i" };
    }
    if (filters.city) {
      query["location.city"] = { $regex: escapeRegex(filters.city), $options: "i" };
    }
    if (filters.country) {
      query["location.country"] = { $regex: `^${escapeRegex(filters.country)}$`, $options: "i" };
    }

    try {
      const cursor = bikes
        .find(query)
        .skip(page * itemsPerPage)
        .limit(itemsPerPage);

      const bikesList = await cursor.toArray();
      const total = await bikes.countDocuments(query);

      return { bikesList, total };
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { bikesList: [], total: 0 };
    }
  }
};

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
