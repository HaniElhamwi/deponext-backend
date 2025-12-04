export default {
  prefix: "/dashboard/reservations",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: "reservations.createReservation",
      config: {
        policies: [],
      },
    },
  ],
};
