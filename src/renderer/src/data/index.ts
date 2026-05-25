import type { BlockDefinition } from '../types'
import { triggers } from './triggers'
import { actions } from './actions'
import { conditions } from './conditions'
import { logicBlocks } from './logic'

export const allBlocks: BlockDefinition[] = [...triggers, ...actions, ...conditions, ...logicBlocks]

export const blockMap = new Map<string, BlockDefinition>()
allBlocks.forEach((b) => blockMap.set(b.id, b))

export function getBlockById(id: string): BlockDefinition | undefined {
  return blockMap.get(id)
}
