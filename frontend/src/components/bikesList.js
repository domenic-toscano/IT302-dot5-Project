import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BikesDataService from '../service/bikesDataService';

const BikesList = () => {
  const [bikes, setBikes] = useState([]);
  const [allBikes, setAllBikes] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    retrieveBikes();
  }, []);

  const retrieveBikes = () => {
    setLoading(true);
    setError(null);
    BikesDataService.getAll()
      .then(response => {
        const bikeData = response.data.bikes || response.data || [];
        setBikes(bikeData);
        setAllBikes(bikeData);
        console.log(response.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setError('Failed to load bikes. Backend server may not be running.');
        setLoading(false);
      });
  };

  const refreshList = () => {
    retrieveBikes();
    setSearchTitle('');
  };

  const findBySearch = () => {
    if (searchTitle.trim() === '') {
      retrieveBikes();
      return;
    }

    setLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    params.append('pageNumber', '0');
    params.append('itemsPerPage', '50');
    params.append(searchBy, searchTitle.trim());
    
    const searchUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/dot5/bikes?${params.toString()}`;
    
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        const bikeData = data.bikes || [];
        setBikes(bikeData);
        setAllBikes(bikeData);
        setLoading(false);
        console.log(`Found ${bikeData.length} bikes matching "${searchTitle}" in ${searchBy}`);
      })
      .catch(e => {
        console.error('Search error:', e);
        setError('Search failed. Please try again.');
        setLoading(false);
        setBikes([]);
      });
  };

  const onChangeSearchTitle = (e) => {
    setSearchTitle(e.target.value);
  };

  const onChangeSearchBy = (e) => {
    setSearchBy(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      findBySearch();
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <i className="fas fa-bicycle me-2"></i>Bike Share Systems
                </h3>
              </div>
            </div>

            <div className="card-body">
              {/* Search Section */}
              <div className="row mb-4">
                <div className="col-lg-8 mx-auto">
                  <div className="card border-light">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3">
                          <select 
                            className="form-select" 
                            value={searchBy} 
                            onChange={onChangeSearchBy}
                          >
                            <option value="name">Name</option>
                            <option value="city">City</option>
                            <option value="country">Country</option>
                          </select>
                        </div>
                        <div className="col-md-7">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Search by ${searchBy}...`}
                            value={searchTitle}
                            onChange={onChangeSearchTitle}
                            onKeyPress={handleKeyPress}
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            className="btn btn-primary w-100"
                            onClick={findBySearch}
                          >
                            <i className="fas fa-search me-1"></i>Search
                          </button>
                        </div>
                      </div>
                      {searchTitle && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Searching for "{searchTitle}" in {searchBy}
                            <button 
                              className="btn btn-link btn-sm p-0 ms-2"
                              onClick={() => {setSearchTitle(''); retrieveBikes();}}
                            >
                              Clear
                            </button>
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading bike systems...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="alert alert-warning text-center" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Results */}
              {!loading && !error && (
                <div className="row">
                  {bikes && bikes.length > 0 ? (
                    bikes.map((bike, index) => (
                      <div key={bike._id || index} className="col-lg-4 col-md-6 mb-4">
                        <div className="card h-100 border-0 shadow-sm bike-card">
                          <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="card-title text-primary mb-0">
                                {bike.name || bike.title || 'Unnamed System'}
                              </h5>
                              {bike.ebikes && (
                                <span className="badge bg-success ms-2">
                                  <i className="fas fa-bolt me-1"></i>E-Bikes
                                </span>
                              )}
                            </div>
                            
                            <div className="mb-3 flex-grow-1">
                              <div className="row text-muted small">
                                <div className="col-12 mb-1">
                                  <i className="fas fa-map-marker-alt me-2"></i>
                                  <strong>Location:</strong> 
                                  {bike.location?.city && bike.location?.country ? 
                                    ` ${bike.location.city}, ${bike.location.country}` : 
                                    ' Location not specified'
                                  }
                                </div>
                                {bike.system && (
                                  <div className="col-12 mb-1">
                                    <i className="fas fa-cogs me-2"></i>
                                    <strong>System:</strong> {bike.system}
                                  </div>
                                )}
                                {bike.company && (
                                  <div className="col-12 mb-1">
                                    <i className="fas fa-building me-2"></i>
                                    <strong>Company:</strong> {
                                      Array.isArray(bike.company) ? 
                                        bike.company.join(', ') : 
                                        bike.company
                                    }
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-auto">
                              <Link
                                to={`/dot5/bikes/${bike._id}`}
                                className="btn btn-outline-primary btn-sm w-100"
                              >
                                <i className="fas fa-eye me-2"></i>View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="text-center py-5">
                        <div className="mb-3">
                          <i className="fas fa-search fa-3x text-muted"></i>
                        </div>
                        <h5 className="text-muted">
                          {searchTitle ? 
                            `No bike systems found matching "${searchTitle}"` : 
                            'No bike systems available'
                          }
                        </h5>
                        <p className="text-muted mb-3">
                          {searchTitle ? 
                            'Try adjusting your search criteria or search by a different field.' : 
                            'Please check back later or contact support.'
                          }
                        </p>
                        {searchTitle && (
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => {setSearchTitle(''); retrieveBikes();}}
                          >
                            <i className="fas fa-times me-2"></i>Clear Search
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bike-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .bike-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .form-select:focus,
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default BikesList;