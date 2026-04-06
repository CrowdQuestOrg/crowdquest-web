// hooks/use-toast.ts - Check what your hook returns
import { toast } from "../hooks/use-toast";

export const notifyTransaction = (txHash: string) => {
  toast({
    title: "Transaction Sent!",
    description: `View on Etherscan: https://sepolia.etherscan.io/tx/${txHash}`,
  });
};