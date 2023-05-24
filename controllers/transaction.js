import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { deposits } from "../email_templates/deposit.js";
import { withdrawal } from "../email_templates/withdrawal.js";
import { approval } from "../email_templates/approval.js";

export const getAllTransactions = async (req, res) => {
  try {
    let newArr = [];
    let parsed = [];
    const transactions = await Transaction.find().sort("-createdAt");

    // console.log(parsed);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: "transactions not found" });
  }
};

export const updateTransactions = async (req, res) => {
  try {
    const { transactionId, action, userEmail, tramount } = req.body;
    const update = { verification: action };
    const filter = transactionId;
    const newInv = await Transaction.findByIdAndUpdate(filter, update);

    if (newInv) {
      const transactions = await Transaction.find().sort("-createdAt");
      res.status(200).json(transactions);

      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "teamwealthgo@gmail.com",
          pass: process.env.NODEMAILER_PASS,
        },
      });

      let details = {
        from: "teamwealthgo@gmail.com",
        to: userEmail,
        subject: `You transaction of $${tramount} has been ${action}`,
        html: approval(tramount, action),
      };

      mailTransporter.sendMail(details, (err) => {
        if (err) {
          console.log("there was an error here", err);
        } else {
          console.log("email has been sent");
        }
      });

      // res.status(200).json(transactions);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await Transaction.find({
      customerId: id,
    }).sort("-createdAt");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: "transactions not found" });
  }
};

export const getDeposits = async (req, res) => {
  try {
    const { id } = req.params;
    const deposits = await Transaction.find({
      $or: [
        { transactionType: "deposits" },
        { transactionType: "Investments Deposit" },
      ],
      $and: [{ customerId: id }],
    }).sort("-createdAt");
    let newDeposits;
    if (deposits && deposits.length !== 0) {
      newDeposits = deposits;
      let newArr = [];
      newDeposits.map(({ amount }) => newArr.push(amount));

      const sumTrans = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
      res.status(200).json({ newDeposits, sumTrans });
    } else if (deposits.length === 0) {
      res.status(200).json({ newDeposits: [] });
    } else {
      return null;
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getWithdrawals = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawals = await Transaction.find({
      customerId: id,
      transactionType: "withdrawal",
    }).sort("-createdAt");

    if (withdrawals && withdrawals.length !== 0) {
      let newArr = [];
      withdrawals.map(({ amount }) => newArr.push(amount));
      const withTotal = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
      res.status(200).json({ withdrawals, withTotal });
    } else if (withdrawals.length === 0) {
      res.status(200).json({ withdrawals: [] });
    }
  } catch (error) {
    res.status(404).json({ message: " no withdrawals transactions  found" });
  }
};

export const withdraw = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, emailId, walletAddress, paymentMethod } = req.body;

    const transactions = await Transaction.find({
      customerId: id,
      transactionType: "deposits",
    }).select("amount");
    let newArr = [];
    transactions.map(({ amount }) => newArr.push(amount));

    const sumTrans = newArr.reduce((acc = 0, amount) => {
      acc = acc + amount;
      return acc;
    });

    console.log(sumTrans);
    if (amount > sumTrans || amount <= 0)
      return res.status(500).json("insufficient balance");

    const newTransactions = new Transaction({
      customerId: id,
      emailId: emailId,
      transactionType: "withdrawal",
      amount: amount,
      paymentMethod: paymentMethod,
    });

    /* Saves  Transaction*/
    const savedTranctions = await newTransactions.save();
    const user = await User.findById(id);

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
      subject: `You made a Withdrawal request of $${amount}`,
      html: withdrawal,
    };

    mailTransporter.sendMail(details, (err) => {
      if (err) {
        console.log("there was an error here", err);
      } else {
        console.log("email has been sent");
      }
    });

    /* Return new Transactions response to the front end*/
    res.status(201).json(savedTranctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, emailId } = req.body;
    if (amount <= 0) return res.status(500).json("Invalid amount");

    const newTransactions = new Transaction({
      customerId: id,
      emailId: emailId,
      transactionType: "deposits",
      amount: amount,
      paymentMethod: paymentMethod,
    });

    /* Saves  Transaction*/
    const savedTranctions = await newTransactions.save();
    const user = await User.findById(id);

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
      subject: `You made a deposit transaction of $${amount}`,
      html: deposits,
    };

    mailTransporter.sendMail(details, (err) => {
      if (err) {
        console.log("there was an error here", err);
      } else {
        console.log("email has been sent");
      }
    });
    /* Return new Transactions response to the front end*/
    res.status(201).json(savedTranctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
