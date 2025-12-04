import { where } from "lodash/fp";
import { Core } from "@strapi/strapi";

declare const strapi: Core.Strapi;

export default {
  async createReservation(ctx) {
    const { body } = ctx.request;
    const reservation = await strapi
      .documents("api::reservation.reservation")
      .create({
        data: {
          startDate: body.startDate,
          NextPaymentDue: body.NextPaymentDue,
          customer: {
            documentId: body.customer.documentId,
          },

          isActive: true,
          price: body.price,
        },
      });

    for (const unit of body.units) {
      await strapi.documents("api::reservation-item.reservation-item").create({
        data: {
          unit: {
            documentId: unit.documentId,
          },
          reservation: {
            documentId: reservation.documentId,
          },
          startDate: body.startDate,
          reservationStatus: "active",
        },
      });
    }

    return reservation;
  },
  async findOneByReservationItemId(ctx) {
    const { reservationItemId } = ctx.params;
    const reservations = await strapi
      .documents("api::reservation.reservation")
      .findMany({
        filters: {
          reservationItems: {
            documentId: reservationItemId,
          },
        },
        populate: {
          customer: true,
          reservationItems: {
            populate: {
              unit: true,
            },
          },
        },
      });
    return reservations.length > 0 ? reservations[0] : ctx.notFound();
  },
};
