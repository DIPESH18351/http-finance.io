import prisma from "../utils/prisma.js";

export const createAccount = async (req, res) => {
  try {
    const { userId, name, balance, budget } = req.body;

    // Validate required fields
    if (!userId || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new account
    const newAccount = await prisma.account.create({
      data: {
        name,
        balance: balance || 0,
        budget: budget || null,
        usedAmount: 0,
        userId,
      },
    });

    res.status(201).json({
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleAccount = async (req, res) => {
  const { accountId } = req.params;
  if (!accountId) {
    return res.status(400).json({ error: "Account ID is required" });
  }
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    message: "Account fetched successfully",
    data: account,
  });
};

export const getAllAccounts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Accounts fetched successfully",
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAccount = async (req, res) => {
  const { name, budget, id } = req.body;

  if (!name && !budget) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }), // Update name if provided
        ...(budget !== undefined &&
          budget !== "" && { budget: Number(budget) }),
      },
    });

    res.json({ message: "Account updated successfully", updatedAccount });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Account update failed" });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Fetch account details first
    const account = await prisma.account.findUnique({
      where: { id },
      include: { transactions: true }, // Fetch related transactions
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.transactions.length > 0) {
      return res.status(400).json({
        error: "Cannot delete account with existing transactions",
      });
    }

    await prisma.account.delete({ where: { id } });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Account deletion failed", details: error });
  }
};
