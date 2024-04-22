module.exports = {
  name: "online-classroom-pens-streaming-v1",
  watch: true,
  script: "bun run start -p 4000",
  ignore_watch: ["node_modules", "dist", "logs", "public"],
  interpreter: "bun",
  exec_mode: "cluster",
  instances: "max",
};
