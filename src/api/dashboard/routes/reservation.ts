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
    // find one by reservation item id
    {
      method: "GET",
      path: "/:reservationItemId",
      handler: "reservations.findOneByReservationItemId",
      config: {
        policies: [],
      },
    },
  ],
};
