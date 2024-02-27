import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const headers = new Headers();

// headers.append("Access-Control-Allow-Origin", "*");
// headers.append("Cross-Origin-Opener-Policy:", "cross-origin");
// headers.append("Cross-Origin-Resource-Policy", "cross-origin");

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  tagTypes: ["User"],
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
    }),

    loginUser: build.mutation({
      query: (body) => ({
        url: "auth/signin",
        method: "POST",
        body,
      }),
    }),

    getAllData: build.query({
      query: () => ({
        url: "/",
        credentials: "include",
      }),
    }),

    initializeBankLink: build.mutation({
      query: () => ({
        method: "GET",
        url: "/bank/link/begin",
      }),
    }),

    addPublicToken: build.mutation({
      query: (body) => ({
        method: "POST",
        url: "/bank/link/confirm",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetAllDataQuery,
  useInitializeBankLinkMutation,
  useAddPublicTokenMutation,
} = api;
