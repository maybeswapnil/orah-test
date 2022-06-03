import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [search, setSearch] = useState('')
  const [descView, setDescView] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [sortedData, setSortedData] = useState(data)
  const [present, setPresent] = useState(0)
  const [late, setlate] = useState(0)
  const [abscent, setAbscent] = useState(0)

  console.log(data?.students)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    storeWithStatus(data)
  }, [data])

  useEffect(() => {
    const sortCallback = (a :Person, b :Person) => {
      if(a.first_name>b.first_name) return descView?-1:1;
      if(a.first_name<b.first_name) return !descView?-1:1;
      return 0;
    }
    descView?data?.students.sort(sortCallback):data?.students.sort(sortCallback);
    setSortedData(data)
  }, [descView])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort") {
      setDescView(!descView)
    }
  }

  const storeWithStatus = (dataSample: any) => {
    data?.students.map(r => {
      r.status = 0;
    })
    setSortedData(data)
  }

  const changeStatus = (key: number) => {
    data?.students.map(r => {
      if(r.id===key) {
        if(r.status===3) r.status=1;
        else r.status+=1;
      }
    })
    let p = 0;
    let l = 0;
    let a = 0;
    data?.students.map(r => {
      if(r.status===1) p++;
      if(r.status===2) l++;
      if(r.status===3) a++;
    })
    setPresent(p)
    setlate(l)
    setAbscent(a)
    setSortedData(data)
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} search={setSearch} view={descView}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && sortedData?.students && (
          <>
            {sortedData.students.filter(r => {if((r.first_name + ' ' + r.last_name).toLowerCase().includes(search)) return r}).map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} changeStatus={changeStatus}/>
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} all={sortedData?.students.length||0} present={present||0} late={late||0} abscent={abscent||0}/>
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  search: (action: string, value?: string) => void
  view: boolean
}
const Toolbar: React.FC<ToolbarProps> = ({ onItemClick, search, view }) => {
  return (
    <S.ToolbarContainer>
      <div><Button onClick={(e) => {onItemClick("sort"); e.stopPropagation()}}>Sort {view?"Descending":"Ascending"}</Button></div>
      <div><input type='text' placeholder='Search...' onChange={(e) => search(e.target.value.toLowerCase())}/></div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
