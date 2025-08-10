import { toast } from "react-toastify";

export const handleErr = (err: any) => {
  const resMessage =
    err?.response?.data?.message || err?.message || err.toString();
  return resMessage;
};

export const handleSuccess = (resp: any) => {
  return resp?.data?.data;
};

export const showSuccessMsg = (msg: any) => {
  toast.success(msg, { autoClose: 2000 });
};

export const showErrMsg = (msg: any) => {
  toast.error(msg, { autoClose: 2000 });
};
