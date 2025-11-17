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
    let query = {};

    // If no filters, return all bikes
    if (!filters.name && !filters.city && !filters.country) {
      query = {};
    } else {
      if (filters.name) {
        // Try multiple name-related fields for broader search
        query.$or = [
          { name: { $regex: createPartialMatchRegex(filters.name), $options: "i" } },
          { id: { $regex: createPartialMatchRegex(filters.name), $options: "i" } },
          { "name": { $regex: createPartialMatchRegex(filters.name), $options: "i" } }
        ];
      }
      if (filters.city) {
        // Partial match for city (contains the search term)
        const cityQuery = { "location.city": { $regex: createPartialMatchRegex(filters.city), $options: "i" } };
        query = filters.name ? { $and: [query, cityQuery] } : cityQuery;
      }
      if (filters.country) {
        // Partial match for country (contains the search term)
        const countryQuery = { "location.country": { $regex: createPartialMatchRegex(filters.country), $options: "i" } };
        query = (filters.name || filters.city) ? { $and: [query, countryQuery] } : countryQuery;
      }
    }

    // Add some debugging
    console.log('Search filters:', filters);
    console.log('MongoDB Query:', JSON.stringify(query, null, 2));

    try {
      // First, let's see what fields actually exist in a sample document
      const sampleDoc = await bikes.findOne({});
      console.log('Sample document structure:', JSON.stringify(sampleDoc, null, 2));

      const cursor = bikes
        .find(query)
        .skip(page * itemsPerPage)
        .limit(itemsPerPage);

      const bikesList = await cursor.toArray();
      const total = await bikes.countDocuments(query);
      
      console.log(`Found ${bikesList.length} bikes out of ${total} total matches`);
      
      // Log first result for debugging
      if (bikesList.length > 0) {
        console.log('First result:', JSON.stringify(bikesList[0], null, 2));
      }

      return { bikesList, total };
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { bikesList: [], total: 0 };
    }
  }

  /**
   * Get a single bike by its ID
   * @param {string} id - The bike ID (can be ObjectId or string id)
   */
  static async getBikeById(id) {
    try {
      console.log('DAO: Looking for bike with ID:', id);
      
      let query;
      
      // Try to match by ObjectId first
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const { ObjectId } = require('mongodb');
        query = { _id: new ObjectId(id) };
        console.log('Using ObjectId query:', query);
      } else {
        // If not ObjectId format, search by the 'id' field
        query = { id: id };
        console.log('Using id field query:', query);
      }
      
      const bike = await bikes.findOne(query);
      console.log('Found bike:', bike ? 'Yes' : 'No');
      
      return bike;
    } catch (e) {
      console.error(`Unable to get bike by ID: ${e}`);
      return null;
    }
  }
};

function escapeRegex(text) {
  // For partial matching, we only need to escape the most dangerous regex chars
  // but allow the text to match as a substring anywhere in the field
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createPartialMatchRegex(text) {
  // Create a regex that matches the text anywhere in the string (partial match)
  // Only escape the truly dangerous characters that could break the regex
  const escaped = text.replace(/[\\^$.*+?{}[\]|()\-]/g, "\\$&");
  return escaped;
}
