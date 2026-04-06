// import { ethers } from "ethers";
// import { TOKEN_ADDRESS, CROWD_QUEST_ADDRESS } from "../constants/contracts";
// import TokenABI from "../abis/CrowdQuestToken.json";

// export const useToken = () => {
//   const getContract = async () => {
//     if (!(window as any).ethereum) return null;
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     const signer = await provider.getSigner();
//     return new ethers.Contract(TOKEN_ADDRESS, TokenABI.abi, signer);
//   };

//   // Check how much the CrowdQuest contract is allowed to spend
//   const checkAllowance = async (ownerAddress: string) => {
//     const contract: any = await getContract();
//     const allowance = await contract.allowance(ownerAddress, CROWD_QUEST_ADDRESS);
//     return ethers.formatEther(allowance);
//   };

//   // Approve the CrowdQuest contract to spend tokens
//   const approve = async (amount: string) => {
//     const contract: any = await getContract();
//     const tx = await contract.approve(CROWD_QUEST_ADDRESS, ethers.parseEther(amount));
//     return await tx.wait();
//   };

//   return { checkAllowance, approve };
// };


import { ethers, getAddress } from "ethers";
import { TOKEN_ADDRESS, CROWD_QUEST_ADDRESS } from "../constants/contracts";
import TokenABI from "../abis/CrowdQuestToken.json";

export const useToken = () => {
  const getContract = async () => {
    if (!(window as any).ethereum) return null;
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(TOKEN_ADDRESS, TokenABI.abi, signer);
  };

  const checkAllowance = async (ownerAddress: string) => {
    try {
      if (!ownerAddress) return "0";
      const contract = await getContract();
      if (!contract) return "0";
      
      // We use getAddress on both to ensure checksums are perfect
      const allowance = await contract.allowance(
        getAddress(ownerAddress), 
        getAddress(CROWD_QUEST_ADDRESS)
      );
      return ethers.formatEther(allowance);
    } catch (error) {
      console.error("Allowance check failed:", error);
      return "0";
    }
  };

  const approve = async (amount: string) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");
    
    const tx = await contract.approve(
      getAddress(CROWD_QUEST_ADDRESS), 
      ethers.parseEther(amount)
    );
    return await tx.wait();
  };

  return { checkAllowance, approve };
};