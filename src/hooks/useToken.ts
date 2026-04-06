import { ethers } from "ethers";
import { TOKEN_ADDRESS, CROWD_QUEST_ADDRESS } from "../constants/contracts";
import TokenABI from "../abis/CrowdQuestToken.json";

export const useToken = () => {
  const getContract = async () => {
    if (!(window as any).ethereum) return null;
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(TOKEN_ADDRESS, TokenABI.abi, signer);
  };

  // Check how much the CrowdQuest contract is allowed to spend
  const checkAllowance = async (ownerAddress: string) => {
    const contract: any = await getContract();
    const allowance = await contract.allowance(ownerAddress, CROWD_QUEST_ADDRESS);
    return ethers.formatEther(allowance);
  };

  // Approve the CrowdQuest contract to spend tokens
  const approve = async (amount: string) => {
    const contract: any = await getContract();
    const tx = await contract.approve(CROWD_QUEST_ADDRESS, ethers.parseEther(amount));
    return await tx.wait();
  };

  return { checkAllowance, approve };
};