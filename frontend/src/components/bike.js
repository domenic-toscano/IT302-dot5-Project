import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BikesDataService from '../service/bikesDataService';

const Bike = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentBike, setCurrentBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getBike = (id) => {
    setLoading(true);
    BikesDataService.get(id)
      .then(response => {
        setCurrentBike(response.data);
        console.log('Bike data:', response.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setError('Error retrieving bike data');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      getBike(id);
    }
  }, [id]);

  const formatCompany = (company) => {
    if (!company) return 'N/A';
    if (Array.isArray(company)) {
      return company.join(', ');
    }
    return company;
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/dot5/bikes')}
        >
          Back to Bikes List
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {currentBike ? (
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">Bike Share System Details</h2>
                  <button 
                    className="btn btn-light btn-sm" 
                    onClick={() => navigate('/dot5/bikes')}
                  >
                    <i className="fas fa-arrow-left me-1"></i>Back to List
                  </button>
                </div>
              </div>
              
              <div className="card-body">
                <div className="text-center mb-4">
                  <h3 className="text-primary">{currentBike.name || 'Unnamed Bike System'}</h3>
                  <p className="text-muted">System ID: {currentBike.id}</p>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card border-light mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0"><i className="fas fa-info-circle me-2"></i>Basic Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row mb-2">
                          <div className="col-sm-4"><strong>Name:</strong></div>
                          <div className="col-sm-8">{currentBike.name || 'N/A'}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-sm-4"><strong>System:</strong></div>
                          <div className="col-sm-8">{currentBike.system || 'N/A'}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-sm-4"><strong>Company:</strong></div>
                          <div className="col-sm-8">{formatCompany(currentBike.company)}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-sm-4"><strong>E-Bikes:</strong></div>
                          <div className="col-sm-8">
                            {currentBike.ebikes ? 
                              <span className="badge bg-success">Available</span> : 
                              <span className="badge bg-secondary">Not Available</span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-light mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0"><i className="fas fa-map-marker-alt me-2"></i>Location</h5>
                      </div>
                      <div className="card-body">
                        <div className="row mb-2">
                          <div className="col-sm-4"><strong>City:</strong></div>
                          <div className="col-sm-8">{currentBike.location?.city || 'N/A'}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-sm-4"><strong>Country:</strong></div>
                          <div className="col-sm-8">{currentBike.location?.country || 'N/A'}</div>
                        </div>
                        {currentBike.location?.latitude && currentBike.location?.longitude && (
                          <div className="row mb-2">
                            <div className="col-sm-4"><strong>Coordinates:</strong></div>
                            <div className="col-sm-8">
                              <span className="badge bg-info text-dark">
                                {currentBike.location.latitude.toFixed(4)}, {currentBike.location.longitude.toFixed(4)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Image */}
                {currentBike.image && (
                  <div className="card border-light mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0"><i className="fas fa-image me-2"></i>System Image</h5>
                    </div>
                    <div className="card-body text-center">
                      <img 
                        src={currentBike.image} 
                        alt={`${currentBike.name} bike sharing system`}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(currentBike.source || currentBike.license || currentBike.lastUpdated) && (
                  <div className="card border-light">
                    <div className="card-header bg-light">
                      <h5 className="mb-0"><i className="fas fa-plus-circle me-2"></i>Additional Information</h5>
                    </div>
                    <div className="card-body">
                      {currentBike.source && (
                        <div className="row mb-2">
                          <div className="col-sm-3"><strong>Data Source:</strong></div>
                          <div className="col-sm-9">
                            <a href={currentBike.source} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                              <i className="fas fa-external-link-alt me-1"></i>View Source
                            </a>
                          </div>
                        </div>
                      )}
                      {currentBike.license && (
                        <div className="row mb-2">
                          <div className="col-sm-3"><strong>License:</strong></div>
                          <div className="col-sm-9">
                            {currentBike.license.url ? (
                              <a href={currentBike.license.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                                <i className="fas fa-certificate me-1"></i>{currentBike.license.name || 'License Info'}
                              </a>
                            ) : (
                              <span className="badge bg-info">{currentBike.license.name || 'Licensed'}</span>
                            )}
                          </div>
                        </div>
                      )}
                      {currentBike.lastUpdated && (
                        <div className="row mb-2">
                          <div className="col-sm-3"><strong>Last Updated:</strong></div>
                          <div className="col-sm-9">
                            <span className="badge bg-secondary">
                              {new Date(currentBike.lastUpdated.$date || currentBike.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-5">
          <div className="alert alert-warning text-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>No bike data available
          </div>
          <div className="text-center">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dot5/bikes')}
            >
              <i className="fas fa-arrow-left me-1"></i>Back to Bikes List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bike;