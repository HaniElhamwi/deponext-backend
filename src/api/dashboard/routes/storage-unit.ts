export default {
  prefix: "/dashboard/storage-units",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: "storage-unit.createStorageUnit",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/",
      handler: "storage-unit.getAllStorageUnits",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/:storageUnitId",
      handler: "storage-unit.updateStorageUnit",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/seed",
      handler: "storage-unit.seedStorageUnits",
      config: {
        policies: [],
      },
    },
  ],
};
