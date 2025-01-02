// // app.get("/home/:id", (req, res) => {
// //   console.log(req.params);
// //   res.send("home wowwwwwwwwwwwwwwwwwwwwwwwwwwwww");
// // });
// // app.get(
// //   "/homi/:id",
// //   (req, res, next) => {
// //     console.log(req.params); // Log the params to the console
// //     const sid = req.params.id;
// //     if (sid === "404") {
// //       res.send("home testing");
// //     } else {
// //       next();
// //     }
// //   },
// //   (req, res) => {
// //     res.send("welcome2");
// //   }
// // );
// // app.get("/about", (req, res) => {
// //   res.send("about testing");
// // });
// // app.delete("/contact", (req, res) => {
// //   res.send("about testing");
// // });
// // app.use((req, res) => {
// //   res.send("hello jiiii.....");
// // });

// app.get("/home", (req, res) => {
//   throw new Error("errorsid");

//   res.send("home testing");
// });
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(401).send("ooppsssssss");
//     // } else {
//   }
// });
