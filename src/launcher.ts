import { launchPrompt, manageAccountPrompts } from './prompts'
import { FLAG_ENUM, LAUNCH_MODE_ENUM, MANAGE_ACCOUNT_ENUM } from './enums'
import { runAutomator } from './automator'
import { Account } from './services'
import * as process from 'node:process'

export const launcher = async (flag?: string) => {
  const runManager = async (): Promise<void> => {
    const option = await manageAccountPrompts.menu()

    switch (option) {
      case MANAGE_ACCOUNT_ENUM.add:
        await Account.add()
        return runManager()
      case MANAGE_ACCOUNT_ENUM.delete:
        const accounts = await manageAccountPrompts.promptAccounts(
          'Select the accounts that you want to delete',
        )

        if (accounts) await Account.delete(accounts)
        return runManager()
      case MANAGE_ACCOUNT_ENUM.change_name:
        const name = await manageAccountPrompts.promptAccount(
          'Select the account you want to change the name',
        )

        if (name) await Account.changeName(name)
        return runManager()
      case MANAGE_ACCOUNT_ENUM.change_proxy:
        const account = await manageAccountPrompts.promptAccount(
          'Select the account you want to change the proxy',
        )

        if (account) await Account.changeProxy(account)
        return runManager()
      default:
        launcher(flag)
    }
  }

  if (flag === FLAG_ENUM.au) return runAutomator()
  if (flag === FLAG_ENUM.ma) return runManager()
  const action = await launchPrompt()

  switch (action) {
    case LAUNCH_MODE_ENUM.manager:
      await runManager()
      break
    case LAUNCH_MODE_ENUM.automator:
      await runAutomator()
      break
    default:
      process.exit(0)
  }
}
