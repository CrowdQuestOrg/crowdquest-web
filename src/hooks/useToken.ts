import { ethers, getAddress } from "ethers";
import { TOKEN_ADDRESS, CROWD_QUEST_ADDRESS } from "../constants/contracts";
import TokenABI from "../abis/CrowdQuestToken.json";

export const useToken = () => {
  /**
   * Internal helper to ensure addresses are EIP-55 compliant.
   * This prevents the "bad address checksum" TypeError.
   */
  const sanitizeAddress = (addr: string): string => {
    try {
      return getAddress(addr.toLowerCase());
    } catch (e) {
      console.error(`Invalid address format: ${addr}`);
      return addr;
    }
  };

  const getContract = async () => {
    if (!(window as any).ethereum) return null;
    
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // Sanitize the Token Address itself just in case
      const safeTokenAddress = sanitizeAddress(TOKEN_ADDRESS);
      
      return new ethers.Contract(safeTokenAddress, TokenABI.abi, signer);
    } catch (error) {
      console.error("Failed to initialize token contract:", error);
      return null;
    }
  };

  /**
   * Checks how many tokens the CrowdQuest contract is allowed to spend
   */
  const checkAllowance = async (ownerAddress: string) => {
    if (!ownerAddress) return "0";

    try {
      const contract = await getContract();
      if (!contract) return "0";

      // CRITICAL: Sanitize both addresses before the blockchain call
      const safeOwner = sanitizeAddress(ownerAddress);
      const safeSpender = sanitizeAddress(CROWD_QUEST_ADDRESS);

      const allowance = await contract.allowance(safeOwner, safeSpender);
      
      return ethers.formatEther(allowance);
    } catch (error) {
      console.error("Allowance check failed:", error);
      return "0";
    }
  };

  /**
   * Grants permission to the CrowdQuest contract to move tokens
   */
  const approve = async (amount: string) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");

    try {
      const safeSpender = sanitizeAddress(CROWD_QUEST_ADDRESS);
      const parsedAmount = ethers.parseEther(amount);

      const tx = await contract.approve(safeSpender, parsedAmount);
      
      console.log("Approval broadcasted:", tx.hash);
      return await tx.wait();
    } catch (error) {
      console.error("Approval transaction failed:", error);
      throw error;
    }
  };

  return { checkAllowance, approve };
};