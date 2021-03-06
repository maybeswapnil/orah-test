import React, { useEffect, useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Person, PersonHelper } from "shared/models/person"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  changeStatus: (key: number, status: RolllStateType) => void
  student: Person
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, student, changeStatus}) => {
  const [rollState, setRollState] = useState(student?.status)

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    if(rollState==='unmark') changeStatus(student.id, 'present')
    if(rollState==='present') changeStatus(student.id, 'late')
    if(rollState==='late') changeStatus(student.id, 'absent')
    if(rollState==='absent') changeStatus(student.id, 'present')
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
