export default {
  routes: [
    {
      method: "GET",
      path: "/dashboard",
      handler: "dashboard.helloWorld",
      config: {
        policies: [],
      },
    },
  ],
};
