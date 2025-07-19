import request from "@/utils/request";
import { Response, URLConstant } from "@/app/api/URLConstant";

export const testApi = async (params:{
  name: string
}) => {
  return request.get<Response<string>>(URLConstant.TEST, params)
};
