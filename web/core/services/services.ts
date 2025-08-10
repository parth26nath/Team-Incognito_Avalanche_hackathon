import axios from "@/core/config/axios";
import { utils } from "@/core/helper";

const Services = {
  post: async function (authUrl: any, payload: any) {
    return axios
      .post(authUrl, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        utils.showErrMsg(utils.handleErr(error));
      });
  },

  get: async function (url: any) {
    return axios
      .get(url)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  getFilter: async function (url: any, filter: any) {
    Object.keys(filter).forEach((k) => {
      if (
        filter[k] === "" ||
        filter[k] === null ||
        filter[k] === undefined ||
        !filter[k]
      ) {
        delete filter[k];
      }
    });
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(url + "?" + filterString)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  put: async function (url: any, payload: any) {
    return axios
      .put(url, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
};

export default Services;
