import { MANAGE_ACCOUNT_ENUM } from '../enums'
import inquirer, { QuestionCollection } from 'inquirer'
import { DB } from '../services'

class ManageAccountPrompts {
  async menu(): Promise<MANAGE_ACCOUNT_ENUM> {
    const questions: QuestionCollection = [
      {
        type: 'list',
        name: 'action',
        message: 'Manager menu',
        choices: [
          { name: 'add account', value: MANAGE_ACCOUNT_ENUM.add },
          { name: 'delete accounts', value: MANAGE_ACCOUNT_ENUM.delete },
          { name: 'change name', value: MANAGE_ACCOUNT_ENUM.change_name },
          { name: 'change proxy', value: MANAGE_ACCOUNT_ENUM.change_proxy },
          { type: 'separator' },
          { name: '<- main menu', value: null },
        ],
      },
    ]

    const { action } = await inquirer.prompt(questions)
    return action
  }

  async promptAccounts(message: string): Promise<string[] | null> {
    const accs = DB.getAll().map(({ name }) => name)
    const choices = accs.map((name) => ({
      name,
      value: name,
    }))

    const questions: QuestionCollection = [
      {
        type: 'checkbox',
        name: 'accounts',
        loop: false,
        pageSize: 7,
        message,
        choices: [
          {
            line: '<- select nothing and press enter to return to manager menu',
            type: 'separator',
          },
          { type: 'separator' },
          ...choices,
        ],
      },
    ]

    const { accounts } = await inquirer.prompt(questions)

    return accounts.length > 0 ? accounts : null
  }

  async promptAccount(message: string): Promise<string | null> {
    const accs = DB.getAll().map(({ name }) => name)
    const choices = accs.map((name) => ({
      name,
      value: name,
    }))

    const questions: QuestionCollection = [
      {
        type: 'list',
        name: 'account',
        message,
        loop: false,
        pageSize: 7,
        choices: [...choices, { type: 'separator' }, { name: '<- manager menu', value: null }],
      },
    ]

    const { account } = await inquirer.prompt(questions)
    return account
  }
}

export const manageAccountPrompts = new ManageAccountPrompts()
