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
    // Get pagination parameters from query
    const page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    const pageSize = ctx.query.pageSize ? parseInt(ctx.query.pageSize) : 10;
    const offset = (page - 1) * pageSize;
    const search = ctx.query.search || "";

    // Build filters for search
    const filters: any = {};
    if (search) {
      filters.$or = [
        {
          fullName: {
            $containsi: search,
          },
        },
        {
          email: {
            $containsi: search,
          },
        },
        {
          phone: {
            $containsi: search,
          },
        },
      ];
    }

    // Get paginated customers with search filters
    const customers = await strapi
      .documents("api::customer.customer")
      .findMany({
        limit: pageSize,
        offset: offset,
        filters,
      });

    // Get total count for pagination metadata
    const total = await strapi.documents("api::customer.customer").count({
      filters,
    });

    return {
      data: customers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },
  async seedCustomers(ctx) {
    const { count = 10 } = ctx.request.body;

    if (count <= 0 || count > 1000) {
      return ctx.badRequest("Count must be between 1 and 1000");
    }

    const firstNames = [
      "Ahmed",
      "Fatima",
      "Mohammed",
      "Aisha",
      "Hassan",
      "Layla",
      "Ali",
      "Noor",
      "Omar",
      "Sara",
    ];
    const lastNames = [
      "Al-Rashid",
      "Al-Mansouri",
      "Al-Maktoum",
      "Al-Nuaimi",
      "Al-Qasimi",
      "Al-Murr",
      "Al-Falasi",
      "Al-Zaabi",
      "Al-Mansoori",
      "Al-Shehi",
    ];

    const createdCustomers = [];

    for (let i = 0; i < count; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomNum = Math.floor(Math.random() * 10000);
      const fullName = `${firstName} ${lastName}`;

      const customer = await strapi.documents("api::customer.customer").create({
        data: {
          fullName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@example.com`,
          phone: `+971${Math.floor(Math.random() * 900000000 + 100000000)}`,
        },
      });

      createdCustomers.push(customer);
    }

    return {
      message: `Successfully created ${count} random customers`,
      count: createdCustomers.length,
      customers: createdCustomers,
    };
  },
  async createCustomer(ctx) {
    const { fullName, email, phone, taxNumber } = ctx.request.body;

    // Validation
    if (!fullName || !email || !phone) {
      return ctx.badRequest("fullName, email, and phone are required fields");
    }

    // Check if email already exists
    const existingCustomer = await strapi
      .documents("api::customer.customer")
      .findMany({
        filters: {
          email,
        },
        limit: 1,
      });

    if (existingCustomer.length > 0) {
      return ctx.badRequest("Email already exists");
    }

    // Create new customer
    const customer = await strapi.documents("api::customer.customer").create({
      data: {
        fullName,
        email,
        phone,
        taxNumber: taxNumber || null,
      },
    });

    return {
      message: "Customer created successfully",
      customer,
    };
  },
};
