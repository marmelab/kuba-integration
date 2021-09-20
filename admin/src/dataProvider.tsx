import { fetchUtils, DataProvider } from "react-admin";
import { stringify } from "query-string";

const apiUrl = process.env.REACT_APP_API_URL;
const httpClient = fetchUtils.fetchJson;

export const dataProvider: DataProvider = {

  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url, {
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ headers, json }) => {
      return {
      data: json.data,
      total: parseInt(json.total),
    }});
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url, {
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ json }) => ({ data: json.data }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url, {
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers?.get("content-range")?.split("/").pop() as string, 10),
    }));
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
        headers:  new Headers({
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      
    }).then(({ json }) => ({ data: json })),

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
      body: JSON.stringify(params),
      headers:  new Headers({
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(({ json }) => ({ data: json.data }));
  },
};
