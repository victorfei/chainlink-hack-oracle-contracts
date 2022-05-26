import { networkConfig, getNetworkIdFromName } from "../../helper-hardhat-config"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { APIConsumer, APIConsumer__factory } from "../../typechain"
import { ContractTransaction, utils } from "ethers"

task("request-data", "Calls an API Consumer Contract to request external data")
  .addParam("contract", "The address of the API Consumer contract that you want to call")
  .addParam("query", "The target address of the account whose reputation that you want to look up")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const contractAddr: string = taskArgs.contract
    const query: string = taskArgs.query
    const networkId: string | null = await getNetworkIdFromName(hre.network.name)

    if (!networkId) return

    console.log(`Calling API Consumer contract ${contractAddr} on network ${hre.network.name}`)

    //Get signer information
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
    const signer: SignerWithAddress = accounts[0]

    //Create connection to API Consumer Contract and call the createRequestTo function
    const apiConsumerContract: APIConsumer = APIConsumer__factory.connect(contractAddr, signer)

    const tx: ContractTransaction = await apiConsumerContract.requestReputationData(
      query
    )

    console.log(
      `Contract ${contractAddr} external data request successfully called. Transaction Hash: ${tx.hash}\n`,
      `Run the following to read the returned result:\n`,
      `npx hardhat read-data --contract ${contractAddr} --network ${hre.network.name}`,
    )
  })
