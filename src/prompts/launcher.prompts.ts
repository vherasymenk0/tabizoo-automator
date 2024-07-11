import inquirer, { QuestionCollection } from 'inquirer'
import { LAUNCH_MODE_ENUM } from '../enums'

export const launchPrompt = async (): Promise<`${LAUNCH_MODE_ENUM}`> => {
  const questions: QuestionCollection = [
    {
      type: 'list',
      name: 'action',
      message: 'Main menu',
      choices: [
        { name: 'Account manager', value: LAUNCH_MODE_ENUM.manager },
        { name: 'Run automator', value: LAUNCH_MODE_ENUM.automator },
        { type: 'separator' },
        { name: 'exit', value: null },
      ],
    },
  ]

  const { action } = await inquirer.prompt(questions)
  return action
}
