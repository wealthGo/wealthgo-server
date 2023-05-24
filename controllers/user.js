import Investment from "../models/Investment.js";
import Ticket from "../models/Ticket.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(400).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    // if (!users) return res.status(404).json({ msg: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    //get total pending withdrawals
    const withdrawals = await Transaction.find({
      customerId: id,
      transactionType: "withdrawal",
      verification: "pending",
    }).sort("-createdAt");
    let newArr = [];
    let withTotal = 0;
    if (!withdrawals || withdrawals.length === 0) {
      withTotal = 0;
    } else {
      withdrawals.map(({ amount }) => newArr.push(amount));
      withTotal = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total pending deposits
    const deposits = await Transaction.find({
      customerId: id,
      transactionType: "deposits",
      verification: "pending",
    }).sort("-createdAt");
    newArr = [];
    let sumTrans;
    if (!deposits || deposits.length === 0) {
      sumTrans = 0;
    } else {
      deposits.map(({ amount }) => newArr.push(amount));

      sumTrans = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total approved withdrawals
    const twithdrawal = await Transaction.find({
      customerId: id,
      transactionType: "withdrawal",
      verification: "approved",
    }).sort("-createdAt");
    newArr = [];
    let twithTotal;

    if (!twithdrawal || twithdrawal.length === 0) {
      twithTotal = 0;
    } else {
      twithdrawal.map(({ amount }) => newArr.push(amount));
      twithTotal = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total approved deposits
    const tdeposits = await Transaction.find({
      $or: [
        { transactionType: "deposits" },
        { transactionType: "Investments Deposit" },
      ],
      $and: [{ verification: "approved" }, { customerId: id }],
    }).sort("-createdAt");

    // console.log(tdeposits);
    newArr = [];
    let tsumTrans;
    if (!tdeposits || tdeposits.length === 0) {
      tsumTrans = 0;
    } else {
      tdeposits.map(({ amount }) => newArr.push(amount));

      tsumTrans = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //investments logic
    const activeInvestments = await Investment.find({
      customerId: id,
      active: "active",
    });
    const currInvestment = activeInvestments[activeInvestments.length - 1];
    let pendInv;

    if (!activeInvestments || activeInvestments.length === 0) {
      pendInv = 0;
    } else {
      newArr = [];
      activeInvestments.map(({ investAmount }) => newArr.push(investAmount));
      pendInv = newArr.reduce((acc = 0, investAmount) => {
        acc = acc + investAmount;
        return acc;
      });
    }

    let planName = "";
    let planAmount;
    if (!currInvestment) {
      planName = "N/A";
      planAmount = 0;
      // console.log(currInvestment);
    } else {
      planName = currInvestment.planName;
      planAmount = currInvestment.investAmount;
    }
    let accBalance = sumTrans - withTotal;
    let currentBalance = tsumTrans - twithTotal;

    const payOut = await Investment.find({
      customerId: id,
      active: "inactive",
    });

    newArr = [];
    let totalEarnings;
    if (!payOut || payOut.length === 0) {
      totalEarnings = 0;
    } else {
      payOut.map(({ interest }) => newArr.push(interest));
      totalEarnings = newArr.reduce((acc = 0, interest) => {
        acc = acc + interest;
        return acc;
      });
    }

    res.status(200).json({
      pendingBalance: accBalance.toFixed(2),
      pendingDeposits: sumTrans.toFixed(2),
      pendingWithdrawals: withTotal.toFixed(2),
      totalWithdrawals: twithTotal.toFixed(2),
      totalDeposits: tsumTrans.toFixed(2),
      plan: planName,
      currPlanAmount: planAmount,
      totalEarnings,
      activeInvestments: pendInv,
      currentBalance,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return null;
    }
    const noOfUsers = users.length;
    const tickets = await Ticket.find();
    const closedTickets = await Ticket.find({ status: "closed" });

    if (!users) {
      return null;
    }
    const noOfTickets = tickets.length;
    const pendingTickets = noOfTickets - closedTickets.length;
    //get total pending withdrawals
    const withdrawals = await Transaction.find({
      transactionType: "withdrawal",
      verification: "pending",
    }).sort("-createdAt");
    let newArr = [];
    let withTotal = 0;
    if (!withdrawals || withdrawals.length === 0) {
      withTotal = 0;
    } else {
      withdrawals.map(({ amount }) => newArr.push(amount));
      withTotal = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total pending deposits
    const deposits = await Transaction.find({
      transactionType: "deposits",
      verification: "pending",
    }).sort("-createdAt");
    newArr = [];
    let sumTrans;
    if (!deposits || deposits.length === 0) {
      sumTrans = 0;
    } else {
      deposits.map(({ amount }) => newArr.push(amount));

      sumTrans = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total approved withdrawals
    const twithdrawal = await Transaction.find({
      transactionType: "withdrawal",
      verification: "approved",
    }).sort("-createdAt");
    newArr = [];
    let twithTotal;

    if (!twithdrawal || twithdrawal.length === 0) {
      twithTotal = 0;
    } else {
      twithdrawal.map(({ amount }) => newArr.push(amount));
      twithTotal = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total approved deposits
    const tdeposits = await Transaction.find({
      $or: [
        { transactionType: "deposits" },
        { transactionType: "Investments Deposit" },
      ],
      $and: [{ verification: "approved" }],
    }).sort("-createdAt");

    // console.log(tdeposits);
    newArr = [];
    let tsumTrans;
    if (!tdeposits || tdeposits.length === 0) {
      tsumTrans = 0;
    } else {
      tdeposits.map(({ amount }) => newArr.push(amount));

      tsumTrans = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //investments logic

    let accBalance = sumTrans - withTotal;
    let currentBalance = tsumTrans - twithTotal;

    res.status(200).json({
      noOfUsers: noOfUsers,
      noOfTickets,
      pendingTickets,
      pendingBalance: accBalance.toFixed(2),
      pendingDeposits: sumTrans.toFixed(2),
      pendingWithdrawals: withTotal.toFixed(2),
      totalWithdrawals: twithTotal.toFixed(2),
      totalDeposits: tsumTrans.toFixed(2),
      currentBalance,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBalance = async (req, res) => {
  try {
    const { id } = req.params;
    //get total approved withdrawals
    const twithdrawal = await Transaction.find({
      customerId: id,
      transactionType: "withdrawal",
      verification: "approved",
    }).sort("-createdAt");
    let newArr = [];
    let twithTotal;

    if (!twithdrawal || twithdrawal.length === 0) {
      twithTotal = 0;
    } else {
      twithdrawal.map(({ amount }) => newArr.push(amount));
      twithTotal = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    //get total approved deposits
    const tdeposits = await Transaction.find({
      $or: [
        { transactionType: "deposits" },
        { transactionType: "Investments Deposit" },
      ],
      $and: [{ verification: "approved" }, { customerId: id }],
    }).sort("-createdAt");
    newArr = [];
    let tsumTrans;
    if (!tdeposits || tdeposits.length === 0) {
      tsumTrans = 0;
    } else {
      tdeposits.map(({ amount }) => newArr.push(amount));

      tsumTrans = newArr.reduce((acc = 0, amount) => {
        acc = acc + amount;
        return acc;
      });
    }

    let currentBalance = tsumTrans - twithTotal;
    res.status(200).json({ currentBalance });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, address, city, state, country } = req.body;

    const update = {
      fullName: fullName,
      address: address,
      city: city,
      state: state,
      country: country,
    };
    const user = await User.findByIdAndUpdate(id, update);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    // if (!users) return res.status(404).json({ msg: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
