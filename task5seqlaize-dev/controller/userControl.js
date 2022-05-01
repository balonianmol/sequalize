const dbops = require('../usermodels/modelindex')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { validationResult }
    = require('express-validator');
const multer =require("../middleware/multer");
const cloudinary = require('cloudinary').v2;
require("dotenv").config();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const register = async (req, res) => {
    try {
        const data = validationResult(req)
        if (!data.isEmpty()) {
            res.send(data)
        }
        if (req.body.password !== req.body.confpass) {
            console.error;
        }
        let saltRounds = await bcrypt.genSalt(10);
        let encrypt = await bcrypt.hashSync(req.body.password, saltRounds);
        let dataSucess = await dbops.dataWrite.create({
            userName: req.body.userName,
            password: encrypt,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        })
        let token = jwt.sign({ registration: dataSucess.id }, process.env.key, {
            expiresIn: "1h",
        });
        const msg = {
            to: 'abaloni02@gmail.com', 
            from: 'anmol@excellencetechnologies.in', 
            subject: 'registration sucessfull',
            text: 'thanks for registering thank you',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          }
         await sgMail
        .send(msg);
        res.send(token);
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
}
const login = async (req, res) => {
    try {
        const data = validationResult(req)
        if (!data.isEmpty()) {
            res.send(data)
        }
        let user = await dbops.dataWrite.findOne({
            where: { userName: req.body.userName }
        });
        if (user) {
            let decryption = await bcrypt.compare(req.body.password, user.password);
            if (decryption == true) {
                let token = jwt.sign({ user_id: user.id }, process.env.key, {
                    expiresIn: "1h",
                });
                res.send(token);
            }
        } else {
            res.send("Invalid Password");
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }

}
const getUserdata = async (req, res) => {
    try {
        let decoded = req.user;
        let user = await dbops.dataWrite.findOne({
            where: { id: decoded.user_id }
        });
        if (user) { res.send(user) }
        else {
            res.send(404);
        }

    }
    catch (error) {
        console.log(error);
        res.json({
            status: 500,
            message: error,
        });
    }

}
const deleteuserData = async (req, res) => {
    try {
        let decoded = req.user;
        let user = await dbops.dataWrite.findOne({
            where: { id: decoded.user_id }
        });
        if (user) {
            await dbops.dataWrite.destroy({ where: { id: decoded.user_id } });
        }
        else {
            console.log("data does not exist");
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 500,
            message: error,
        });
    }
}
const paginateddataReturn = async (req, res) => {
    try {
        const { page = req.params.id, pagelimit = 10 } = req.params;
        if (page < 1) { page = 1 }
        const posts = dbops.dataWrite.findAll(

            {
                where: { createdByID: id },
                offset: page * pagelimit,
                limit: pagelimit,
            }
        )
        res.send(posts)
    } catch (error) {
        console.log(error);
        res.json({
            status: 500,
            message: error,
        });
    }

}
const createAddress = async (req, res) => {
    try {
        const data = validationResult(req)
        if (!data.isEmpty()) {
            res.send(data)
        }
        let uid = req.user;
        let createdadta = await dbops.useraddressdataupdate.create({
            userid: uid.registration,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            phonenumber: req.body.phonenumber,
            pincode: req.body.pincode,
        });

        res.send(createdadta);
    } catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
};
const deleteAddress = async (req, res) => {
    try {
        const data = validationResult(req)
        if (!data.isEmpty()) {
            res.send(data)
        }
        let uid = req.user;
        let adress = await dbops.useraddressdataupdate.findOne({
            where: { userid: uid.registration }
        });
        if (!adress) { res.send('invalid address') }
        else {
            await dbops.useraddressdataupdate.destroy({
                where: {
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    phonenumber: req.body.phonenumber,
                    pincode: req.body.pincode,

                }
            })
            res.send('data deleted')
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }

}
const passwordResetgenrator = async (req, res) => {
    try {
        let user = await dbops.dataWrite.findOne({
            where: { email: req.body.email }
        });
        console.log(user)
        if (!user) {
            res.send('enter valid email')
        } else {
            let token1 = jwt.sign({ registration: user.id }, process.env.key, {
                expiresIn: "1800s",
            });
            const msg = {
                to: 'abaloni02@gmail.com', 
                from: 'anmol@excellencetechnologies.in', 
                subject: 'password reset',
                text: 'you requested to reset the password',
                html: `<link>http://localhost:3000/user/verify_reset_password/${token}</link>`,
              }
             await sgMail
            .send(msg);
            await dbops.tokendata.create({
                userid: user.id,
                token: token1
            })
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
};
const passwordReset = async (req, res) =>{
    try{  let user =req.user;
        let tokencheck = await dbops.tokendata.findOne({where:{userid:user.registration}});
        if(tokencheck){
            let saltRounds = await bcrypt.genSalt(10);
            let passwordNew = await bcrypt.hashSync(req.body.password, saltRounds);
            await dbops.dataWrite.update(
                { password: passwordNew },
                { where: { id: user.registration } }
              )
              const msg = {
                to: 'abaloni02@gmail.com', 
                from: 'anmol@excellencetechnologies.in', 
                subject: 'password reset sucessfully',
                text: 'you sucessfully reseted the passowrd',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
              }
             await sgMail
            .send(msg)
            await dbops.tokendata.destroy({where:{userid:user.registration}});
         }
         else{res.send('token expired')}
    }
    catch (error) {
        console.log(error);
        res.json({
            status: 0,
            message: error,
        });
    }
}
const uploadimagedata= async(req,res) =>{
    try{
    let decode = req.user
    cloudinary.config({
      cloud_name:process.env.cloudinary_cloud_name  ,
      api_key: process.env.cloudinary_cloud_api_key,
      api_secret: process.env.cloudinary_cloud_api_secret 
    }); 
    let result = await cloudinary.uploader.upload(req.file.path)
    await dbops.dataWrite.update({id:decode.registration},{imageurl:result.secure_url})
     }
    catch(error){
      console.log(error);
      res.json({
        status: 0,
        message: error,
      });
    }
  }
module.exports = {
    register,
    login,
    getUserdata,
    deleteuserData,
    paginateddataReturn,
    createAddress,
    deleteAddress,
    passwordResetgenrator,
    passwordReset,
    uploadimagedata,
};