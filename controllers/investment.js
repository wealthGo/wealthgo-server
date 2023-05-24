import nodemailer from "nodemailer";
import Investment from "../models/Investment.js";
import EventEmitter from "events";
import schedule from "node-schedule";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { investment } from "../email_templates/investment.js";

export const invest = async (req, res) => {
  try {
    const { customerId, investAmount, planName, percent, email } = req.body;
    const event = new EventEmitter();
    let t = 0;
    if (planName === "plan1") {
      t = 24;
    } else if (planName === "plan2") {
      t = 36;
    } else if (planName === "plan3") {
      t = 48;
    } else {
      t = 72;
    }
    const now = new Date();
    const ddd = new Date(now.getTime() + t * 60 * 60 * 1000);

    const newInvestment = new Investment({
      planName,
      customerId,
      emailId: email,
      investAmount,
      expirationTime: ddd,
    });

    const data = await newInvestment.save();

    res.status(201).json(data);

    const created = () => {
      const abb = new Date(now.getTime() + 21600000);
      const task = schedule.scheduleJob(abb, async () => {
        console.log("Running a task");
        await scheduleUPdate();
        event.emit("JOB COMPLETED");
      });

      event.on("JOB COMPLETED", () => {
        console.log("Job done");
        task.cancel();
      });
    };

    created();

    async function scheduleUPdate() {
      const updatedAmount = investAmount * percent;
      const update = { interest: updatedAmount, active: "inactive" };
      const filter = data._id;
      const newInv = await Investment.findByIdAndUpdate(filter, update);

      if (newInv) {
        if (investAmount <= 0) return res.status(500).json("Invalid amount");
        let newDepo = 0;
        newDepo = updatedAmount + JSON.parse(investAmount);
        console.log(newDepo);

        const newTransactions = new Transaction({
          customerId: customerId,
          emailId: email,
          transactionType: "Investments Deposit",
          amount: newDepo,
          paymentMethod: "Balance",
          verification: "approved",
        });

        const user = await User.findById(customerId);

        let mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "teamwealthgo@gmail.com",
            pass: process.env.NODEMAILER_PASS,
          },
        });

        let details = {
          from: "teamwealthgo@gmail.com",
          to: user.email,
          subject: `Your Investment deposit of $${newDepo} just landed in you wallet`,
          html: investment,
        };

        mailTransporter.sendMail(details, (err) => {
          if (err) {
            console.log("there was an error here", err);
          } else {
            console.log("email has been sent");
          }
        });

        const savedDeposit = await newTransactions.save();
      } else throw new Error();
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getInvestments = async (req, res) => {
  try {
    const { id } = req.params;

    const investments = await Investment.find({ customerId: id }).sort(
      "-createdAt"
    );

    if (!investments) return res.status(404).json("No data found");

    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
