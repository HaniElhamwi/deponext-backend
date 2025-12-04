/**
 * classroom controller
 */

import { Core } from "@strapi/strapi";
import { isArray } from "lodash";
import { where } from "lodash/fp";
import { DateTime } from "luxon";

declare const strapi: Core.Strapi;

interface IStorageUnitItem {
  storage_code: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  m2: number;
  m3: number;
  labelDirection: string;
}
export default {
  async createStorageUnit(ctx) {
    const { body } = ctx.request;
    const {
      data,
    }: {
      data: IStorageUnitItem[];
    } = body;

    data.forEach(async (item) => {
      const storageUnit = await strapi
        .documents("api::storage-unit.storage-unit")
        .create({
          data: {
            storageCode: item.storage_code || "",
            row: item.row || 0,
            col: item.col || 0,
            rowSpan: item.rowSpan || 0,
            colSpan: item.colSpan || 0,
            m2: item.m2 || 0,
            m3: item.m3 || 0,
            labelDirection: item.labelDirection || "",
          },
        });
    });
    return {
      success: true,
    };
  },

  getAllStorageUnits(ctx) {
    return strapi.query("api::storage-unit.storage-unit").findMany({
      populate: {
        reservationItems: {
          where: {
            reservationStatus: "active",
          },
        },
      },
    });
  },
};
