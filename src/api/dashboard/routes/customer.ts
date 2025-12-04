export default {
  prefix: "/dashboard/customer",
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "customer.getCustomers",
      config: {
        policies: [],
      },
    },
  ],
};
