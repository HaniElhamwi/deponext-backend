/**
 * classroom controller
 */

import { Core } from "@strapi/strapi";
import { isArray } from "lodash";
import { DateTime } from "luxon";

declare const strapi: Core.Strapi;

interface ICustomerItem {
  customer_code: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  m2: number;
  m3: number;
  labelDirection: string;
}
export default {
  async getCustomers(ctx) {
    const customers = await strapi
      .documents("api::customer.customer")
      .findMany();
    return customers;
  },
};
