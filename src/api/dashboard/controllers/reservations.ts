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
            filters: {
              // end date is null
              endDate: {
                $null: true,
              },
            },
          },
        },
      });
    return reservations.length > 0 ? reservations[0] : ctx.notFound();
  },
  async cancelReservationItem(ctx) {
    const { reservationItemId } = ctx.params;

    // Get the reservation item
    const reservationItem = await strapi
      .documents("api::reservation-item.reservation-item")
      .findOne({
        documentId: reservationItemId,
        populate: {
          reservation: {
            fields: ["documentId"],
          },
        },
      });

    if (!reservationItem) {
      return ctx.notFound();
    }

    // Get the associated reservation with all its items
    const reservation = await strapi
      .documents("api::reservation.reservation")
      .findOne({
        documentId: reservationItem.reservation.documentId,
        populate: {
          reservationItems: true,
        },
      });

    // Get current date
    const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Filter active reservation items (those without endDate)
    const activeItems = reservation.reservationItems.filter(
      (item) => !item.endDate
    );

    // Update the reservation item with endDate and cancelled status
    await strapi.documents("api::reservation-item.reservation-item").update({
      documentId: reservationItemId,
      data: {
        endDate: currentDate,
        reservationStatus: "cancelled",
      },
    });

    // If this is the only active reservation item, mark the reservation as inactive
    if (activeItems.length === 1) {
      await strapi.documents("api::reservation.reservation").update({
        documentId: reservation.documentId,
        data: {
          isActive: false,
        },
      });
    }

    return {
      message: "Reservation item cancelled successfully",
      endDate: currentDate,
    };
  },
  async cancelAllReservationItems(ctx) {
    const { reservationId } = ctx.params;

    // Get the reservation with all its items
    const reservation = await strapi
      .documents("api::reservation.reservation")
      .findOne({
        documentId: reservationId,
        populate: {
          reservationItems: true,
        },
      });

    if (!reservation) {
      return ctx.notFound();
    }

    // Get current date
    const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Update all reservation items with endDate and cancelled status
    for (const item of reservation.reservationItems) {
      await strapi.documents("api::reservation-item.reservation-item").update({
        documentId: item.documentId,
        data: {
          endDate: currentDate,
          reservationStatus: "cancelled",
        },
      });
    }

    // Mark the reservation as inactive
    await strapi.documents("api::reservation.reservation").update({
      documentId: reservationId,
      data: {
        isActive: false,
      },
    });

    return {
      message: "All reservation items cancelled successfully",
      endDate: currentDate,
      itemsCancelled: reservation.reservationItems.length,
    };
  },
  async listActiveReservations(ctx) {
    // Get pagination parameters from query
    const page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    const pageSize = ctx.query.pageSize ? parseInt(ctx.query.pageSize) : 10;
    const offset = (page - 1) * pageSize;

    // Get all active reservations with sorting at DB level
    const reservations = await strapi
      .documents("api::reservation.reservation")
      .findMany({
        filters: {
          isActive: true,
        },
        populate: {
          customer: true,
          reservationItems: {
            populate: {
              unit: {
                fields: ["storageCode", "id"],
              },
            },
            filters: {
              // Only get items without endDate (active items)
              endDate: {
                $null: true,
              },
            },
          },
        },
        sort: {
          NextPaymentDue: "asc", // Sort by NextPaymentDue ascending (soonest first)
        },
        limit: pageSize,
        offset: offset,
      });

    // Get total count for pagination metadata
    const total = await strapi.documents("api::reservation.reservation").count({
      filters: {
        isActive: true,
      },
    });

    return {
      data: reservations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },
  async paymentReservation(ctx) {
    const { reservationId } = ctx.params;
    const { months, newPrice } = ctx.request.body;

    // Validate input
    if (!months || months <= 0) {
      return ctx.badRequest("Months must be a positive number");
    }

    // Get the reservation
    const reservation = await strapi
      .documents("api::reservation.reservation")
      .findOne({
        documentId: reservationId,
      });

    if (!reservation) {
      return ctx.notFound();
    }

    // Calculate new NextPaymentDue by adding months
    const currentPaymentDue = new Date(reservation.NextPaymentDue);
    currentPaymentDue.setMonth(currentPaymentDue.getMonth() + months);

    // Format date as YYYY-MM-DD
    const newPaymentDue = currentPaymentDue.toISOString().split("T")[0];

    // Update reservation with new price and extended payment due date
    const updatedReservation = await strapi
      .documents("api::reservation.reservation")
      .update({
        documentId: reservationId,
        data: {
          NextPaymentDue: newPaymentDue,
          price: newPrice,
        },
      });

    return {
      message: "Payment processed successfully",
      reservation: updatedReservation,
      details: {
        monthsExtended: months,
        newPrice,
        newPaymentDue,
      },
    };
  },
};
