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
    {
      method: "POST",
      path: "/",
      handler: "customer.createCustomer",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/seed",
      handler: "customer.seedCustomers",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/:customerId",
      handler: "customer.deleteCustomer",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/:customerId",
      handler: "customer.updateCustomer",
      config: {
        policies: [],
      },
    },
  ],
};
