import axios from "axios";

export const apiUrl = import.meta.env.VITE_MIDDLEWARE_URL;

export function useApp() {
  async function optimization(formData) {
    try {
      const response = await axios.post(apiUrl + "/invest4nature/optimizations", formData, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function costBenefitMapInfo() {
    try {
      const response = await axios.get(apiUrl + "/invest4nature/optimizations/nbs_costs_benefits_map_info?with_subcategories=true", {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function costBenefitMap() {
    try {
      const response = await axios.get(apiUrl + "/invest4nature/optimizations/nbs_costs_benefits_map", {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }


  async function extractNBS(text) {
    try {
      const response = await axios.post(apiUrl + "/invest4nature/indicators/extract", {text}, {withCredentials: true} );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function getNbsMapInfo() {
    try {
      const response = await axios.get(apiUrl + "/invest4nature/indicators/nbs_map_info", {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function calculateIndicators(payload) {
    try {
      const response = await axios.post(apiUrl + "/invest4nature/indicators/from_nbs", payload, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function recommend(formData) {
    try {
      const response = await axios.post(apiUrl + "/invest4nature/recommendations", formData, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function extractMostSignificantNBS(payload) {
    try {
      const response = await axios.post(apiUrl + "/invest4nature/indicators/to_nbs", payload, {withCredentials: true});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return { optimization, costBenefitMapInfo, costBenefitMap, recommend, extractNBS, getNbsMapInfo, calculateIndicators, extractMostSignificantNBS };
}
