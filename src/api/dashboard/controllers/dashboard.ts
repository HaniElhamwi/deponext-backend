/**
 * classroom controller
 */

import { Core } from "@strapi/strapi";

declare const strapi: Core.Strapi;

export default {
  async helloWorld(ctx) {
    return "Hello World";
  },
};
