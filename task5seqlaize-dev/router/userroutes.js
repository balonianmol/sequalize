const router = require("express").Router();
const userControl = require("../controller/userControl");
const validator = require('../validator/validator')
const passport = require("passport");
const auth = require("../middleware/auth");
router.post("/register", validator.validuser, userControl.register);
router.post("/logIn", passport.authenticate("local", { successRedirect: "/user/success" }),
    (error, req, res, next) => {
        try {
            if (error) {
                throw new Error(error);
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);
router.get("/user/success", (req, res) => {
    res.send(req.user);
  });
  router.get("/user/failed", (req, res) => {
    res.send("authentication failed");
  });
// validator.validlogin,userControl.login

router.get("/getuser", auth, userControl.getUserdata);
router.put("/deleteuser", auth, userControl.deleteuserData);
router.get("/list/", auth, userControl.paginateddataReturn);
router.post("/user/address",validator.validaddress,auth,userControl.createAddress);
router.put("/userdelete/",validator.validaddress, auth, userControl.deleteAddress);
router.post("/user/forgot_password", userControl.passwordResetgenrator);
router.post("/user/verify_reset_password/", auth, userControl.passwordReset);
router.post("/user/uploadImage",auth,multer.single('image'),userControl.uploadimagedata);
module.exports = router