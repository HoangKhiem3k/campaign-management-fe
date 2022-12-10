import axiosClient from "../utils/axiosInterceptor";

const testService = {
  getAll(params){
    const url = '/get-all'
    return axiosClient.get(url, {params: params})
  },
  get(id){
    const url = `/get-by-id/${id}`
    return axiosClient.get(url)
  },
  add(data){
    const url = '/add'
    return axiosClient.post(url, data)
  },
  update(data){
    const url = `/update/${data.id}`
    return axiosClient.post(url, data)
  },
  remove(id){
    const url = `/delete/${id}`
    return axiosClient.delete(url)
  }

};
export default testService;
