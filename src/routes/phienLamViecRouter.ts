import phienLamViecController from "../Controllers/phienLamViecController";


function Router(app) {
  app.get("/", (req, res) => {
    res.json({ ok: true });
  });
app.post("/addPhienLamViec", phienLamViecController.addPhienLamViec)
app.patch("/ketThucPhienLamViec", phienLamViecController.ketThucPhienLamViec)
}

module.exports = Router;
