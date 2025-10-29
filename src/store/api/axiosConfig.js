// src/store/api/axiosConfig.js
import axios from 'axios';

const BASE_URL = 'https://wallet.b.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export { api, BASE_URL };