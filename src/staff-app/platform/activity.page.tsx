import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { RollState } from "staff-app/components/activity/RollState"

export const ActivityPage: React.FC = () => {

  const [getRolls, data, loadState] = useApi<{ activity: Person[] }>({ url: "get-activities" })

  useEffect(() => {
    void getRolls()
  }, [getRolls])

  return <S.Container>
            <div>Activity Page</div>
            {loadState === "loading" && (
              <CenteredContainer>
                <FontAwesomeIcon icon="spinner" size="2x" spin />
              </CenteredContainer>
            )}
            {loadState === "loaded" && data?.activity && (
            <>
              {data?.activity.map((s) => { return (
                <RollState RollStateName={s.entity.name} CreatedAt={s.entity.completed_at}/>
              )})}
            </>
            )}
            
         </S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
