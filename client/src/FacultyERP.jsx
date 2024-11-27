import React from 'react'
import ViewStudent from './admin/ViewStudent'
import ViewGradeERP from './student/ViewGradeERP'
import ViewAttERP from './student/ViewAttERP'
import ViewFaculty from './website/ViewFaculty'

const FacultyERP = () => {
  return (
    <div>
      <ViewFaculty isEditPossible={false} facultyId={localStorage.getItem('id')} />
    </div>
  )
}

export default FacultyERP