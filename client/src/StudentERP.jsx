import React from 'react'
import ViewStudent from './admin/ViewStudent'
import GradeDisplay from './student/viewGrades'
import ViewGradeERP from './student/ViewGradeERP'
import ViewAttERP from './student/ViewAttERP'

const StudentERP = () => {
  return (
    <>
    <ViewStudent isEditPossible={false} studentId={localStorage.getItem('id')} />
    <ViewGradeERP gid={localStorage.getItem('id')}/>
    <ViewAttERP gid={localStorage.getItem('id')} />
    </>
  )
}

export default StudentERP