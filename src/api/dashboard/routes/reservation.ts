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
    // list all active reservations sorted by NextPaymentDue priority
    {
      method: "GET",
      path: "/",
      handler: "reservations.listActiveReservations",
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
    // cancel reservation item
    {
      method: "POST",
      path: "/:reservationItemId/cancel",
      handler: "reservations.cancelReservationItem",
      config: {
        policies: [],
      },
    },
    // cancel all reservation items
    {
      method: "POST",
      path: "/:reservationId/cancel-all",
      handler: "reservations.cancelAllReservationItems",
      config: {
        policies: [],
      },
    },
    // process payment for reservation
    {
      method: "POST",
      path: "/:reservationId/payment",
      handler: "reservations.paymentReservation",
      config: {
        policies: [],
      },
    },
  ],
};
