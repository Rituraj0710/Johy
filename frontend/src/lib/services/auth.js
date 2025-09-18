import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "../utils/env.js";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${getApiBaseUrl()}/api/user/`,
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => {
        // console.log("create user data-", user);
        return {
          url: "register",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    verifyEmail: builder.mutation({
      query: (user) => {
        // console.log("otp",user);
        return {
          url: `verify-email`,
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: "login",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", //It is required to set cookie
        };
      },
    }),
    getUser: builder.query({
      query: () => {
        return {
          url: "profile",
          method: "GET",
          credentials: "include",
        };
      },
    }),
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: "logout",
          method: "POST",
          body: {},
          credentials: "include",
        };
      },
    }),
    resetPasswordLink: builder.mutation({
      query: (user) => {
        return {
          url: "reset-password-link",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data) => {
        const { id, token, ...values } = data;
        const actualData = { ...values };
        return {
          url: `/reset-password/${id}/${token}`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    changePassword: builder.mutation({
      query: (actualData) => {
        return {
          url: `change-password`,
          method: "POST",
          body: actualData,
          credentials: "include",
        };
      },
    }),
    contactUs: builder.mutation({
      query: (actualData) => {
        return {
          url: `contact`,
          method: "POST",
          body: actualData,
          credentials: "include",
        };
      },
    }),
  }),
});

// export const {
//   useCreateUserMutation,
//   useVerifyEmailMutation,
//   useLoginUserMutation,
//   useGetUserQuery,
//   useLogoutUserMutation,
//   useResetPasswordLinkMutation,
//   useResetPasswordMutation,
//   useChangePasswordMutation,
//   useContactUsMutation,
// } = authApi;

// Define a service for agent using a base URL and expected endpoints
export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${getApiBaseUrl()}/api/agent/`,
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    createAgent: builder.mutation({
      query: (user) => {
        // console.log("create user data-", user);
        return {
          url: "agent-register",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    verifyAgentEmail: builder.mutation({
      query: (user) => {
        // console.log("otp",user);
        return {
          url: `agent-verify-email`,
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginAgent: builder.mutation({
      query: (user) => {
        return {
          url: "agent-login",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", //It is required to set cookie
        };
      },
    }),
    getAgent: builder.query({
      query: () => {
        return {
          url: "agent-profile",
          method: "GET",
          credentials: "include",
        };
      },
    }),
    logoutAgent: builder.mutation({
      query: () => {
        return {
          url: "agent-logout",
          method: "POST",
          body: {},
          credentials: "include",
        };
      },
    }),
    resetAgentPasswordLink: builder.mutation({
      query: (user) => {
        return {
          url: "reset-password-link",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    resetAgentPassword: builder.mutation({
      query: (data) => {
        const { id, token, ...values } = data;
        const actualData = { ...values };
        return {
          url: `/reset-password/${id}/${token}`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    changeAgentPassword: builder.mutation({
      query: (actualData) => {
        return {
          url: `agent-change-password`,
          method: "POST",
          body: actualData,
          credentials: "include",
        };
      },
    }),
  }),
});

// Export user API hooks
export const {
  useCreateUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useLogoutUserMutation,
  useResetPasswordLinkMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useContactUsMutation,
} = authApi;

// Export agent API hooks
export const {
  useCreateAgentMutation,
  useVerifyAgentEmailMutation,
  useLoginAgentMutation,
  useGetAgentQuery,
  useLogoutAgentMutation,
  useResetAgentPasswordLinkMutation,
  useResetAgentPasswordMutation,
  useChangeAgentPasswordMutation,
} = agentApi;
