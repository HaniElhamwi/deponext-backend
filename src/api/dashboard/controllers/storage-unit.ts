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
  labelDirection: "left" | "right" | "top" | "bottom";
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
            labelDirection: item.labelDirection,
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
  async seedStorageUnits(ctx) {
    const storageUnitsData: Array<{
      storageCode: string;
      row: number;
      col: number;
      rowSpan: number;
      colSpan: number;
      m2: number;
      m3: number;
      labelDirection: "left" | "right" | "top" | "bottom";
    }> = [
      {
        storageCode: "A101",
        row: 19,
        col: 5,
        rowSpan: 1,
        colSpan: 1,
        m2: 5,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "A119",
        row: 15,
        col: 30,
        rowSpan: 3,
        colSpan: 1,
        m2: 8,
        m3: 20,
        labelDirection: "left",
      },
      {
        storageCode: "C127",
        row: 1,
        col: 22,
        rowSpan: 1,
        colSpan: 1,
        m2: 5.5,
        m3: 12,
        labelDirection: "bottom",
      },
      {
        storageCode: "D103",
        row: 5,
        col: 15,
        rowSpan: 2,
        colSpan: 2,
        m2: 5.5,
        m3: 24,
        labelDirection: "left",
      },
      {
        storageCode: "A118",
        row: 19,
        col: 29,
        rowSpan: 1,
        colSpan: 1,
        m2: 8.5,
        m3: 21,
        labelDirection: "top",
      },
      {
        storageCode: "B107",
        row: 15,
        col: 11,
        rowSpan: 1,
        colSpan: 1,
        m2: 5,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "A109",
        row: 19,
        col: 15,
        rowSpan: 1,
        colSpan: 2,
        m2: 5,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "C103",
        row: 5,
        col: 9,
        rowSpan: 1,
        colSpan: 1,
        m2: 4,
        m3: 11.5,
        labelDirection: "top",
      },
      {
        storageCode: "C118",
        row: 1,
        col: 13,
        rowSpan: 1,
        colSpan: 1,
        m2: 5.5,
        m3: 12,
        labelDirection: "bottom",
      },
      {
        storageCode: "A126",
        row: 16,
        col: 11,
        rowSpan: 1,
        colSpan: 1,
        m2: 5,
        m3: 12,
        labelDirection: "bottom",
      },
      {
        storageCode: "C105",
        row: 5,
        col: 11,
        rowSpan: 1,
        colSpan: 1,
        m2: 6,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "A122",
        row: 16,
        col: 7,
        rowSpan: 1,
        colSpan: 1,
        m2: 6,
        m3: 15,
        labelDirection: "bottom",
      },
      {
        storageCode: "E102",
        row: 10,
        col: 30,
        rowSpan: 2,
        colSpan: 1,
        m2: 10,
        m3: 26,
        labelDirection: "left",
      },
      {
        storageCode: "A102",
        row: 19,
        col: 6,
        rowSpan: 1,
        colSpan: 1,
        m2: 5,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "B111",
        row: 15,
        col: 21,
        rowSpan: 1,
        colSpan: 3,
        m2: 5,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "D105",
        row: 8,
        col: 12,
        rowSpan: 1,
        colSpan: 1,
        m2: 7,
        m3: 17,
        labelDirection: "right",
      },
      {
        storageCode: "E108",
        row: 1,
        col: 30,
        rowSpan: 1,
        colSpan: 1,
        m2: 12,
        m3: 31,
        labelDirection: "left",
      },
      {
        storageCode: "B104",
        row: 15,
        col: 8,
        rowSpan: 1,
        colSpan: 1,
        m2: 5,
        m3: 13,
        labelDirection: "top",
      },
      {
        storageCode: "C130",
        row: 1,
        col: 25,
        rowSpan: 1,
        colSpan: 1,
        m2: 5.5,
        m3: 12,
        labelDirection: "bottom",
      },
      {
        storageCode: "A118",
        row: 7,
        col: 2,
        rowSpan: 3,
        colSpan: 2,
        m2: 7.7,
        m3: 15,
        labelDirection: "right",
      },
    ];

    try {
      const createdUnits = [];

      for (const unitData of storageUnitsData) {
        // Check if unit already exists
        const existing = await strapi
          .documents("api::storage-unit.storage-unit")
          .findMany({
            filters: {
              storageCode: unitData.storageCode,
            },
            limit: 1,
          });

        if (existing.length > 0) {
          continue; // Skip if already exists
        }

        const unit = await strapi
          .documents("api::storage-unit.storage-unit")
          .create({
            data: unitData,
          });

        createdUnits.push(unit);
      }

      return {
        message: `Successfully created ${createdUnits.length} storage units`,
        count: createdUnits.length,
        units: createdUnits,
      };
    } catch (error) {
      return ctx.badRequest(`Error seeding storage units: ${error.message}`);
    }
  },
};
