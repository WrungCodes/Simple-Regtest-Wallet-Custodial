import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import router from "../routes";
import { toast } from "react-toastify";

const errorHandler = {
  async onQueryStarted(
    arg,
    {
      dispatch,
      getState,
      extra,
      requestId,
      queryFulfilled,
      getCacheEntry,
      updateCachedData,
    }
  ) {
    try {
      await queryFulfilled;
    } catch (e) {
      const { status, data } = e.error;

      if (status === 401) {
        router.navigate("/login");

        return;
      }

      toast.error(data.error && data.error.message);
    }
  },
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  tagTypes: ["User", "GeneralData"],
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
      ...errorHandler,
    }),

    loginUser: build.mutation({
      query: (body) => ({
        url: "auth/signin",
        method: "POST",
        body,
      }),
      ...errorHandler,
    }),

    getAllData: build.query({
      query: () => ({
        url: "/",
        credentials: "include",
      }),
      providesTags: ["GeneralData"],
      ...errorHandler,
    }),

    initializeBankLink: build.mutation({
      query: () => ({
        method: "GET",
        url: "/bank/link/begin",
      }),
      ...errorHandler,
    }),

    addPublicToken: build.mutation({
      query: (body) => ({
        method: "POST",
        url: "/bank/link/confirm",
        body,
      }),
      ...errorHandler,

      invalidatesTags: ["GeneralData"],
    }),

    fetchRates: build.query({
      query: (id) => ({
        url: `/asset/${id}/rate`,
      }),
      ...errorHandler,
    }),

    tradeAsset: build.mutation({
      query: (body) => ({
        url: "/trade",
        method: "POST",
        body,
      }),
      ...errorHandler,

      invalidatesTags: ["GeneralData"],
    }),

    logoutUser: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      ...errorHandler,
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetAllDataQuery,
  useInitializeBankLinkMutation,
  useAddPublicTokenMutation,
  useFetchRatesQuery,
  useTradeAssetMutation,
  useLogoutUserMutation,
} = api;
