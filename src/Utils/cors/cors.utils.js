export function corsOption() {
  const whitelist = process.env.WHITELIST

  const corsOptions = {
    origin: function (origin, cb) {
      if (!origin) {
        return cb(null, true);
      }
      if (whitelist.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not Allowed By Cors", { cause: 400 }));
      }
    },
    methods: ["GET", "POST", "DELETE", "PATCH"],
  };
  return corsOptions;
}
