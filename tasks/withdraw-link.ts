import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber, utils, constants, ContractTransaction } from "ethers"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { networkConfig, getNetworkIdFromName } from "../helper-hardhat-config"
import { LinkToken, LinkToken__factory, APIConsumer, APIConsumer__factory } from "../typechain"

task("withdraw-link", "Returns any LINK left in deployed contract")
  .addParam("contract", "The address of the contract")
  .addOptionalParam("linkaddress", "Set the LINK token address")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const contractAddr: string = taskArgs.contract
    const networkId: string | null = await getNetworkIdFromName(hre.network.name)

    if (!networkId) return

    //Get signer information
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
    const signer: SignerWithAddress = accounts[0]

    //First, lets see if there is any LINK to withdraw
    const linkTokenAddress = networkConfig[networkId].linkToken || taskArgs.linkaddress

    const linkTokenContract: LinkToken = LinkToken__factory.connect(linkTokenAddress, signer)

    const balance: BigNumber = await linkTokenContract.balanceOf(contractAddr)

    console.log(`LINK balance of contract: ${contractAddr} is ${utils.formatEther(balance)}`)

    if (balance > constants.Zero) {
      // Create connection to Consumer Contract and call the withdraw function
      // TODO: below is an example. APIConsumer needs to have withdrawLink() defined.
      // const apiConsumerContract: APIConsumer = APIConsumer__factory.connect(contractAddr, signer)
      // const transaction: ContractTransaction = await apiConsumerContract.withdrawLink()
      // await transaction.wait()
      // console.log(`All LINK withdrew from contract ${contractAddr}. Transaction Hash: ${transaction.hash}`)
      console.log(`All LINK withdrew from contract ${contractAddr}. TODO:fill in withdraw call.`)
    } else {
      console.log(`Contract doesn't have any LINK to withdraw`)
    }
  })
