import { AccountType } from "@/types";
import { Loader2, Plus, Wallet, Trash2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useUserContext } from "@/contexts/userContext";
import { useCreateAccount, useDeleteAccount } from "@/services/accounts/mutation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface props {
  accounts: AccountType[];
  accountsLoading: boolean;
  onAccountClick: (account: AccountType) => void;
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Account name must be at least 3 characters.",
  }),
  balance: z.string().min(1, {
    message: "Balance can't be empty.",
  }),
  budget: z.string().optional(),
});

const Accounts = ({ accounts, accountsLoading, onAccountClick }: props) => {
  const navigate = useNavigate();
  const { userId } = useUserContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: createAccount, isPending: creatingAccount } =
    useCreateAccount();
  const { mutate: deleteAccount, isPending: deletingAccount } =
    useDeleteAccount();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: "",
      budget: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createAccount(
      { ...values, userId: userId as string },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      }
    );
  }

  const handleDeleteAccount = (accountId: string) => {
    deleteAccount(accountId, {
      onSuccess: () => {
        // Account deleted successfully
      },
    });
  };

  if (accountsLoading) {
    return (
      <div className="mb-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-md mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <div className="bg-white rounded-xl p-5 shadow-sm hover:cursor-pointer border flex flex-col justify-center items-center border-gray-200 hover:shadow-lg hover:bg-slate-100 transition-all duration-200">
                <Plus className="h-10 w-10 text-slate-600 group-hover:text-primary transition-colors duration-200" />
                <span className="text-slate-600 mt-2 group-hover:text-primary transition-colors duration-200">
                  Add account
                </span>
              </div>
            </DrawerTrigger>
            <DrawerContent className="px-6 backdrop-blur-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your account name"
                            {...field}
                            className="border border-black/40"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Balance</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your account balance"
                            {...field}
                            className="border border-black/40"
                            type="number"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your budget"
                            {...field}
                            className="border border-black/40"
                            type="number"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DrawerFooter className="px-0 flex">
                    <Button
                      type="submit"
                      disabled={creatingAccount}
                      className="hover:cursor-pointer"
                    >
                      {creatingAccount && (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      )}
                      {creatingAccount ? "Creating..." : " Create Account"}
                    </Button>
                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        className="hover:cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </Form>
            </DrawerContent>
          </Drawer>

          {accounts?.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 transform "
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2.5 rounded-lg">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {account.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      {account.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  ${account.balance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated:{" "}
                  {new Date(account.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-300 w-1/2 hover:bg-primary hover:text-white hover:cursor-pointer active:bg-[#164ea3] active:text-white"
                  onClick={() => onAccountClick(account)}
                >
                  View Budget
                </Button>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-200 w-1/2 hover:bg-primary hover:text-white hover:cursor-pointer active:bg-[#164ea3] active:text-white"
                  onClick={() =>
                    navigate(`/dashboard/transactions/${account.id}`)
                  }
                >
                  View Transactions
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ml-2"
                      disabled={deletingAccount}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{account.name}"? This action cannot be undone.
                        <br />
                        <br />
                        <strong>Note:</strong> You can only delete accounts that have no transactions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAccount(account.id)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deletingAccount}
                      >
                        {deletingAccount ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Accounts;
