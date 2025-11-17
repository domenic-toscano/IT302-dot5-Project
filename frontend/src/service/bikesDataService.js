import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api/v1/dot5/bikes';

class BikesDataService {
  getAll(page = 0) {
    return axios.get(`${API_URL}?pageNumber=${page}`);
  }

  get(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  find(query, by = 'name', page = 0) {
    return axios.get(`${API_URL}?${by}=${query}&pageNumber=${page}`);
  }

  findByName(name, page = 0) {
    return axios.get(`${API_URL}?name=${name}&pageNumber=${page}`);
  }

  createReview(data) {
    return axios.post(`${API_URL}/review`, data);
  }

  updateReview(data) {
    return axios.put(`${API_URL}/review`, data);
  }

  deleteReview(id, userId) {
    return axios.delete(`${API_URL}/review?id=${id}&userId=${userId}`);
  }

  getGenres() {
    return axios.get(`${API_URL}/genres`);
  }

  create(data) {
    return axios.post(API_URL, data);
  }

  update(id, data) {
    return axios.put(`${API_URL}/id/${id}`, data);
  }

  delete(id) {
    return axios.delete(`${API_URL}/id/${id}`);
  }

  deleteAll() {
    return axios.delete(API_URL);
  }
}

export default new BikesDataService();