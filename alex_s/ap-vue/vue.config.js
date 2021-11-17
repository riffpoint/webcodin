module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/vue-admin/" : "/",
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Vue Admin Panel";
      return args;
    });
  },
};
