import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { updateUser } from "./user.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user === null || undefined)
      return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.find({ email: email });
    if (user && user.length !== 0)
      return res.status(400).json("User already registered");
    console.log(user);
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "teamwealthgo@gmail.com",
        pass: process.env.NODEMAILER_PASS,
      },
    });

    let details = {
      from: "teamwealthgo@gmail.com",
      to: email,
      subject: "Tesing Nodemailer",
      text: "testing testing testing",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WealthGO</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing WealthGO. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
        <p style="font-size:0.9em;">Regards,<br />WealthGO</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Brand Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
    </div>`,
    };
    mailTransporter.sendMail(details, (err) => {
      if (err) {
        console.log("there was an error here", err);
      } else {
        console.log("email has been sent");
      }
    });

    console.log({ OTP });
    const otp = new Otp({ email: email, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();

    return res
      .status(201)
      .json({ message: "OTP sent successfully ", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signupVerify = async (req, res) => {
  try {
    const {
      email,
      otp,
      username,
      address,
      city,
      state,
      country,
      fullName,
      password,
    } = req.body;

    const otpHolder = await Otp.find({ email: email });

    if (otpHolder === 0)
      return res.status(400).json({ message: "OTP Expired" });
    const rightOtp = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(otp, rightOtp.otp);
    if (rightOtp.email === email && validUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      //checking username
      const checkUsername = await User.findOne({ username: username });
      if (checkUsername)
        return res.status(400).json({ message: "Username already exist" });

      /* create register user with hashed password*/
      const newUser = new User({
        fullName,
        email,
        username,
        password: passwordHash,
        address,
        city,
        state,
        country,
      });
      /* Save Registered User*/

      const savedUser = await newUser.save();
      delete savedUser.password;
      /* Return new User response to the front end*/
      res.status(201).json(savedUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(id);
    if (user === null || undefined)
      return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const salt = await bcrypt.genSalt(10);
    const hashNewPass = await bcrypt.hash(newPassword, salt);

    const update = {
      password: hashNewPass,
    };
    const updatedUser = await User.findByIdAndUpdate(id, update);

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.find({ email: email });
    if (!user && user.length == 0)
      return res.status(400).json("User does not exist");
    console.log(user);
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "teamwealthgo@gmail.com",
        pass: process.env.NODEMAILER_PASS,
      },
    });

    let details = {
      from: "teamwealthgo@gmail.com",
      to: email,
      subject: "Reset Your Password",
      text: "testing testing testing",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WealthGO</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing WealthGO. Use the following OTP to Reset Your Password. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
        <p style="font-size:0.9em;">Regards,<br />WealthGO</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Brand Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
    </div>`,
    };
    mailTransporter.sendMail(details, (err) => {
      if (err) {
        console.log("there was an error here", err);
      } else {
        console.log("email has been sent");
      }
    });

    console.log({ OTP });
    const otp = new Otp({ email: email, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();

    return res
      .status(201)
      .json({ message: "OTP sent successfully ", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotVerify = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const otpHolder = await Otp.find({ email: email });

    if (otpHolder === 0)
      return res.status(400).json({ message: "OTP Expired" });
    const rightOtp = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(otp, rightOtp.otp);
    if (rightOtp.email === email && validUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.find({ email: email });
      if (!user)
        return res.status(400).json({ message: "User does not exist" });

      const id = user[0]._id;
      const update = {
        password: passwordHash,
      };
      console.log(id);
      // const hmm = await User.findById(user[0]._id);
      const updatePass = await User.findByIdAndUpdate(id, update);

      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "teamwealthgo@gmail.com",
          pass: process.env.NODEMAILER_PASS,
        },
      });

      let details = {
        from: "teamwealthgo@gmail.com",
        to: email,
        subject: "Your WealthGo password has changed",
        text: "testing testing testing",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WealthGO</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Your WealthGo password has recently changed.</p>
          <p>If you didn’t request this change, please contact our Support team: teamwealthgo@gmail.com for help.</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
          <p style="font-size:0.9em;">Regards,<br />WealthGO</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Your Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>`,
      };
      mailTransporter.sendMail(details, (err) => {
        if (err) {
          console.log("there was an error here", err);
        } else {
          console.log("email has been sent");
        }
      });

      /* Return new User response to the front end*/
      res.status(200).json({ message: "succesfully updated", updatePass });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
