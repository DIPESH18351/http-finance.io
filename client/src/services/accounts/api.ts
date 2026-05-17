import backend from "@/axios-instance";
import { CreateAccountData, updateAccountData } from "@/types";

export const getAllAccounts = async (userId: string) => {
  const res = await backend.get(`/accounts/get-all-accounts/${userId}`);
  console.log(res.data);
  return res.data;
};

export const getSingleAccount = async (accountId: string) => {
  const res = await backend.get(`/accounts/get-account/${accountId}`);
  return res.data;
};

export const createAccount = async (data: CreateAccountData) => {
  const res = await backend.post("/accounts/create-account", data);
  return res.data;
};

export const updateAccount = async (data: updateAccountData) => {
  const res = await backend.patch("/accounts/update-account", data);
  return res.data;
};

export const deleteAccount = async (accountId: string) => {
  const res = await backend.delete(`/accounts/delete-account/${accountId}`);
  return res.data;
};
